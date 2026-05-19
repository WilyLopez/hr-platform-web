"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { CheckCircle, X, Loader } from "lucide-react";
import { suscripcionService } from "@/services/suscripcion.service";
import type { Plan } from "@/types/suscripcion.types";

type FeatureComparison = {
  feature: string;
  basico: boolean | string;
  pro: boolean | string;
};

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm text-neutral-700">{value}</span>;
  return value
    ? <CheckCircle size={18} className="text-success mx-auto" />
    : <X size={18} className="text-neutral-300 mx-auto" />;
}

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<FeatureComparison[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        setCargando(true);
        const planesData = await suscripcionService.listarPlanes();
        setPlanes(planesData);
        
        const basicoPlan = planesData.find(p => p.nombre === "BASICO");
        const proPlan = planesData.find(p => p.nombre === "PRO");
        
        const featuresComparison: FeatureComparison[] = [
          { feature: "Empleados activos", basico: basicoPlan ? `Hasta ${basicoPlan.limite_usuarios}` : "Hasta 20", pro: proPlan ? `Hasta ${proPlan.limite_usuarios}` : "Hasta 100" },
          { feature: "Almacenamiento", basico: basicoPlan ? `${basicoPlan.almacenamiento_gb} GB` : "5 GB", pro: proPlan ? `${proPlan.almacenamiento_gb} GB` : "20 GB" },
          { feature: "Control de asistencia QR", basico: true, pro: true },
          { feature: "Gestión de solicitudes", basico: true, pro: true },
          { feature: "Reportes PDF/CSV", basico: true, pro: true },
          { feature: "Auditoría y trazabilidad", basico: true, pro: true },
          { feature: "App móvil incluida", basico: true, pro: true },
          { feature: "Múltiples sedes", basico: false, pro: true },
          { feature: "API de integración", basico: false, pro: true },
          { feature: "Soporte prioritario", basico: false, pro: true },
        ];
        
        setFeatures(featuresComparison);
        setError(null);
      } catch (err) {
        console.error("Error al cargar planes:", err);
        setError("No se pudieron cargar los planes. Intenta más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarPlanes();
  }, []);

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  if (error || planes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900">Planes y precios</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center">
          {error || "No hay planes disponibles en este momento."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900">Planes y precios</h1>
        <p className="text-neutral-500 mt-3">
          30 días de prueba gratis. Sin tarjeta de crédito. Cancela cuando quieras.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={`card p-6 text-center ${plan.nombre === "PRO" ? "ring-2 ring-brand" : ""}`}
          >
            {plan.nombre === "PRO" && (
              <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-brand text-white text-xs font-medium">
                Más popular
              </span>
            )}
            <h2 className="text-lg font-bold text-neutral-900">
              {plan.nombre === "BASICO" ? "Básico" : "Pro"}
            </h2>
            <div className="mt-2">
              <span className="text-3xl font-bold">S/ {plan.precio_mensual.toFixed(2)}</span>
              <span className="text-sm text-neutral-400"> / mes</span>
            </div>
            <Link href="/registro" className="block mt-4">
              <Button fullWidth variant={plan.nombre === "PRO" ? "primary" : "outline"} size="sm">
                Comenzar gratis
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-50">
          <div className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Característica</div>
          <div className="px-4 py-3 text-xs font-semibold text-neutral-700 uppercase text-center">Básico</div>
          <div className="px-4 py-3 text-xs font-semibold text-brand uppercase text-center">Pro</div>
        </div>
        {features.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 border-b border-neutral-100 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50"}`}
          >
            <div className="px-4 py-3 text-sm text-neutral-700">{row.feature}</div>
            <div className="px-4 py-3 text-center"><FeatureValue value={row.basico} /></div>
            <div className="px-4 py-3 text-center"><FeatureValue value={row.pro} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}