"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Card } from "@/components/ui";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { FormSection } from "@/components/forms/FormSection";
import { empresaService } from "@/services/empresa.service";
import { registrarEmpresaSchema, type RegistrarEmpresaInput } from "@/lib/schemas/empresa.schema";
import { useToast } from "@/hooks/useToast";
import { usePlanes } from "@/hooks/usePlanes";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { label: "Validar RUC" },
  { label: "Datos empresa" },
  { label: "Confirmación" },
];

export default function RegistroDatosPage() {
  const router = useRouter();
  const toast  = useToast();
  const { data: planes, isLoading: loadingPlanes } = usePlanes();
  const [loading, setLoading] = useState(false);
  const [rucData, setRucData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("ruc_data");
    if (!raw) { router.replace("/registro"); return; }
    setRucData(JSON.parse(raw));
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrarEmpresaInput>({
    resolver:      zodResolver(registrarEmpresaSchema),
    defaultValues: {
      ruc:       rucData?.ruc ?? "",
      direccion: rucData?.direccion ?? "",
    },
  });

  async function onSubmit(data: RegistrarEmpresaInput) {
    setLoading(true);
    try {
      const empresa = await empresaService.registrar(data);
      sessionStorage.setItem("empresa_registrada", JSON.stringify(empresa));
      sessionStorage.removeItem("ruc_data");
      router.push("/registro/confirmacion");
    } catch {
      toast.error("No se pudo completar el registro. Verifica los datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const planOptions = (planes ?? []).map((p) => ({
    value: p.id,
    label: `${p.nombre === "BASICO" ? "Básico" : "Pro"} — S/ ${p.precio_mensual}/mes`,
  }));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Completa tus datos</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Empresa: <strong>{rucData?.razon_social}</strong>
        </p>
      </div>

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={1} />
      </div>

      <Card padding>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="RUC"
            value={rucData?.ruc ?? ""}
            disabled
            {...register("ruc")}
          />

          <FormSection title="Información de contacto">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="admin@empresa.com"
              required
              error={errors.correo?.message}
              {...register("correo")}
            />
            <Input
              label="Teléfono"
              placeholder="999888777"
              required
              error={errors.telefono?.message}
              {...register("telefono")}
            />
          </FormSection>

          <Input
            label="Dirección fiscal"
            placeholder="Av. Principal 123, Lima"
            required
            error={errors.direccion?.message}
            {...register("direccion")}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            required
            hint="Esta será la contraseña del PROPIETARIO de la cuenta."
            error={errors.contrasena?.message}
            {...register("contrasena")}
          />

          <Select
            label="Plan"
            options={planOptions}
            placeholder={loadingPlanes ? "Cargando planes..." : "Selecciona un plan"}
            required
            error={errors.plan_id?.message}
            {...register("plan_id", { valueAsNumber: true })}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => router.back()}
              leftIcon={<ArrowLeft size={15} />}
            >
              Atrás
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight size={15} />}
            >
              Registrar empresa
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}