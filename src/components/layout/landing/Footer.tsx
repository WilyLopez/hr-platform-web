import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 md:col-span-2">
            <span className="text-xl font-bold text-white">NexusRH</span>
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              Digitalizando la gestión de RRHH para empresas modernas. Eficiencia, control y trazabilidad en un solo lugar.
            </p>
            <div className="flex gap-4 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-white transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          {[
            { title: "Producto", links: [{ label: "Planes", href: "/planes" }, { label: "Contacto", href: "/contacto" }] },
            { title: "Empresa", links: [{ label: "Nosotros", href: "#" }, { label: "Blog", href: "#" }] },
            { title: "Legal", links: [{ label: "Términos", href: "/terminos" }, { label: "Privacidad", href: "/privacidad" }] },
          ].map(section => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} NexusRH. Todos los derechos reservados.</p>
          <p>Hecho con pasión para empresas modernas.</p>
        </div>
      </div>
    </footer>
  );
}
