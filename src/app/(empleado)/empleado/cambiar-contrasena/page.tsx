"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Card } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/useToast";
import { Lock, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { CambiarContrasenaInput } from "@/types/auth.types";

const passwordSchema = z.object({
  contrasena_actual: z.string().min(1, "La contraseña actual es requerida"),
  contrasena_nueva: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  contrasena_confirmar: z.string().min(1, "Confirma tu nueva contraseña"),
}).refine((data) => data.contrasena_nueva === data.contrasena_confirmar, {
  message: "Las contraseñas no coinciden",
  path: ["contrasena_confirmar"],
});

type FormValues = z.infer<typeof passwordSchema>;

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const toast = useToast();
  const { usuario, setAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const nueva = watch("contrasena_nueva") || "";

  // Validaciones visuales
  const hasMinLength = nueva.length >= 8;
  const hasUpperCase = /[A-Z]/.test(nueva);
  const hasNumber = /[0-9]/.test(nueva);
  
  const score = [hasMinLength, hasUpperCase, hasNumber].filter(Boolean).length;
  
  const getStrengthColor = () => {
    if (score === 0) return "bg-slate-200";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CambiarContrasenaInput = {
        contrasena_actual: data.contrasena_actual,
        contrasena_nueva: data.contrasena_nueva,
      };
      
      await authService.cambiarContrasena(payload);
      
      toast.success("Contraseña actualizada. Tu cuenta ahora es segura.");
      
      // Actualizamos el estado local de seguridad para que ya no pida cambio
      if (usuario) {
        useAuthStore.setState((state) => ({
          usuario: state.usuario ? {
            ...state.usuario,
            security: { must_change_password: false }
          } : null
        }));
      }
      
      router.push("/empleado/dashboard");
      
    } catch (error: any) {
      toast.error(
        "Error al cambiar contraseña: " + (error?.response?.data?.message || "Verifica tu contraseña actual e intenta nuevamente.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-200">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Acción Requerida
          </h1>
          <p className="text-slate-600">
            Por motivos de seguridad, debes cambiar la contraseña temporal generada por el sistema antes de continuar.
          </p>
        </div>

        <Card className="p-6 border-slate-200 shadow-xl shadow-slate-200/40">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Contraseña Actual (Temporal)"
              type="password"
              placeholder="••••••••"
              error={errors.contrasena_actual?.message}
              {...register("contrasena_actual")}
            />
            
            <div className="space-y-3">
              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.contrasena_nueva?.message}
                {...register("contrasena_nueva")}
              />
              
              {/* Medidor de fortaleza */}
              <div className="space-y-2 pt-1 pb-2">
                <div className="flex gap-1 h-1.5 w-full">
                  <div className={`flex-1 rounded-l-full transition-colors ${score >= 1 ? getStrengthColor() : "bg-slate-200"}`} />
                  <div className={`flex-1 transition-colors ${score >= 2 ? getStrengthColor() : "bg-slate-200"}`} />
                  <div className={`flex-1 rounded-r-full transition-colors ${score >= 3 ? getStrengthColor() : "bg-slate-200"}`} />
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> 8 caracteres como mínimo
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-600" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Al menos una letra mayúscula
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Al menos un número
                  </div>
                </div>
              </div>
            </div>

            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.contrasena_confirmar?.message}
              {...register("contrasena_confirmar")}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full h-11" variant="primary" loading={isSubmitting}>
                <Lock className="w-4 h-4 mr-2" />
                Actualizar y Continuar
              </Button>
            </div>
            
            <div className="text-center pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  authService.clearSession();
                  useAuthStore.getState().clearAuth();
                  router.push("/empleado/login");
                }}
              >
                Cerrar sesión y salir
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
