"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { suscripcionService } from "@/services/suscripcion.service";
import { Button } from "@/components/ui";
import { 
  CheckCircle, 
  Smartphone, 
  Users, 
  Building2,
  Clock, 
  Shield, 
  Bell,
  BarChart2,
  ChevronRight,
} from "lucide-react";

const stats = [
  { value: "86", label: "requisitos funcionales" },
  { value: "11", label: "módulos integrados" },
  { value: "30", label: "días de prueba" },
  { value: "3", label: "web, API y móvil" },
];

const modules = [
  {
    icon: Building2,
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
    icon: Bell,
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

// Datos estáticos de planes — la landing es informativa, no depende de la API
const PLANES_LANDING = [
  {
    name:      "Básico",
    price:     "S/ 0.00",
    features:  [
      "Hasta 20 usuarios activos",
      "5 GB de almacenamiento",
      "Soporte estándar",
      "Gestión de empleados y reportes",
    ],
    highlight: true,
  },
  {
    name:      "Pro",
    price:     "S/ 29.00",
    features:  [
      "Hasta 50 usuarios activos",
      "10 GB de almacenamiento",
      "Soporte estándar",
      "Notificaciones por correo",
    ],
    highlight: false,
  },
  {
    name:      "Avanzado",
    price:     "S/ 59.00",
    features:  [
      "Hasta 150 usuarios activos",
      "50 GB de almacenamiento",
      "Soporte prioritario",
      "Auditoría avanzada",
    ],
    highlight: false,
  },
  {
    name:      "Premium",
    price:     "S/ 99.00",
    features:  [
      "Usuarios ilimitados",
      "100 GB de almacenamiento",
      "Soporte 24/7 dedicado",
      "Integración API completa",
    ],
    highlight: false,
  },
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [apiPlanes, setApiPlanes] = useState(PLANES_LANDING);

  useEffect(() => {
    async function loadPlanes() {
      try {
        const data = await suscripcionService.listarPlanes();
        const activos = data.filter((p) => p.es_activo);
        
        const mappedPlanes = activos.map(p => ({
          name: p.nombre,
          price: `S/ ${parseFloat(p.precio_mensual.toString()).toFixed(2)}`,
          precio_mensual_num: Number(p.precio_mensual),
          features: [
            `Hasta ${p.limite_usuarios === 99999 ? 'ilimitados' : p.limite_usuarios} usuarios`,
            `${p.almacenamiento_gb} GB de almacenamiento`,
            p.descripcion_corta || "Soporte estándar",
          ],
          highlight: p.nombre.toLowerCase().includes("básico") || p.nombre.toLowerCase().includes("pro"),
        })).sort((a, b) => a.precio_mensual_num - b.precio_mensual_num);
        setApiPlanes(mappedPlanes);
      } catch (e) {
        console.error("Error cargando planes", e);
      }
    }
    loadPlanes();
  }, []);

  const slide = slides[activeSlide];
  const plans = apiPlanes;

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <main>
        {/* Hero Section */}
        <section className="overflow-hidden bg-gradient-to-b from-brand-pale to-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-20">
            <div className="animate-fade-in">
              <span className="inline-flex rounded-full border border-brand/20 bg-white px-4 py-2 text-xs font-semibold text-brand-dark shadow-sm animate-fade-in">
                Plataforma SaaS multi-tenant para RRHH
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl animate-fade-in" style={{ animationDelay: '100ms' }}>
                NexusRH centraliza empleados, asistencia y solicitudes en una sola plataforma
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                Digitaliza procesos manuales de recursos humanos con una solución web y móvil para control,
                trazabilidad, reportes y decisiones basadas en datos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Link href="/registro">
                  <Button size="lg">Comenzar 30 días gratis</Button>
                </Link>
                <Link href="/#planes">
                  <Button variant="outline" size="lg">Ver planes</Button>
                </Link>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                    <p className="mt-1 text-xs leading-4 text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile App Preview */}
            <div className="group relative overflow-hidden rounded-xl bg-neutral-950 p-6 text-white shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-dark/30 sm:p-8">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f4e79,#163656_48%,#2e75b6)]" />
              <div className="absolute -right-16 top-8 hidden h-52 w-52 rotate-12 rounded-2xl border border-white/15 bg-white/5 md:block" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-cyan-400/20" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_0.75fr] md:items-center">
                <div>
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-dark">
                      <Smartphone size={24} />
                    </div>
                    <span className="text-sm font-bold">NexusRH Mobile</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-pale">App móvil para empleados</p>
                  <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                    Marca asistencia desde el celular
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-brand-pale">
                    Escaneo QR, validación GPS, solicitudes y notificaciones en una experiencia móvil simple.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-dark">QR + GPS</span>
                    <span className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white">Permisos desde la app</span>
                  </div>
                </div>
                <div className="relative mx-auto h-[330px] w-[220px] transition-transform duration-300 group-hover:-translate-y-3">
                  <div className="absolute left-1/2 top-0 h-full w-[178px] -translate-x-1/2 rounded-[2rem] border-[8px] border-neutral-950 bg-neutral-950 shadow-2xl transition-transform duration-300 group-hover:rotate-1">
                    <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-900" />
                    <div className="h-full overflow-hidden rounded-[1.45rem] bg-white text-neutral-900">
                      <div className="bg-brand px-4 pb-7 pt-10 text-white">
                        <p className="text-xs font-semibold text-brand-pale">Hoy</p>
                        <h3 className="mt-1 text-xl font-bold">Entrada laboral</h3>
                        <p className="mt-1 text-xs text-brand-pale">Sede Centro</p>
                      </div>
                      <div className="-mt-5 px-4">
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                          <div className="mx-auto grid h-24 w-24 grid-cols-3 gap-1 rounded-md bg-neutral-950 p-2">
                            {Array.from({ length: 9 }).map((_, index) => (
                              <span key={index} className={`rounded-sm ${index % 2 === 0 ? "bg-white" : "bg-brand-pale"}`} />
                            ))}
                          </div>
                          <p className="mt-3 text-center text-xs font-semibold text-neutral-900">Escanear QR</p>
                        </div>
                        <div className="mt-4 rounded-lg bg-neutral-50 p-3">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="text-neutral-500">Ubicación</span>
                            <span className="font-semibold text-success">Válida</span>
                          </div>
                          <div className="h-2 rounded-full bg-neutral-200">
                            <div className="h-2 w-4/5 rounded-full bg-success" />
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
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Panel web</span>
              <h2 className="mt-3 text-3xl font-bold text-neutral-950">Control administrativo para propietarios</h2>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Revisa asistencia, empleados, solicitudes pendientes, sedes, reportes y trazabilidad operativa.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white shadow-xl">
              <div className="border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Panel NexusRH</p>
                    <h2 className="mt-1 text-lg font-bold text-neutral-950">Asistencia mensual</h2>
                  </div>
                  <span className="rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">En línea</span>
                </div>
              </div>
              <div className="space-y-5 p-5 text-neutral-900">
                <div className="grid grid-cols-3 gap-3">
                  {["96 Empleados", "94% Asistencia", "12 Pendientes"].map((item) => (
                    <div key={item} className="rounded-lg bg-neutral-50 p-4 text-sm font-semibold">{item}</div>
                  ))}
                </div>
                <div className="rounded-lg border border-neutral-200 p-4">
                  <p className="mb-4 text-sm font-semibold">Actividad por sede</p>
                  {[
                    ["Sede Centro", "92%"],
                    ["Sede Norte", "87%"],
                    ["Sede Remota", "76%"],
                  ].map(([name, value]) => (
                    <div key={name} className="mb-3">
                      <div className="mb-1 flex justify-between text-xs text-neutral-500"><span>{name}</span><span>{value}</span></div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-brand" style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modulos" className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Módulos principales</span>
              <h2 className="mt-3 text-3xl font-bold text-neutral-950">Todo el ciclo de Recursos Humanos en un flujo digital</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <article key={module.title} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-pale text-brand-dark">
                    <module.icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-950">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{module.desc}</p>
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
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Flujo del sistema</span>
                <h2 className="mt-3 text-3xl font-bold text-neutral-950">Del registro al control diario del equipo</h2>
              </div>
              <div className="flex gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                      index === activeSlide 
                        ? "bg-brand text-white" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">{slide.label}</p>
              <h3 className="mt-3 text-2xl font-bold text-neutral-950">{slide.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">{slide.text}</p>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="planes" className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Suscripción</span>
              <h2 className="mt-3 text-3xl font-bold text-neutral-950">Planes simples con prueba gratuita</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <article 
                  key={plan.name} 
                  className={`rounded-xl border bg-white p-6 shadow-sm ${
                    plan.highlight ? "border-brand ring-1 ring-brand" : "border-neutral-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-neutral-950">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="bg-brand-pale text-brand-dark text-xs font-bold px-2.5 py-1 rounded">MÁS POPULAR</span>
                    )}
                  </div>
                  <p className="mt-4 text-4xl font-bold text-neutral-950">
                    {plan.price}
                    <span className="text-sm font-normal text-neutral-500"> / mes</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-neutral-700">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-success" />
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

        {/* FAQ Section */}
        <section id="faq" className="bg-white py-20 border-t border-neutral-100">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Soporte</span>
              <h2 className="mt-3 text-3xl font-bold text-neutral-950">Preguntas Frecuentes</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {[
                {
                  q: "¿Qué sucede al finalizar los 30 días de prueba?",
                  a: "Tu cuenta se pausará y no podrás acceder a las funciones premium hasta que selecciones un plan de pago. Ningún dato será eliminado durante los siguientes 90 días."
                },
                {
                  q: "¿Puedo cambiar de plan en cualquier momento?",
                  a: "Sí, puedes subir de plan (upgrade) o bajar (downgrade) desde el panel de propietario. Los ajustes en el cobro se harán de manera prorrateada."
                },
                {
                  q: "¿Los empleados necesitan descargar una app para marcar asistencia?",
                  a: "Sí, pueden descargar nuestra app disponible para iOS y Android para marcar asistencia mediante códigos QR generados dinámicamente y con validación GPS."
                },
                {
                  q: "¿Ofrecen soporte técnico?",
                  a: "El soporte básico está incluido en todos los planes. El plan Pro incluye un ejecutivo de cuenta y soporte prioritario 24/7."
                }
              ].map((faq, index) => (
                <details key={index} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-neutral-900 marker:content-none hover:text-brand">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-neutral-400 group-open:-rotate-180 transition-transform duration-200">
                      <ChevronRight size={20} />
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-600 leading-relaxed animate-fade-in">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold">¿Listo para transformar tus RRHH?</h2>
            <p className="mt-4 text-brand-pale">
              Únete a las empresas que ya están digitalizando su gestión con NexusRH.
            </p>
            <div className="mt-10">
              <Link href="/registro">
                <Button size="lg" className="bg-white text-brand-dark hover:bg-brand-pale">
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