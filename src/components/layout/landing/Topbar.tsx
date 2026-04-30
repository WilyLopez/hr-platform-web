import Link from "next/link";
import { Button } from "@/components/ui";

export function LandingTopbar() {
    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <span className="text-base font-bold text-neutral-900">
                        NexusRH
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/planes"
                        className="text-sm text-neutral-600 hover:text-brand transition-colors"
                    >
                        Planes
                    </Link>
                    <Link
                        href="/contacto"
                        className="text-sm text-neutral-600 hover:text-brand transition-colors"
                    >
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
