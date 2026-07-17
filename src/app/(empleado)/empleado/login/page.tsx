"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EmpleadoLoginPage() {
    const { login, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/empleado/dashboard";
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                        <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        NexusRH
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Portal del Empleado
                    </p>
                </div>

                <Card className="p-6 border-slate-200/60 shadow-xl shadow-slate-200/40">
                    <form
                        onSubmit={handleSubmit((d) =>
                            login(d, redirectUrl),
                        )}
                        className="space-y-5"
                    >
                        <Input
                            label="Código único"
                            placeholder="Ej: EMP001234"
                            autoComplete="username"
                            required
                            error={errors.codigo_unico?.message}
                            {...register("codigo_unico")}
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            error={errors.contrasena?.message}
                            {...register("contrasena")}
                        />
                        <Button type="submit" className="w-full h-11" variant="primary" loading={isLoading}>
                            Ingresar a mi portal
                        </Button>
                        <div className="text-center mt-6">
                            <Link href="/recuperar-contrasena" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
