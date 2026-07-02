"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const inputClasses = (hasError: boolean | undefined) => 
    `w-full px-4 py-3 rounded-xl border bg-slate-950/50 text-white placeholder-slate-400 transition-all outline-none focus:ring-2 ${
      hasError 
        ? "border-red-500/50 focus:ring-red-500/20" 
        : "border-slate-700 focus:ring-slate-500/50 focus:border-slate-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">NexusRH</h1>
          <p className="text-slate-400 mt-3">Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form
            onSubmit={handleSubmit((d) => login(d))}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Código único</label>
              <input 
                {...register("codigo_unico")} 
                className={inputClasses(!!errors.codigo_unico)}
                placeholder="Ej: COD123456"
              />
              {errors.codigo_unico && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12}/>{errors.codigo_unico.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <input 
                {...register("contrasena")} 
                type={showPassword ? "text" : "password"}
                className={inputClasses(!!errors.contrasena)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.contrasena && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12}/>{errors.contrasena.message}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth loading={isLoading} className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 rounded-xl">
              {isLoading ? <Loader2 className="animate-spin" size={20}/> : "Ingresar"}
            </Button>

            <div className="text-center">
              <Link href="/recuperar-contrasena" className="text-sm text-slate-400 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
