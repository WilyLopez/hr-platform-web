'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Input, Skeleton, Badge } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/auth.store";
import type { PerfilOutput, CambiarContrasenaInput } from "@/types/auth.types";
import { User, Mail, Shield, Clock, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { ROLES } from "@/utils/constants";

export default function EmpleadoPerfilPage() {
  const toast = useToast();
  const { usuario } = useAuth();

  const [perfil, setPerfil] = useState<PerfilOutput | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // Password change state
  const [changingPass, setChangingPass] = useState(false);
  const [submittingPass, setSubmittingPass] = useState(false);
  const [passForm, setPassForm] = useState({
    contrasena_actual: "",
    contrasena_nueva: "",
    contrasena_confirmar: "",
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await authService.obtenerPerfil();
        setPerfil(data);
      } catch {
        toast.error("No se pudo cargar la información del perfil.");
      } finally {
        setLoadingPerfil(false);
      }
    };
    cargar();
  }, []);

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.contrasena_nueva !== passForm.contrasena_confirmar) {
      toast.error("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (passForm.contrasena_nueva.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setSubmittingPass(true);
    try {
      const payload: CambiarContrasenaInput = {
        contrasena_actual: passForm.contrasena_actual,
        contrasena_nueva: passForm.contrasena_nueva,
      };
      await authService.cambiarContrasena(payload);
      toast.success("Contraseña actualizada correctamente.");
      setChangingPass(false);
      setPassForm({ contrasena_actual: "", contrasena_nueva: "", contrasena_confirmar: "" });
      // Clear the must_change_password flag from store
      useAuthStore.setState((state) => ({
        usuario: state.usuario ? {
          ...state.usuario,
          security: { must_change_password: false }
        } : null
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cambiar contraseña. Verifica la contraseña actual.");
    } finally {
      setSubmittingPass(false);
    }
  };

  const nuevaPass = passForm.contrasena_nueva;
  const hasMinLength = nuevaPass.length >= 8;
  const hasUpperCase = /[A-Z]/.test(nuevaPass);
  const hasNumber = /[0-9]/.test(nuevaPass);
  const score = [hasMinLength, hasUpperCase, hasNumber].filter(Boolean).length;
  const strengthColor = score === 0 ? "bg-neutral-200" : score === 1 ? "bg-danger" : score === 2 ? "bg-warning" : "bg-success";

  const formatFecha = (s: string | null) =>
    s ? new Date(s).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="space-y-6">
      <PageHeader title="Mi Perfil" description="Tu información de cuenta y seguridad" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Información de cuenta ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-5 border-b border-neutral-100 flex items-center gap-2">
              <User size={18} className="text-muted-foreground" />
              <h2 className="font-bold text-neutral-800">Información de la Cuenta</h2>
            </div>
            <CardBody className="divide-y divide-neutral-50">
              {loadingPerfil ? (
                <div className="space-y-4 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <InfoRow icon={<User size={16} />} label="Código único" value={perfil?.codigo_unico || usuario?.codigo_unico || "—"} />
                  <InfoRow icon={<Mail size={16} />} label="Correo" value={perfil?.correo || "—"} />
                  <InfoRow icon={<Shield size={16} />} label="Rol" value={
                    <Badge variant="brand">{ROLES[perfil?.rol || "EMPLEADO"]}</Badge>
                  } />
                  <InfoRow icon={<Clock size={16} />} label="Último acceso" value={formatFecha(perfil?.ultimo_acceso || null)} />
                  <InfoRow icon={<Clock size={16} />} label="Cuenta creada" value={formatFecha(perfil?.fecha_creacion || null)} />
                  <InfoRow icon={<Shield size={16} />} label="Estado" value={
                    <Badge variant={perfil?.estado === "ACTIVO" ? "success" : "neutral"}>
                      {perfil?.estado || "—"}
                    </Badge>
                  } />
                </>
              )}
            </CardBody>
          </Card>

          {/* ── Cambio de contraseña ─────────────────────────────────────────── */}
          <Card>
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-muted-foreground" />
                <h2 className="font-bold text-neutral-800">Seguridad</h2>
              </div>
              {!changingPass && (
                <Button size="sm" variant="outline" onClick={() => setChangingPass(true)}>
                  Cambiar contraseña
                </Button>
              )}
            </div>
            <CardBody>
              {changingPass ? (
                <form onSubmit={handleCambiarContrasena} className="space-y-4">
                  <Input
                    label="Contraseña actual"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={passForm.contrasena_actual}
                    onChange={(e) => setPassForm({ ...passForm, contrasena_actual: e.target.value })}
                    required
                    {...({ rightElement: (
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-neutral-400 hover:text-neutral-600">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    ) } as any)}
                  />
                  <Input
                    label="Nueva contraseña"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={passForm.contrasena_nueva}
                    onChange={(e) => setPassForm({ ...passForm, contrasena_nueva: e.target.value })}
                    required
                  />

                  {/* Indicador de fortaleza */}
                  {nuevaPass && (
                    <div className="space-y-2">
                      <div className="flex gap-1 h-1.5">
                        <div className={`flex-1 rounded-l-full transition-colors ${score >= 1 ? strengthColor : "bg-neutral-200"}`} />
                        <div className={`flex-1 transition-colors ${score >= 2 ? strengthColor : "bg-neutral-200"}`} />
                        <div className={`flex-1 rounded-r-full transition-colors ${score >= 3 ? strengthColor : "bg-neutral-200"}`} />
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <Req ok={hasMinLength} text="8 caracteres mínimo" />
                        <Req ok={hasUpperCase} text="Una letra mayúscula" />
                        <Req ok={hasNumber} text="Un número" />
                      </div>
                    </div>
                  )}

                  <Input
                    label="Confirmar nueva contraseña"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={passForm.contrasena_confirmar}
                    onChange={(e) => setPassForm({ ...passForm, contrasena_confirmar: e.target.value })}
                    required
                  />

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" fullWidth onClick={() => { setChangingPass(false); setPassForm({ contrasena_actual: "", contrasena_nueva: "", contrasena_confirmar: "" }); }} disabled={submittingPass}>
                      Cancelar
                    </Button>
                    <Button type="submit" fullWidth loading={submittingPass}>
                      Guardar contraseña
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-neutral-500">
                  Mantén tu cuenta segura cambiando tu contraseña regularmente. Nunca compartas tus credenciales.
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ── Panel lateral ────────────────────────────────────────────────── */}
        <div>
          <Card>
            <CardBody className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center text-brand text-3xl font-bold">
                {(perfil?.codigo_unico || usuario?.codigo_unico || "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-lg">{perfil?.codigo_unico || usuario?.codigo_unico}</p>
                <p className="text-sm text-neutral-500">{perfil?.correo || "—"}</p>
              </div>
              <Badge variant={perfil?.estado === "ACTIVO" ? "success" : "neutral"} className="px-4">
                {ROLES[perfil?.rol || "EMPLEADO"]}
              </Badge>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <span className="flex items-center gap-2 text-sm text-neutral-500">
        {icon} {label}
      </span>
      <span className="text-sm font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function Req({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${ok ? "text-success" : "text-neutral-400"}`}>
      <CheckCircle2 size={13} />
      {text}
    </div>
  );
}
