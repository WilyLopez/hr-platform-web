"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

export interface SidebarItemConfig {
  label:  string;
  href:   string;
  icon:   LucideIcon;
  badge?: number;
}

export function SidebarItem({ label, href, icon: Icon, badge }: SidebarItemConfig) {
  const pathname = usePathname();
  const active   = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-to-r from-brand/10 to-transparent text-brand border-l-4 border-brand"
          : "text-muted-foreground border-l-4 border-transparent hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon size={18} className={cn("flex-shrink-0", active && "text-brand")} />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold",
            active ? "bg-background text-brand" : "bg-danger text-white"
          )}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}