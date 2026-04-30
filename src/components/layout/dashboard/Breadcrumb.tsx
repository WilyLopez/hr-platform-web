"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="text-neutral-300" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-xs",
                  isLast ? "text-neutral-700 font-medium" : "text-neutral-400"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}