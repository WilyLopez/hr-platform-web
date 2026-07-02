"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { cambiarContrasenaSchema, type CambiarContrasenaInput } from "@/lib/schemas/auth.schema";
import { useRouter } from "next/navigation";

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CambiarContrasenaInput>({
    resolver: zodResolver(cambiarContrasenaSchema),
  });

  const onSubmit = async (data: CambiarContrasenaInput) => {
    setLoading(true);
    setStatus("idle");
    try {
      await authService.cambiarContrasena(data);
      setStatus("success");
      reset();
      setTimeout(() => router.push("/propietario/perfil"), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Error al actualizar la contraseña.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Cambiar contraseña</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {status === "success" && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg flex items-center gap-2"><CheckCircle2 size={16}/>Contraseña actualizada. Redirigiendo...</div>}
          {status === "error" && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2"><AlertCircle size={16}/>{errorMsg}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña actual</label>
            <input {...register("contrasena_actual")} type="password" className={inputClasses} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
            <input {...register("contrasena_nueva")} type="password" className={inputClasses} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar nueva contraseña</label>
            <input {...register("confirmar_contrasena")} type="password" className={inputClasses} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
            {loading ? <Loader2 className="animate-spin" size={20}/> : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
