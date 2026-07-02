"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { suscripcionService } from "@/services/suscripcion.service";
import { Plan } from "@/types/suscripcion.types";

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    suscripcionService.listarPlanes()
      .then(setPlanes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Planes diseñados para tu crecimiento</h1>
          <p className="text-lg text-slate-600">Elige la solución que mejor se adapte a tu empresa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {planes.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((plan) => (
            <div key={plan.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 transition-all">
              <h2 className="text-2xl font-bold text-slate-900">{plan.nombre}</h2>
              <p className="text-slate-500 mt-2 min-h-[3rem]">{plan.descripcion_corta}</p>
              <div className="my-6">
                <span className="text-4xl font-bold text-slate-900">S/ {plan.precio_mensual}</span>
                <span className="text-slate-500"> / mes</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Hasta {plan.limite_usuarios} empleados</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{plan.almacenamiento_gb} GB almacenamiento</span>
                </li>
              </ul>

              <Link href="/registro" className="block text-center bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold">
                Elegir plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}