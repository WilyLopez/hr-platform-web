"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Card } from "@/components/ui";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { FormSection } from "@/components/forms/FormSection";
import { datosEmpresaSchema, type DatosEmpresaInput } from "@/lib/schemas/empresa.schema";
import { usePlanes } from "@/hooks/usePlanes";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { label: "Validar RUC" },
  { label: "Datos empresa" },
  { label: "Datos propietario" },
  { label: "Confirmación" },
];

export default function RegistroDatosPage() {
  const router = useRouter();
  const { data: planes, isLoading: loadingPlanes } = usePlanes();
  const [rucData, setRucData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosEmpresaInput>({
    resolver: zodResolver(datosEmpresaSchema),
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("ruc_data");
    if (!raw) {
      router.replace("/registro");
      return;
    }
    const parsedData = JSON.parse(raw);
    setRucData(parsedData);
    
    // Obtener datos previos si el usuario regresó de la siguiente pantalla
    const savedForm = sessionStorage.getItem("registro_form_data");
    const initialData = savedForm ? JSON.parse(savedForm) : {};

    reset({
      ruc: parsedData.ruc ?? "",
      direccion: initialData.direccion || parsedData.direccion || "",
      correo: initialData.correo || "",
      telefono: initialData.telefono || "",
      plan_id: initialData.plan_id || undefined,
    });
  }, [router, reset]);

  async function onSubmit(data: DatosEmpresaInput) {
    // Guardar temporalmente y pasar al siguiente paso
    sessionStorage.setItem("registro_form_data", JSON.stringify(data));
    router.push("/registro/propietario");
  }

  const sortedPlanes = [...(planes ?? [])].sort((a, b) => Number(a.precio_mensual) - Number(b.precio_mensual));
  const baseOptions = sortedPlanes.map((p) => {
    const formattedName = p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1).toLowerCase();
    return {
      value: p.id,
      label: `${formattedName} — S/ ${p.precio_mensual}/mes`,
    };
  });

  const planOptions = baseOptions.length > 0 ? baseOptions : [
    { value: 1, label: "Modo Dev: Plan Básico (ID: 1)" },
    { value: 2, label: "Modo Dev: Plan Pro (ID: 2)" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Datos de la Empresa</h1>
        <p className="text-sm text-neutral-500 mt-1">
          RUC: <strong>{rucData?.ruc}</strong> - {rucData?.razon_social}
        </p>
      </div>

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={1} />
      </div>

      <Card padding>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="RUC (Solo lectura)"
            value={rucData?.ruc ?? ""}
            disabled
          />

          <FormSection title="Información de la empresa">
             <Input
              label="Dirección fiscal"
              placeholder="Av. Principal 123, Lima"
              required
              error={errors.direccion?.message}
              {...register("direccion")}
            />
            <Input
              label="Correo corporativo"
              type="email"
              placeholder="contacto@empresa.com"
              required
              error={errors.correo?.message}
              {...register("correo")}
            />
            <Input
              label="Teléfono corporativo"
              placeholder="999888777"
              required
              error={errors.telefono?.message}
              {...register("telefono")}
            />
          </FormSection>

          <Select
            label="Selecciona un Plan"
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
              rightIcon={<ArrowRight size={15} />}
            >
              Siguiente: Datos Propietario
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
