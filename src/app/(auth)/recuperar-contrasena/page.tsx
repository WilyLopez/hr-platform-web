"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, Alert } from "@/components/ui";
import { recuperarContrasenaSchema, type RecuperarContrasenaInput } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { KeyRound, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";

export default function RecuperarContrasenaPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarContrasenaInput>({
    resolver: zodResolver(recuperarContrasenaSchema),
  });

  const onSubmit = async (data: RecuperarContrasenaInput) => {
    setLoading(true);
    setError(null);
    try {
      await authService.recuperarContrasena(data.correo);
      setSuccess(true);
    } catch (err: any) {
      // In a real scenario we could show generic error, but since backend always returns 200 for security,
      // this catch block will likely only run on network errors.
      setError(err?.response?.data?.detail || "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 animate-fade-in">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} className="text-brand" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Ingresa tu correo para recibir instrucciones
          </p>
        </div>

        <Card padding>
          {success ? (
            <div className="text-center space-y-4 py-4 animate-fade-in">
              <div className="mx-auto w-14 h-14 bg-success/15 rounded-full flex items-center justify-center">
                <MailCheck size={28} className="text-success-dark" />
              </div>
              <h3 className="text-base font-semibold text-neutral-800">¡Correo enviado!</h3>
              <p className="text-sm text-neutral-500">
                Si el correo ingresado está registrado, recibirás un mensaje en breve con tu nueva contraseña temporal.
              </p>

              {/* Pasos claros para el usuario */}
              <div className="text-left bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3 mt-2">
                <p className="text-xs font-bold text-neutral-600 uppercase tracking-wide">¿Qué hacer a continuación?</p>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">1</span>
                  <p className="text-sm text-neutral-700">Revisa tu bandeja de entrada (y la carpeta de spam) y copia la <strong>contraseña temporal</strong> que te enviamos.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">2</span>
                  <p className="text-sm text-neutral-700">Vuelve a la pantalla de inicio de sesión e ingresa con tu <strong>código de usuario</strong> y esa contraseña temporal.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">3</span>
                  <p className="text-sm text-neutral-700">El sistema te pedirá que <strong>cambies la contraseña</strong> de inmediato por una de tu elección.</p>
                </div>
              </div>

              <Button fullWidth onClick={() => window.history.back()} variant="outline" className="mt-2">
                Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert title="Error" variant="danger">
                  {error}
                </Alert>
              )}
              <Input
                label="Correo electrónico"
                placeholder="usuario@empresa.com"
                type="email"
                autoComplete="email"
                required
                error={errors.correo?.message}
                {...register("correo")}
                disabled={loading}
              />
              <Button type="submit" fullWidth loading={loading}>
                Enviar instrucciones
              </Button>
              <div className="text-center pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<ArrowLeft size={16} />}
                  onClick={() => window.history.back()}
                >
                  Volver atrás
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
