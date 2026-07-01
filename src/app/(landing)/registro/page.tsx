"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { empresaService } from "@/services/empresa.service";
import { validarRucSchema, type ValidarRucInput } from "@/lib/schemas/empresa.schema";
import { useToast } from "@/hooks/useToast";
import { Building2, ArrowRight } from "lucide-react";

const STEPS = [
  { label: "Validar RUC" },
  { label: "Datos empresa" },
  { label: "Confirmación" },
];

export default function RegistroPage() {
  const router  = useRouter();
  const toast   = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidarRucInput>({ resolver: zodResolver(validarRucSchema) });

  async function onSubmit(data: ValidarRucInput) {
    setLoading(true);
    try {
      const result = await empresaService.validarRuc(data.ruc);
      sessionStorage.setItem("ruc_data", JSON.stringify(result.data));
      router.push("/registro/datos");
    } catch (error: any) {
      console.error(error.response?.data || error);
      
      // Bypass para testing local si el backend no tiene la API de SUNAT lista
      if (data.ruc === "20100070970" || data.ruc === "20000000000") {
        const mockData = {
          ruc: data.ruc,
          razon_social: "Empresa de Pruebas S.A.C.",
          nombre_comercial: "Empresa Prueba",
          direccion: "Av. Principal 123",
          estado: "ACTIVO"
        };
        sessionStorage.setItem("ruc_data", JSON.stringify(mockData));
        toast.success("Modo Desarrollo: RUC aceptado (Mock).");
        router.push("/registro/datos");
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.detail || "Verifica que el RUC sea correcto y esté activo en SUNAT.";
        toast.error(`Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Crea tu cuenta</h1>
        <p className="text-sm text-neutral-500 mt-1">30 días gratis, sin tarjeta de crédito</p>
      </div>

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={0} />
      </div>

      <Card padding>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-brand-pale rounded-lg">
            <Building2 size={18} className="text-brand flex-shrink-0" />
            <p className="text-xs text-brand-dark">
              Ingresa el RUC de tu empresa para verificar los datos con SUNAT automáticamente.
            </p>
          </div>

          <Input
            label="RUC de la empresa"
            placeholder="20100070970"
            maxLength={11}
            required
            error={errors.ruc?.message}
            {...register("ruc")}
          />

          <Button type="submit" fullWidth loading={loading} rightIcon={<ArrowRight size={16} />}>
            Verificar RUC
          </Button>
        </form>
      </Card>

      <p className="text-center text-xs text-neutral-400">
        ¿Ya tienes cuenta?{" "}
        <a href="/admin/login" className="text-brand font-medium">
          Ingresar
        </a>
      </p>
    </div>
  );
}