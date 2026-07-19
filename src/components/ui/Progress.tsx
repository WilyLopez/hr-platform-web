import { cn } from "@/utils/cn";

type ProgressVariant = "brand" | "success" | "warning" | "danger" | "neutral";
type ProgressSize    = "xs" | "sm" | "md";

interface ProgressProps {
  /** Valor entre 0 y 100 */
  value:       number;
  max?:        number;
  variant?:    ProgressVariant;
  size?:       ProgressSize;
  /** Muestra el porcentaje junto a la barra */
  showLabel?:  boolean;
  /** Etiqueta descriptiva sobre la barra */
  label?:      string;
  className?:  string;
  /** Si true, la barra cambia de color automáticamente según el % */
  autoColor?:  boolean;
}

const trackSizes: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
};

const barColors: Record<ProgressVariant, string> = {
  brand:   "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  neutral: "bg-neutral-400",
};

function autoVariant(pct: number): ProgressVariant {
  if (pct >= 80) return "danger";
  if (pct >= 60) return "warning";
  return "success";
}

/**
 * Barra de progreso accesible con variantes de color, tamaños y etiqueta.
 *
 * @example
 * // Uso de almacenamiento
 * <Progress value={72} max={100} label="Almacenamiento" showLabel autoColor />
 *
 * // Días de trial restantes (de 30)
 * <Progress value={diasUsados} max={30} variant="brand" size="sm" />
 */
export function Progress({
  value,
  max = 100,
  variant = "brand",
  size    = "sm",
  showLabel = false,
  label,
  className,
  autoColor = false,
}: ProgressProps) {
  const pct         = Math.min(100, Math.max(0, (value / max) * 100));
  const finalVariant = autoColor ? autoVariant(pct) : variant;

  return (
    <div className={cn("w-full", className)}>
      {/* Etiqueta superior */}
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs text-neutral-500 dark:text-slate-400 font-medium">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-neutral-700 dark:text-slate-300">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "w-full rounded-full bg-neutral-200 dark:bg-slate-700 overflow-hidden",
          trackSizes[size]
        )}
      >
        {/* Barra */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            barColors[finalVariant]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
