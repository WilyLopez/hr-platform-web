"use client";
import { createContext, useContext, useState } from "react";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  active:    string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs: el componente debe usarse dentro de <Tabs>");
  return ctx;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TabsProps {
  defaultValue: string;
  children:     React.ReactNode;
  className?:   string;
}

interface TabListProps {
  children:   React.ReactNode;
  className?: string;
}

interface TabTriggerProps {
  value:      string;
  children:   React.ReactNode;
  icon?:      LucideIcon;
  badge?:     number | string;
  disabled?:  boolean;
  className?: string;
}

interface TabContentProps {
  value:      string;
  children:   React.ReactNode;
  className?: string;
}

// ─── Componentes ──────────────────────────────────────────────────────────────

/**
 * Contenedor raíz del sistema de tabs. Gestiona el estado activo.
 *
 * @example
 * <Tabs defaultValue="asistencia">
 *   <TabList>
 *     <TabTrigger value="asistencia" icon={Clock}>Asistencia</TabTrigger>
 *     <TabTrigger value="permisos"   icon={FileText} badge={3}>Permisos</TabTrigger>
 *   </TabList>
 *   <TabContent value="asistencia"><AsistenciaView /></TabContent>
 *   <TabContent value="permisos"><PermisosView /></TabContent>
 * </Tabs>
 */
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/** Barra de pestañas horizontal */
export function TabList({ children, className }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Pestaña individual con ícono y badge opcionales */
export function TabTrigger({
  value,
  children,
  icon: Icon,
  badge,
  disabled = false,
  className,
}: TabTriggerProps) {
  const { active, setActive } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${value}`}
      id={`tab-trigger-${value}`}
      disabled={disabled}
      onClick={() => !disabled && setActive(value)}
      className={cn(
        "relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium",
        "whitespace-nowrap transition-colors focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand/40 rounded-t-md",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive
          ? "text-primary border-b-2 border-primary -mb-px"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
    >
      {Icon && <Icon size={15} className="flex-shrink-0" />}
      {children}
      {badge !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-1.5 py-px",
            "text-[10px] font-bold min-w-[18px] leading-none",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/** Panel de contenido de la pestaña — solo renderiza cuando está activo */
export function TabContent({ value, children, className }: TabContentProps) {
  const { active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${value}`}
      aria-labelledby={`tab-trigger-${value}`}
      className={cn("animate-fade-in", className)}
    >
      {children}
    </div>
  );
}
