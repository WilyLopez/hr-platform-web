"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";
import { 
  CheckCircle, 
  Smartphone, 
  Users, 
  Clock, 
  Shield, 
  BarChart2,
  ChevronRight
} from "lucide-react";
import { usePlanes } from "@/hooks/usePlanes";

const stats = [
  { value: "86", label: "requisitos funcionales" },
  { value: "11", label: "módulos integrados" },
  { value: "30", label: "días de prueba" },
  { value: "3", label: "web, API y móvil" },
];

const modules = [
  {
    icon: Users,
    title: "Gestión de empresas",
    desc: "Validación de RUC, selección de plan y creación automática del propietario."
  },
  {
    icon: Users,
    title: "Gestión de empleados",
    desc: "Altas, edición, sedes, áreas y códigos únicos para acceso móvil."
  },
  {
    icon: Clock,
    title: "Asistencia QR",
    desc: "Marcación desde app móvil con QR temporal y validación por geolocalización."
  },
  {
    icon: CheckCircle,
    title: "Permisos y solicitudes",
    desc: "Vacaciones, permisos médicos y personales con seguimiento de estados."
  },
  {
    icon: Shield,
    title: "Auditoría",
    desc: "Historial de inicios de sesión, cambios, marcaciones y acciones relevantes."
  },
  {
    icon: BarChart2,
    title: "Notificaciones",
    desc: "Avisos de registro, vencimiento de prueba, facturación y eventos operativos."
  },
];

