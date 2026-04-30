"use client";
import { cn } from "@/utils/cn";
import { SidebarItem } from "./SidebarItem";
import { useUIStore } from "@/store/ui.store";
import type { SidebarItemConfig } from "./SidebarItem";

interface SidebarProps {
    items: SidebarItemConfig[];
    portalName: string;
    className?: string;
}

export function Sidebar({ items, portalName, className }: SidebarProps) {
    const open = useUIStore((s) => s.sidebarOpen);

    return (
        <aside
            className={cn(
                "flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 flex-shrink-0",
                open ? "w-sidebar" : "w-16",
                className,
            )}
        >
            <div className="flex items-center gap-2 px-4 h-topbar border-b border-neutral-200 flex-shrink-0">
                <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">S</span>
                </div>
                {open && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-neutral-900 truncate">
                            NexusRH
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
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
