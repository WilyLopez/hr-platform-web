"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function PropietarioLoginPage() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Portal Propietario</h1>
          <p className="text-sm text-neutral-500 mt-1">Ingresa con tu código único</p>
        </div>

        <Card padding>
          <form
            onSubmit={handleSubmit((d) => login(d, "/propietario/dashboard"))}
            className="space-y-4"
          >
            <Input
              label="Código único"
              placeholder="Ej: PROP123456"
              required
              error={errors.codigo_unico?.message}
              {...register("codigo_unico")}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
              error={errors.contrasena?.message}
              {...register("contrasena")}
            />
            <Button type="submit" fullWidth loading={isLoading}>
              Ingresar
            </Button>
            <div className="text-center mt-4">
              <Link href="/recuperar-contrasena" className="text-sm text-brand hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-neutral-400">
          ¿Eres del área de RRHH?{" "}
          <Link href="/admin/login" className="text-brand font-medium">
            Portal administrador
          </Link>
        </p>
      </div>
    </div>
  );
}