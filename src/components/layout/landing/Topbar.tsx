"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Menu, X } from "lucide-react";

export function LandingTopbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="NexusRH" className="h-8 w-auto" />
          
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#modulos" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Módulos</Link>
          <Link href="/planes" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Planes</Link>
          <Link href="/contacto" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Contacto</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Ingresar</Link>
          <Link href="/registro" className="bg-slate-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm">Comenzar gratis</Link>
        </div>

        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4">
          <Link href="/#modulos" className="block text-sm font-medium text-slate-600" onClick={() => setIsOpen(false)}>Módulos</Link>
          <Link href="/planes" className="block text-sm font-medium text-slate-600" onClick={() => setIsOpen(false)}>Planes</Link>
          <Link href="/contacto" className="block text-sm font-medium text-slate-600" onClick={() => setIsOpen(false)}>Contacto</Link>
          <hr />
          <Link href="/login" className="block text-sm font-medium text-slate-600" onClick={() => setIsOpen(false)}>Ingresar</Link>
          <Link href="/registro" className="block bg-slate-600 text-white text-center py-2 rounded-lg font-semibold" onClick={() => setIsOpen(false)}>Comenzar gratis</Link>
        </div>
      )}
    </header>
  );
}
