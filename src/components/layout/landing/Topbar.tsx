import Link from "next/link";

export function LandingTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="NexusRH" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/#modulos" className="text-sm text-slate-600 hover:text-blue-700">
            Modulos
          </Link>
          <Link href="/#flujo" className="text-sm text-slate-600 hover:text-blue-700">
            Flujo
          </Link>
          <Link href="/planes" className="text-sm text-slate-600 hover:text-blue-700">
            Planes
          </Link>
          <Link href="/contacto" className="text-sm text-slate-600 hover:text-blue-700">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/registro" className="hidden text-sm font-medium text-slate-700 hover:text-blue-700 sm:block">
            Ingresar
          </Link>
          <Link href="/registro" className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
            Comenzar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
