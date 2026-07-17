"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Star, Zap, Building, Users } from "lucide-react";
import { suscripcionService } from "@/services/suscripcion.service";
import { Plan } from "@/types/suscripcion.types";

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    suscripcionService.listarPlanes()
      .then(setPlanes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  // Helper to determine extra features based on plan name
  const getExtraFeatures = (planNombre: string) => {
    const isPro = planNombre.toLowerCase().includes("pro") || planNombre.toLowerCase().includes("premium") || planNombre.toLowerCase().includes("avanzado");
    
    if (isPro) {
      return [
        "Soporte prioritario 24/7",
        "Reportes avanzados y métricas",
        "Control de asistencia con GPS",
        "Integración con API personalizada",
        "Asignación de roles granulares",
      ];
    }
    return [
      "Soporte vía email (L-V)",
      "Reportes básicos",
      "Control de asistencia web",
      "Gestión de permisos estándar",
    ];
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-brand-pale/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-brand-pale/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pale text-brand-dark text-sm font-semibold mb-6">
            <Star size={16} className="fill-brand-dark" /> Planes de Precios
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Diseñados para <span className="text-brand">escalar tu equipo</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600">
            Elige la solución perfecta para tu empresa. Sin cargos ocultos, sin sorpresas. Cancela en cualquier momento.
          </p>

          {/* Billing Toggle (Visual Only) */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Mensual</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Anual <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">Ahorra 20%</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto items-end">
          {planes.sort((a, b) => (Number(a.precio_mensual) || 0) - (Number(b.precio_mensual) || 0)).map((plan) => {
            const isRecommended = plan.nombre.toLowerCase().includes("pro") || (plan.orden === 2);
            
            // Calculate displayed price
            const numericPrice = parseFloat(plan.precio_mensual.toString());
            const displayPrice = isAnnual ? (numericPrice * 0.8).toFixed(2) : numericPrice.toFixed(2);
            
            return (
              <div 
                key={plan.id} 
                className={`w-full md:w-[400px] rounded-3xl bg-white flex flex-col transition-all duration-300 ${
                  isRecommended 
                    ? "ring-2 ring-brand shadow-2xl shadow-brand/20 scale-100 md:scale-105 z-10 relative" 
                    : "border border-slate-200 shadow-lg shadow-slate-200/50 scale-100 hover:border-slate-300"
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <Zap size={14} className="fill-white" /> Recomendado
                    </span>
                  </div>
                )}
                
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.nombre}</h3>
                  <p className="text-slate-500 mt-2 text-sm min-h-[2.5rem]">{plan.descripcion_corta}</p>
                  
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                      S/ {displayPrice}
                    </span>
                    <span className="text-slate-500 font-medium">/ {isAnnual ? 'mes (anual)' : 'mes'}</span>
                  </div>
                  
                  <Link 
                    href={`/registro?plan=${plan.id}`} 
                    className={`mt-8 block w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                      isRecommended 
                        ? "bg-brand text-white hover:bg-brand-dark shadow-md shadow-brand/30 hover:shadow-brand/50" 
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    Comenzar con {plan.nombre}
                  </Link>
                </div>

                <div className="p-8 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Qué incluye</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 bg-emerald-100 p-0.5 rounded-full shrink-0">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="text-slate-700">
                        Hasta <strong className="font-semibold text-slate-900">{plan.limite_usuarios}</strong> empleados
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 bg-emerald-100 p-0.5 rounded-full shrink-0">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="text-slate-700">
                        <strong className="font-semibold text-slate-900">{plan.almacenamiento_gb} GB</strong> de almacenamiento
                      </span>
                    </li>
                    
                    <div className="w-full h-px bg-slate-100 my-4" />
                    
                    {getExtraFeatures(plan.nombre).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 bg-emerald-100 p-0.5 rounded-full shrink-0">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-24 pt-10 border-t border-slate-200 flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Con la confianza de equipos modernos</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            <div className="flex items-center gap-2 text-xl font-bold font-sans"><Building size={24}/> AcmeCorp</div>
            <div className="flex items-center gap-2 text-xl font-bold font-serif"><Users size={24}/> Globex</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Star size={24}/> Initech</div>
          </div>
        </div>

      </div>
    </div>
  );
}