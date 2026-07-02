"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { suscripcionService } from "@/services/suscripcion.service";
import { Plan } from "@/types/suscripcion.types";

export function PricingSection() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    suscripcionService.listarPlanes()
      .then(setPlanes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Planes de suscripción</h2>
        {loading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-900" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {planes.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map(plan => (
              <div key={plan.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-2">{plan.nombre}</h3>
                <div className="text-4xl font-extrabold my-6">S/ {plan.precio_mensual} <span className="text-lg font-normal text-slate-500">/ mes</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3"><Check className="text-emerald-600" /> Hasta {plan.limite_usuarios} empleados</li>
                  <li className="flex items-center gap-3"><Check className="text-emerald-600" /> {plan.almacenamiento_gb} GB almacenamiento</li>
                </ul>
                <Link href="/registro" className="block text-center bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                  Elegir plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
