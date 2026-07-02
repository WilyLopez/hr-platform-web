"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  label:      string;
  icon?:      LucideIcon;
  onClick:    () => void;
  variant?:   "default" | "danger";
  disabled?:  boolean;
  separator?: boolean; // muestra un divider ANTES de este item
}

interface DropdownProps {
  /** Elemento que abre el menú al hacer clic */
  trigger:      React.ReactNode;
  items:        DropdownItem[];
  align?:       "left" | "right";
  className?:   string;
  menuClassName?: string;
}

/**
 * Menú desplegable de acciones accesible y robusto.
 * Se cierra al hacer clic fuera o al presionar Escape.
 *
 * @example
 * <Dropdown
 *   trigger={<Button variant="ghost" size="sm" rightIcon={<ChevronDown size={14}/>}>Acciones</Button>}
 *   items={[
 *     { label: "Editar", icon: Pencil, onClick: () => {} },
 *     { label: "Eliminar", icon: Trash2, onClick: () => {}, variant: "danger", separator: true },
 *   ]}
 * />
 */
export function Dropdown({
  trigger,
  items,
  align = "right",
  className,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-44 rounded-lg border border-border",
            "bg-card text-card-foreground shadow-dropdown animate-slide-down py-1",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
          role="menu"
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx}>
                {item.separator && (
                  <div className="my-1 border-t border-border" />
                )}
                <button
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    item.variant === "danger"
                      ? "text-danger hover:bg-danger-light"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {Icon && <Icon size={15} className="flex-shrink-0" />}
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Trigger estándar de 3 puntos para usar con Dropdown */
export function DropdownTriggerDots({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        "p-1.5 rounded-md text-muted-foreground hover:text-foreground",
        "hover:bg-muted transition-colors",
        className
      )}
      aria-label="Abrir menú de acciones"
    >
      <ChevronDown size={16} />
    </button>
  );
}
