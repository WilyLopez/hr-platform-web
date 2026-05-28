import Link from "next/link";
import { Button } from "@/components/ui";

export function LandingTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
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
          <Link href="/admin/login">
            <Button variant="ghost" size="sm">
              Ingresar
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Comenzar gratis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
