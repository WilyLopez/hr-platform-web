import Link from "next/link";
import { Smartphone } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-slate-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            NexusRH: Digitaliza tu gestión de RRHH
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            Centraliza empleados, asistencia y solicitudes en una plataforma moderna y eficiente.
          </p>
          <div className="flex gap-4">
            <Link href="/registro" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
              Comenzar prueba gratuita
            </Link>
          </div>
        </div>
        
        <div className="relative group p-6 sm:p-8">
          <div className="absolute inset-0 bg-slate-900 rounded-2xl shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#334155,#1e293b_48%,#475569)] rounded-2xl" />
            <div className="absolute right-0 top-8 h-52 w-52 rotate-12 rounded-2xl border border-white/10 bg-white/5 hidden md:block" />
          </div>
          
          <div className="relative grid gap-8 md:grid-cols-[1fr_0.75fr] md:items-center text-white">
            <div>
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-900">
                  <Smartphone size={24} />
                </div>
                <span className="text-sm font-bold">NexusRH Mobile</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight">
                Marca asistencia desde el celular
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Escaneo QR, validación GPS, solicitudes y notificaciones en una experiencia móvil simple.
              </p>
            </div>
            
            <div className="relative mx-auto h-[330px] w-[220px]">
              <div className="absolute left-1/2 top-0 h-full w-[178px] -translate-x-1/2 rounded-[2rem] border-[8px] border-slate-950 bg-slate-950 shadow-2xl">
                <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
                <div className="h-full overflow-hidden rounded-[1.45rem] bg-white text-slate-900">
                  <div className="bg-slate-800 px-4 pb-7 pt-10 text-white">
                    <p className="text-xs font-semibold text-slate-400">Hoy</p>
                    <h3 className="mt-1 text-xl font-bold">Entrada laboral</h3>
                    <p className="mt-1 text-xs text-slate-400">Sede Centro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
