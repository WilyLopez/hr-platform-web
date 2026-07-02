"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Menu, X } from "lucide-react";

export function LandingTopbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="NexusRH" className="h-10 w-auto" />
        </Link>
        
        {/* Nav Escritorio */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/#modulos" className="text-sm text-slate-600 hover:text-brand transition-colors">
            Módulos
          </Link>
          <Link href="/#flujo" className="text-sm text-slate-600 hover:text-brand transition-colors">
            Flujo
          </Link>
          <Link href="/planes" className="text-sm text-slate-600 hover:text-brand transition-colors">
            Planes
          </Link>
          <Link href="/contacto" className="text-sm text-slate-600 hover:text-brand transition-colors">
            Contacto
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin/login">
            <Button variant="ghost" size="sm">
              Ingresar
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Comenzar gratis</Button>
          </Link>
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-brand transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav Móvil */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-slide-down">
          <div className="flex flex-col p-4 space-y-4">
            <Link 
              href="/#modulos" 
              className="text-sm text-slate-600 hover:text-brand font-medium"
              onClick={() => setIsOpen(false)}
            >
              Módulos
            </Link>
            <Link 
              href="/#flujo" 
              className="text-sm text-slate-600 hover:text-brand font-medium"
              onClick={() => setIsOpen(false)}
            >
              Flujo
            </Link>
            <Link 
              href="/planes" 
              className="text-sm text-slate-600 hover:text-brand font-medium"
              onClick={() => setIsOpen(false)}
            >
              Planes
            </Link>
            <Link 
              href="/contacto" 
              className="text-sm text-slate-600 hover:text-brand font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2">
              <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" fullWidth>Ingresar</Button>
              </Link>
              <Link href="/registro" onClick={() => setIsOpen(false)}>
                <Button fullWidth>Comenzar gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
