import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t border-neutral-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="NexusRH" className="h-7 w-auto" />
                        <span className="text-sm font-bold text-neutral-800">
                            NexusRH
                        </span>
                    </div>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/planes"
                            className="text-xs text-neutral-500 hover:text-brand transition-colors"
                        >
                            Planes
                        </Link>
                        <Link
                            href="/contacto"
                            className="text-xs text-neutral-500 hover:text-brand transition-colors"
                        >
                            Contacto
                        </Link>
                        <Link
                            href="/terminos"
                            className="text-xs text-neutral-500 hover:text-brand transition-colors"
                        >
                            Términos
                        </Link>
                        <Link
                            href="/privacidad"
                            className="text-xs text-neutral-500 hover:text-brand transition-colors"
                        >
                            Privacidad
                        </Link>
                    </nav>

                    <p className="text-xs text-neutral-400">
                        © {new Date().getFullYear()} NexusRH. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
