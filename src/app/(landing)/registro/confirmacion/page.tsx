"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";

const STEPS = [
  { label: "Validar RUC" },
  { label: "Datos empresa" },
  { label: "Datos propietario" },
  { label: "Confirmación" },
];

export default function RegistroConfirmacionPage() {
  const router  = useRouter();
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("empresa_registrada");
    if (!raw) { router.replace("/registro"); return; }
    setEmpresa(JSON.parse(raw));
    // No eliminar inmediatamente para permitir ver los datos si refresca
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={3} />
      </div>

      <Card padding>
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center">
            <CheckCircle size={32} className="text-success" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">¡Empresa registrada!</h2>
            <p className="text-sm text-neutral-500 mt-1">
              <strong>{empresa?.razon_social}</strong> ha sido registrada exitosamente.
            </p>
          </div>

          <div className="w-full bg-brand-pale rounded-lg p-4 flex items-start gap-3">
            <Mail size={18} className="text-brand flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-xs font-semibold text-brand-dark">Revisa tu correo</p>
              <p className="text-xs text-brand-dark mt-0.5">
                Enviamos las credenciales de acceso a <strong>{empresa?.correo}</strong>.
                Úsalas para ingresar al portal del propietario.
              </p>
            </div>
          </div>

          <div className="w-full space-y-2">
            <Button
              fullWidth
              rightIcon={<ArrowRight size={15} />}
              onClick={() => router.push("/login")}
            >
              Ir al portal del propietario
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}