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
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-brand text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold",
            active ? "bg-white text-brand" : "bg-danger text-white"
          )}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}