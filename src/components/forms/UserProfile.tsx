"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import type { PerfilOutput } from "@/types/auth.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export function UserProfile() {
  const [perfil, setPerfil] = useState<PerfilOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.obtenerPerfil().then(setPerfil).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!perfil) return <p>Error cargando perfil</p>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 mb-4">
            {perfil.codigo_unico.substring(0, 2).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{perfil.codigo_unico}</h2>
          <span className="text-sm text-slate-500 mt-1">{perfil.correo}</span>
        </div>
        
        <div className="space-y-4 mb-8">
          {[
            { label: "Rol", value: perfil.rol },
            { label: "Estado", value: perfil.estado },
            { label: "Miembro desde", value: format(new Date(perfil.fecha_creacion), "dd MMM yyyy", { locale: es }) },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
            <Link href="/cambiar-contrasena" className="flex-1 text-center bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                Cambiar contraseña
            </Link>
            <button className="flex-1 text-center bg-white border border-slate-200 text-slate-900 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Editar perfil
            </button>
        </div>
    </div>
  );
}
