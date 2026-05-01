"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { FormSection } from "@/components/forms/FormSection";
import { datosPropietarioSchema, type DatosPropietarioInput } from "@/lib/schemas/empresa.schema";
import { empresaService } from "@/services/empresa.service";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, ArrowRight, UserCheck } from "lucide-react";

const STEPS = [
  { label: "Validar RUC" },
  { label: "Datos empresa" },
  { label: "Datos propietario" },
  { label: "Confirmación" },
];

export default function RegistroPropietarioPage() {
  const router = useRouter();
  const toast  = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosPropietarioInput>({
    resolver: zodResolver(datosPropietarioSchema),
  });

  useEffect(() => {
    const rawForm = sessionStorage.getItem("registro_form_data");
    if (!rawForm) {
      router.replace("/registro/datos");
      return;
    }
    const parsedForm = JSON.parse(rawForm);
    setFormData(parsedForm);
    
    const savedOwnerData = sessionStorage.getItem("registro_propietario_data");
    if (savedOwnerData) {
      reset(JSON.parse(savedOwnerData));
    }
  }, [router, reset]);

  async function onSubmit(data: DatosPropietarioInput) {
    setLoading(true);
    try {
      // Guardar datos del propietario temporalmente por si falla algo
      sessionStorage.setItem("registro_propietario_data", JSON.stringify(data));

      // Combinar los datos de ambos pasos
      const finalData = {
        ...formData,
        ...data,
      };

      const empresa = await empresaService.registrar(finalData);
      
      sessionStorage.setItem("empresa_registrada", JSON.stringify(empresa));
      sessionStorage.removeItem("ruc_data");
      sessionStorage.removeItem("registro_form_data");
      sessionStorage.removeItem("registro_propietario_data");
      
      router.push("/registro/confirmacion");
    } catch (error: any) {
      const msg = error.response?.data?.message || "No se pudo completar el registro.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Datos del Propietario</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Completa la información del usuario principal (PROPIETARIO).
        </p>
      </div>

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={2} />
      </div>

      <Card padding>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3 p-3 bg-brand-pale rounded-lg">
            <UserCheck size={18} className="text-brand flex-shrink-0" />
            <p className="text-xs text-brand-dark">
              Este usuario tendrá el rol de <strong>PROPIETARIO</strong> y podrá gestionar toda la empresa.
            </p>
          </div>

          <FormSection title="Información Personal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombres"
                placeholder="Ej. Juan"
                required
                error={errors.nombres?.message}
                {...register("nombres")}
              />
              <Input
                label="Apellidos"
                placeholder="Ej. Pérez"
                required
                error={errors.apellidos?.message}
                {...register("apellidos")}
              />
            </div>
          </FormSection>

          <FormSection title="Credenciales de acceso">
            <Input
              label="Correo de Acceso"
              type="email"
              value={formData?.correo || ""}
              disabled
              hint="Se usará el correo corporativo registrado en el paso anterior."
            />
            
            <Input
              label="Contraseña maestra"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              error={errors.contrasena?.message}
              {...register("contrasena")}
              hint="Usa una contraseña segura para proteger tu cuenta."
            />
          </FormSection>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={loading}
              onClick={() => {
                // Guardar antes de volver
                const currentValues = {
                  nombres: (document.getElementsByName("nombres")[0] as HTMLInputElement)?.value,
                  apellidos: (document.getElementsByName("apellidos")[0] as HTMLInputElement)?.value,
                };
                sessionStorage.setItem("registro_propietario_data", JSON.stringify(currentValues));
                router.back();
              }}
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
              Finalizar Registro
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
