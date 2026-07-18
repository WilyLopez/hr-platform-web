"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

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
    `w-full px-5 py-4 rounded-xl border bg-white/5 text-white placeholder-slate-400 transition-all duration-300 outline-none backdrop-blur-sm ${
      hasError 
        ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
        : "border-white/10 focus:border-brand-light focus:ring-4 focus:ring-brand-light/20 hover:border-white/20"
    }`;

  return (
    <div className="min-h-screen relative flex w-full">
      {/* Background Image Area */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900">
        <Image
          src="/images/login_bg.png"
          alt="NexusRH Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent mix-blend-multiply" />
        
        {/* Floating branding/text */}
        <div className="absolute bottom-16 left-16 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Gestión inteligente <br/> para equipos extraordinarios.
          </h2>
          <p className="text-slate-300 text-lg">
            NexusRH unifica el control de recursos humanos, asistencia y solicitudes en una plataforma diseñada para la eficiencia.
          </p>
        </div>
      </div>

      {/* Login Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Decorative ambient blobs for the dark side */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-brand-dark/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]" />
        </div>

        <div className="w-full max-w-md px-8 relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-brand/10 rounded-2xl mb-6">
              <ShieldCheck className="w-8 h-8 text-brand-light" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Bienvenido a NexusRH</h1>
            <p className="text-slate-400 mt-3 text-sm md:text-base">
              Ingresa tus credenciales para acceder a tu panel de control.
            </p>
          </div>

          <form
            onSubmit={handleSubmit((d) => login(d))}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Código Único o Usuario</label>
              <input 
                {...register("codigo_unico")} 
                className={inputClasses(!!errors.codigo_unico)}
                placeholder="Ej: COD123456"
              />
              {errors.codigo_unico && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12}/>{errors.codigo_unico.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                <Link href="/recuperar-contrasena" className="text-xs text-brand-light hover:text-brand-pale transition-colors font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input 
                  {...register("contrasena")} 
                  type={showPassword ? "text" : "password"}
                  className={inputClasses(!!errors.contrasena)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12}/>{errors.contrasena.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                loading={isLoading} 
                className="bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-brand/40 hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : "Iniciar Sesión"}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NexusRH. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
