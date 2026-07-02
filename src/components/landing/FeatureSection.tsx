import { Building2, Users, Clock, Shield, Bell } from "lucide-react";

const modules = [
  { icon: Building2, title: "Gestión de empresas", desc: "Validación de RUC, selección de plan y creación automática del propietario." },
  { icon: Users, title: "Gestión de empleados", desc: "Altas, edición, sedes, áreas y códigos únicos para acceso móvil." },
  { icon: Clock, title: "Asistencia QR", desc: "Marcación desde app móvil con QR temporal y validación por geolocalización." },
  { icon: Shield, title: "Auditoría", desc: "Historial de inicios de sesión, cambios, marcaciones y acciones relevantes." },
  { icon: Bell, title: "Notificaciones", desc: "Avisos de registro, vencimiento de prueba, facturación y eventos operativos." },
];

export function FeatureSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Módulos principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((m, i) => (
            <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <m.icon className="w-10 h-10 text-slate-900 mb-6" />
              <h3 className="text-xl font-semibold mb-3">{m.title}</h3>
              <p className="text-slate-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
