"use client";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";
import { useState } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

interface AlertProps {
  variant?:     AlertVariant;
  title?:       string;
  children:     React.ReactNode;
  icon?:        LucideIcon;
  dismissible?: boolean;
  className?:   string;
  onDismiss?:   () => void;
}

const config: Record<
  AlertVariant,
  { base: string; iconBase: string; DefaultIcon: LucideIcon }
> = {
  info: {
    base:        "bg-brand-pale border-brand/30 text-brand-dark",
    iconBase:    "text-brand",
    DefaultIcon: Info,
  },
  success: {
    base:        "bg-success-light border-success/30 text-success-dark",
    iconBase:    "text-success",
    DefaultIcon: CheckCircle2,
  },
  warning: {
    base:        "bg-warning-light border-warning/30 text-warning-dark",
    iconBase:    "text-warning",
    DefaultIcon: AlertTriangle,
  },
  danger: {
    base:        "bg-danger-light border-danger/30 text-danger-dark",
    iconBase:    "text-danger",
    DefaultIcon: XCircle,
  },
};

/**
 * Alerta inline para mostrar mensajes contextuales de información,
 * éxito, advertencia o error. Opcionalmente descartable.
 *
 * @example
 * <Alert variant="warning" title="Trial por vencer" dismissible>
 *   Tu período de prueba termina en 3 días.
 * </Alert>
 */
export function Alert({
  variant = "info",
  title,
  children,
  icon,
  dismissible = false,
  className,
  onDismiss,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const { base, iconBase, DefaultIcon } = config[variant];
  const Icon = icon ?? DefaultIcon;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm animate-fade-in",
        base,
        className
      )}
    >
      {/* Ícono */}
      <Icon size={18} className={cn("flex-shrink-0 mt-0.5", iconBase)} />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold mb-0.5">{title}</p>
        )}
        <div className="leading-5 opacity-90">{children}</div>
      </div>

      {/* Botón cerrar */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Cerrar alerta"
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
