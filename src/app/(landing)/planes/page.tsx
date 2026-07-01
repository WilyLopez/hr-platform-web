import Link from "next/link";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui";

// ─── Datos estáticos de planes ────────────────────────────────────────────────
// La landing es una página informativa. Los precios y características
// NO se consumen de la API para garantizar disponibilidad sin autenticación.

const PLANES = [
  {
    id:      "basico",
    nombre:  "Básico",
    precio:  "S/ 99.00",
    popular: false,
    features: [
      "Hasta 20 empleados activos",
      "5 GB de almacenamiento",
      "Control de asistencia QR",
      "Gestión de solicitudes",
      "Reportes PDF/CSV",
      "App móvil incluida",
    ],
  },
  {
    id:      "pro",
    nombre:  "Pro",
    precio:  "S/ 199.00",
    popular: true,
    features: [
      "Hasta 100 empleados activos",
      "20 GB de almacenamiento",
      "Control de asistencia QR",
      "Gestión de solicitudes",
      "Reportes PDF/CSV",
      "App móvil incluida",
      "Múltiples sedes",
      "API de integración",
      "Soporte prioritario",
    ],
  },
];

type FeatureRow = {
  feature: string;
  basico:  boolean | string;
  pro:     boolean | string;
};

const FEATURES_TABLE: FeatureRow[] = [
  { feature: "Empleados activos",         basico: "Hasta 20",   pro: "Hasta 100" },
  { feature: "Almacenamiento",            basico: "5 GB",       pro: "20 GB"     },
  { feature: "Control de asistencia QR",  basico: true,         pro: true        },
  { feature: "Gestión de solicitudes",    basico: true,         pro: true        },
  { feature: "Reportes PDF/CSV",          basico: true,         pro: true        },
  { feature: "Auditoría y trazabilidad",  basico: true,         pro: true        },
  { feature: "App móvil incluida",        basico: true,         pro: true        },
  { feature: "Múltiples sedes",           basico: false,        pro: true        },
  { feature: "API de integración",        basico: false,        pro: true        },
  { feature: "Soporte prioritario",       basico: false,        pro: true        },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string")
    return <span className="text-sm text-neutral-700">{value}</span>;
  return value
    ? <CheckCircle size={18} className="text-success mx-auto" />
    : <X           size={18} className="text-neutral-300 mx-auto" />;
}

export default function PlanesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900">Planes y precios</h1>
        <p className="text-neutral-500 mt-3">
          30 días de prueba gratis. Sin tarjeta de crédito. Cancela cuando quieras.
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {PLANES.map((plan) => (
          <div
            key={plan.id}
            className={`card p-6 flex flex-col ${
              plan.popular ? "ring-2 ring-brand shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <span className="inline-block self-start mb-3 px-2.5 py-0.5 rounded-full bg-brand text-white text-xs font-semibold">
                Más popular
              </span>
            )}
            <h2 className="text-xl font-bold text-neutral-900">{plan.nombre}</h2>
            <div className="mt-2 mb-5">
              <span className="text-4xl font-bold text-neutral-900">{plan.precio}</span>
              <span className="text-sm text-neutral-400"> / mes</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle size={15} className="text-success flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/registro">
              <Button
                fullWidth
                variant={plan.popular ? "primary" : "outline"}
                size="md"
              >
                Comenzar 30 días gratis
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Tabla comparativa */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-50">
          <div className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
            Característica
          </div>
          <div className="px-4 py-3 text-xs font-semibold text-neutral-700 uppercase text-center">
            Básico
          </div>
          <div className="px-4 py-3 text-xs font-semibold text-brand uppercase text-center">
            Pro
          </div>
        </div>
        {FEATURES_TABLE.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 border-b border-neutral-100 ${
              i % 2 === 0 ? "bg-white" : "bg-neutral-50"
            }`}
          >
            <div className="px-4 py-3 text-sm text-neutral-700">{row.feature}</div>
            <div className="px-4 py-3 text-center">
              <FeatureValue value={row.basico} />
            </div>
            <div className="px-4 py-3 text-center">
              <FeatureValue value={row.pro} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA inferior */}
      <div className="mt-10 text-center text-sm text-neutral-500">
        ¿Tienes dudas sobre qué plan elegir?{" "}
        <Link href="/contacto" className="text-brand font-medium hover:underline">
          Contáctanos
        </Link>
      </div>
    </div>
  );
}