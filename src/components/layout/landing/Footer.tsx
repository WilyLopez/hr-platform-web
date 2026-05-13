import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 md:flex-row">
        <img src="/logo.svg" alt="NexusRH" className="h-9 w-auto" />
        <nav className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/#modulos" className="text-xs text-slate-500 hover:text-blue-700">
            Modulos
          </Link>
          <Link href="/#flujo" className="text-xs text-slate-500 hover:text-blue-700">
            Flujo
          </Link>
          <Link href="/planes" className="text-xs text-slate-500 hover:text-blue-700">
            Planes
          </Link>
          <Link href="/contacto" className="text-xs text-slate-500 hover:text-blue-700">
            Contacto
          </Link>
          <Link href="/terminos" className="text-xs text-slate-500 hover:text-blue-700">
            Terminos
          </Link>
          <Link href="/privacidad" className="text-xs text-slate-500 hover:text-blue-700">
            Privacidad
          </Link>
        </nav>
        <p className="text-xs text-slate-400">
          © 2026 NexusRH. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
