"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Badge, SkeletonCard, Alert, Avatar } from "@/components/ui";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { cambiarContrasenaSchema, type CambiarContrasenaInput } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import type { PerfilOutput } from "@/types/auth.types";
import { Shield, User, Lock, Activity } from "lucide-react";
import { ROLES, ESTADOS_USUARIO } from "@/utils/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function UserProfile() {
  const [perfil, setPerfil] = useState<PerfilOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CambiarContrasenaInput>({
    resolver: zodResolver(cambiarContrasenaSchema),
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await authService.obtenerPerfil();
        setPerfil(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const onPasswordChange = async (data: CambiarContrasenaInput) => {
    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(false);
    try {
      await authService.cambiarContrasena(data);
      setPwdSuccess(true);
      reset(); // clear form
    } catch (err: any) {
      setPwdError(err.response?.data?.detail || "No se pudo actualizar la contraseña.");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><SkeletonCard /></div>
        <div className="lg:col-span-2"><SkeletonCard /></div>
      </div>
    );
  }

  if (error || !perfil) {
    return <Alert variant="danger" title="Error">{error}</Alert>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Tarjeta 1: Información Personal */}
      <Card className="lg:col-span-1">
        <div className="p-6 border-b border-neutral-100 flex flex-col items-center text-center">
          <Avatar name={perfil.correo || perfil.codigo_unico} size="lg" className="mb-4" />
          <h2 className="text-lg font-semibold text-neutral-800">
            {perfil.correo || "Usuario"}
          </h2>
          <p className="text-sm text-neutral-500 mb-3">{ROLES[perfil.rol] || perfil.rol}</p>
          <Badge variant={perfil.estado === "ACTIVO" ? "success" : "danger"}>
            {ESTADOS_USUARIO[perfil.estado] || perfil.estado}
          </Badge>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-neutral-700">
            <User size={16} /> Detalles de la cuenta
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500">Código único</p>
              <p className="text-sm font-medium text-neutral-800">{perfil.codigo_unico}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Correo electrónico</p>
              <p className="text-sm font-medium text-neutral-800">{perfil.correo}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Miembro desde</p>
              <p className="text-sm font-medium text-neutral-800">
                {format(new Date(perfil.fecha_creacion), "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Último acceso</p>
              <p className="text-sm font-medium text-neutral-800">
                {perfil.ultimo_acceso 
                  ? format(new Date(perfil.ultimo_acceso), "dd/MM/yyyy HH:mm", { locale: es })
                  : "Nunca"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tarjeta 2: Seguridad */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-800">
              <Shield size={18} className="text-brand" /> Seguridad
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onPasswordChange)} className="max-w-md space-y-4">
              {pwdError && <Alert variant="danger" title="Error">{pwdError}</Alert>}
              {pwdSuccess && <Alert variant="success" title="¡Éxito!">Contraseña actualizada correctamente.</Alert>}
              
              <PasswordInput
                label="Contraseña actual"
                placeholder="Ingresa tu contraseña actual"
                required
                error={errors.contrasena_actual?.message}
                {...register("contrasena_actual")}
              />
              <PasswordInput
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                required
                error={errors.contrasena_nueva?.message}
                hint="Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
                {...register("contrasena_nueva")}
              />
              <PasswordInput
                label="Confirmar nueva contraseña"
                placeholder="Repite la nueva contraseña"
                required
                error={errors.confirmar_contrasena?.message}
                {...register("confirmar_contrasena")}
              />
              
              <div className="pt-2">
                <Button type="submit" loading={pwdLoading}>
                  Actualizar contraseña
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Sección Futura (Placeholder) */}
        <Card className="opacity-70 pointer-events-none">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-800">
              <Activity size={18} className="text-neutral-500" /> Sesiones activas (Próximamente)
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Podrás gestionar tus dispositivos y cerrar sesiones en otros navegadores.
            </p>
          </div>
          <div className="p-6">
             <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
               <div>
                 <p className="text-sm font-medium text-neutral-800">Windows • Chrome</p>
                 <p className="text-xs text-neutral-500">Sesión actual • Hace unos instantes</p>
               </div>
               <Button size="sm" variant="outline" disabled>Cerrar sesión</Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
