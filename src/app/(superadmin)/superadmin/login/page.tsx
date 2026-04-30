"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

export default function SuperadminLoginPage() {
    const { login, isLoading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-brand flex items-center justify-center mx-auto mb-4">
                        <Shield size={28} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">
                        Acceso restringido
                    </h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        Panel de administración NexusRH
                    </p>
                </div>

                <Card padding>
                    <form
                        onSubmit={handleSubmit((d) =>
                            login(d, "/superadmin/dashboard"),
                        )}
                        className="space-y-4"
                    >
                        <Input
                            label="Código único"
                            placeholder="Código de acceso"
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
                        <Button type="submit" fullWidth loading={isLoading}>
                            Ingresar
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
