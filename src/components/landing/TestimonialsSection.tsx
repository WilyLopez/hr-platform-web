import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    { 
      text: "NexusRH transformó nuestra gestión de asistencia. Todo es mucho más rápido y preciso.", 
      author: "Carlos Ruiz", 
      role: "Gerente de RRHH",
      company: "TechSolutions",
      avatar: "CR" 
    },
    { 
      text: "La app móvil es intuitiva y nuestros empleados la adoptaron sin problemas desde el primer día.", 
      author: "Elena Gómez", 
      role: "Directora de Operaciones",
      company: "Logística Perú",
      avatar: "EG" 
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.role} • {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
