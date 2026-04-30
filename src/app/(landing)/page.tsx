import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import {
    CheckCircle,
    Clock,
    Users,
    BarChart2,
    Shield,
    Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
    title: "NexusRH — Gestión de Recursos Humanos SaaS",
    description:
        "Controla la asistencia, empleados y solicitudes de tu empresa desde cualquier dispositivo.",
};

const FEATURES = [
    {
        icon: Clock,
        title: "Control de asistencia",
        desc: "Registro QR + geolocalización desde el móvil. Sin fraudes, sin papel.",
    },
    {
        icon: Users,
        title: "Gestión de empleados",
        desc: "Alta, baja y modificación de empleados en segundos. Todo centralizado.",
    },
    {
        icon: BarChart2,
        title: "Reportes en tiempo real",
        desc: "Dashboards, tardanzas, ausencias y exportación a PDF o Excel.",
    },
    {
        icon: CheckCircle,
        title: "Solicitudes digitales",
        desc: "Vacaciones y permisos con flujo de aprobación configurable.",
    },
    {
        icon: Shield,
        title: "Auditoría completa",
        desc: "Log inmutable de cada acción. Trazabilidad total para tu empresa.",
    },
    {
        icon: Smartphone,
        title: "App móvil incluida",
        desc: "Tus empleados marcan asistencia desde su teléfono. Sin hardware.",
    },
];

const PLANS = [
    {
        name: "Básico",
        price: "S/ 49.90",
        period: "/ mes",
        desc: "Ideal para pequeñas empresas.",
        limit: "Hasta 20 empleados",
        storage: "5 GB",
        cta: "Empezar gratis",
        highlight: false,
    },
    {
        name: "Pro",
        price: "S/ 99.90",
        period: "/ mes",
        desc: "Para empresas en crecimiento.",
        limit: "Hasta 100 empleados",
        storage: "20 GB",
        cta: "Empezar gratis",
        highlight: true,
    },
];

export default function HomePage() {
    return (
        <>
            <section className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pale text-brand text-xs font-medium mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    Plataforma SaaS — 30 días gratis sin tarjeta
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight text-balance max-w-3xl mx-auto">
                    Gestiona tu equipo desde cualquier lugar
                </h1>
                <p className="mt-5 text-lg text-neutral-500 max-w-xl mx-auto text-balance">
                    Control de asistencia con QR, empleados, solicitudes y
                    reportes. Todo en una sola plataforma.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/registro">
                        <Button size="lg">Comenzar gratis</Button>
                    </Link>
                    <Link href="/planes">
                        <Button size="lg" variant="outline">
                            Ver planes
                        </Button>
                    </Link>
                </div>
                <p className="mt-4 text-xs text-neutral-400">
                    Sin tarjeta de crédito · Cancela cuando quieras
                </p>
            </section>

            <section className="bg-neutral-50 py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-neutral-900 text-center mb-3">
                        Todo lo que necesitas para RRHH
                    </h2>
                    <p className="text-neutral-500 text-center mb-12 text-sm max-w-lg mx-auto">
                        Diseñado para equipos reales. Sin complejidad
                        innecesaria.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="card p-6">
                                <div className="w-10 h-10 rounded-lg bg-brand-pale flex items-center justify-center mb-4">
                                    <f.icon size={20} className="text-brand" />
                                </div>
                                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-neutral-900 text-center mb-3">
                        Planes simples y transparentes
                    </h2>
                    <p className="text-neutral-500 text-center mb-12 text-sm">
                        Empieza gratis 30 días. Sin sorpresas.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`card p-6 ${plan.highlight ? "ring-2 ring-brand" : ""}`}
                            >
                                {plan.highlight && (
                                    <span className="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-brand text-white text-xs font-medium">
                                        Más popular
                                    </span>
                                )}
                                <h3 className="text-lg font-bold text-neutral-900">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    {plan.desc}
                                </p>
                                <div className="mt-4 flex items-end gap-1">
                                    <span className="text-3xl font-bold text-neutral-900">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-neutral-400 mb-1">
                                        {plan.period}
                                    </span>
                                </div>
                                <ul className="mt-5 space-y-2">
                                    {[
                                        plan.limit,
                                        plan.storage + " de almacenamiento",
                                        "Soporte incluido",
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm text-neutral-600"
                                        >
                                            <CheckCircle
                                                size={15}
                                                className="text-success flex-shrink-0"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/registro" className="block mt-6">
                                    <Button
                                        fullWidth
                                        variant={
                                            plan.highlight
                                                ? "primary"
                                                : "outline"
                                        }
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