const slides = [
  {
    label: "Registro",
    title: "Alta de empresas con validación SUNAT",
    text: "El propietario registra la empresa, selecciona el plan y recibe 30 días de prueba gratuita.",
  },
  {
    label: "Móvil",
    title: "Marcación por QR con geolocalización",
    text: "El empleado escanea el QR de su sede y la app valida si está dentro de la geovalla.",
  },
  {
    label: "Gestión",
    title: "Solicitudes digitales trazables",
    text: "Permisos y vacaciones se revisan desde el panel con historial, estados y responsables.",
  },
  {
    label: "Control",
    title: "Auditoría y reportes exportables",
    text: "Los administradores acceden a reportes PDF/CSV y trazabilidad completa por empresa.",
  },
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];
  const { data: planesData, isLoading: loadingPlanes } = usePlanes();
  
  const plans = planesData?.slice(0, 2).map((plan: any, index: number) => ({
    name: plan.nombre,
    price: `S/ ${plan.precio}`,
    features: [
      `Hasta ${plan.usuarios_maximos} usuarios activos`,
      `${plan.almacenamiento_gb} GB de almacenamiento`,
      "Soporte incluido",
      "Cambio de plan desde panel"
    ],
    highlight: index === 1
  })) || [];

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <main>
        {/* Hero Section */}
        <section className="overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-800 shadow-sm">
                Plataforma SaaS multi-tenant para RRHH
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                NexusRH centraliza empleados, asistencia y solicitudes en una sola plataforma
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Digitaliza procesos manuales de recursos humanos con una solución web y móvil para control,
                trazabilidad, reportes y decisiones basadas en datos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/registro">
                  <Button size="lg">Comenzar 30 días gratis</Button>
                </Link>
                <Link href="/#planes">
                  <Button variant="outline" size="lg">Ver planes</Button>
                </Link>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-bold text-blue-800">{stat.value}</p>
                    <p className="mt-1 text-xs leading-4 text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile App Preview */}
            <div className="group relative overflow-hidden rounded-xl bg-slate-950 p-6 text-white shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/30 sm:p-8">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f4e79,#163656_48%,#2e75b6)]" />
              <div className="absolute -right-16 top-8 hidden h-52 w-52 rotate-12 rounded-2xl border border-white/15 bg-white/5 md:block" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-cyan-400/20" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_0.75fr] md:items-center">
                <div>
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-900">
                      <Smartphone size={24} />
                    </div>
                    <span className="text-sm font-bold">NexusRH Mobile</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">App móvil para empleados</p>
                  <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                    Marca asistencia desde el celular
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-blue-50">
                    Escaneo QR, validación GPS, solicitudes y notificaciones en una experiencia móvil simple.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-900">QR + GPS</span>
                    <span className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white">Permisos desde la app</span>
                  </div>
                </div>
                <div className="relative mx-auto h-[330px] w-[220px] transition-transform duration-300 group-hover:-translate-y-3">
                  <div className="absolute left-1/2 top-0 h-full w-[178px] -translate-x-1/2 rounded-[2rem] border-[8px] border-slate-950 bg-slate-950 shadow-2xl transition-transform duration-300 group-hover:rotate-1">
                    <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
                    <div className="h-full overflow-hidden rounded-[1.45rem] bg-white text-slate-900">
                      <div className="bg-blue-800 px-4 pb-7 pt-10 text-white">
                        <p className="text-xs font-semibold text-blue-100">Hoy</p>
                        <h3 className="mt-1 text-xl font-bold">Entrada laboral</h3>
                        <p className="mt-1 text-xs text-blue-100">Sede Centro</p>
                      </div>
                      <div className="-mt-5 px-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="mx-auto grid h-24 w-24 grid-cols-3 gap-1 rounded-md bg-slate-950 p-2">
                            {Array.from({ length: 9 }).map((_, index) => (
                              <span key={index} className={`rounded-sm ${index % 2 === 0 ? "bg-white" : "bg-blue-100"}`} />
                            ))}
                          </div>
                          <p className="mt-3 text-center text-xs font-semibold text-slate-900">Escanear QR</p>
                        </div>
                        <div className="mt-4 rounded-lg bg-slate-50 p-3">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Ubicación</span>
                            <span className="font-semibold text-green-600">Válida</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-2 w-4/5 rounded-full bg-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Web Panel Preview */}
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">Panel web</span>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Control administrativo para propietarios</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Revisa asistencia, empleados, solicitudes pendientes, sedes, reportes y trazabilidad operativa.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">Panel NexusRH</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">Asistencia mensual</h2>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">En línea</span>
                </div>
              </div>
              <div className="space-y-5 p-5 text-slate-900">
                <div className="grid grid-cols-3 gap-3">
                  {["96 Empleados", "94% Asistencia", "12 Pendientes"].map((item) => (
                    <div key={item} className="rounded-lg bg-slate-50 p-4 text-sm font-semibold">{item}</div>
                  ))}
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="mb-4 text-sm font-semibold">Actividad por sede</p>
                  {[
                    ["Sede Centro", "92%"],
                    ["Sede Norte", "87%"],
                    ["Sede Remota", "76%"],
                  ].map(([name, value]) => (
                    <div key={name} className="mb-3">
                      <div className="mb-1 flex justify-between text-xs text-slate-500"><span>{name}</span><span>{value}</span></div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-blue-800" style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modulos" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">Módulos principales</span>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Todo el ciclo de Recursos Humanos en un flujo digital</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <article key={module.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                    <module.icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{module.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Flow Section */}
        <section id="flujo" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">Flujo del sistema</span>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Del registro al control diario del equipo</h2>
              </div>
              <div className="flex gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                      index === activeSlide 
                        ? "bg-blue-800 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">{slide.label}</p>
              <h3 className="mt-3 text-2xl font-bold text-slate-950">{slide.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{slide.text}</p>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="planes" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">Suscripción</span>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Planes simples con prueba gratuita</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {loadingPlanes ? (
                <div className="col-span-2 text-center py-8">Cargando planes...</div>
              ) : plans.length === 0 ? (
                <div className="col-span-2 text-center py-8">No hay planes disponibles</div>
              ) : (
                plans.map((plan) => (
                <article 
                  key={plan.name} 
                  className={`rounded-xl border bg-white p-6 shadow-sm ${
                    plan.highlight ? "border-blue-700 ring-1 ring-blue-700" : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">MÁS POPULAR</span>
                    )}
                  </div>
                  <p className="mt-4 text-4xl font-bold text-slate-950">
                    {plan.price}
                    <span className="text-sm font-normal text-slate-500"> / mes</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/registro" className="mt-6 block">
                    <Button fullWidth variant={plan.highlight ? "primary" : "outline"}>
                      Empezar prueba gratuita
                    </Button>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-800 py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold">¿Listo para transformar tus RRHH?</h2>
            <p className="mt-4 text-blue-100">
              Únete a las empresas que ya están digitalizando su gestión con NexusRH.
            </p>
            <div className="mt-10">
              <Link href="/registro">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                  Comenzar ahora mismo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
