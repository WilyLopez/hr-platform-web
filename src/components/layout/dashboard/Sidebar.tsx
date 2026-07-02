"use client";
import { cn } from "@/utils/cn";
import { SidebarItem } from "./SidebarItem";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { empresaService } from "@/services/empresa.service";
import type { SidebarItemConfig } from "./SidebarItem";

interface SidebarProps {
    items: SidebarItemConfig[];
    portalName: string;
    className?: string;
}

export function Sidebar({ items, portalName, className }: SidebarProps) {
    const open = useUIStore((s) => s.sidebarOpen);
    const { usuario } = useAuth();
    const isSuperadmin = usuario?.rol === "SUPERADMIN";
    const empresaId = usuario?.empresa_id ?? 0;

    const { data: empresa } = useQuery({
        queryKey: ["empresa", empresaId],
        queryFn: () => empresaService.obtener(empresaId),
        enabled: !!empresaId && !isSuperadmin,
        staleTime: 5 * 60 * 1000,
    });

    const nombreEmpresa = empresa?.nombre_comercial || empresa?.razon_social || "NexusRH";
    const letraEmpresa = nombreEmpresa.charAt(0).toUpperCase();

    return (
        <aside
            className={cn(
                "flex flex-col bg-card border-r border-border transition-all duration-200 flex-shrink-0",
                open ? "w-sidebar" : "w-16",
                className,
            )}
        >
            <div className="flex items-center gap-2 px-4 h-topbar border-b border-border flex-shrink-0">
                {empresa?.logo_url ? (
                    <img src={empresa.logo_url} alt="Logo" className="w-7 h-7 rounded-md object-cover flex-shrink-0" />
                ) : (
                    <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{letraEmpresa}</span>
                    </div>
                )}
                {open && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">
                            {nombreEmpresa}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {portalName}
                        </p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
                {items.map((item) => (
                    <SidebarItem key={item.href} {...item} />
                ))}
            </nav>
        </aside>
    );
}
