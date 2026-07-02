import { cn } from "@/utils/cn";
import { Button } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

interface TableEmptyStateProps {
  /** Número de columnas del `<table>` padre (para el `colSpan` de la celda) */
  colSpan:      number;
  icon?:        LucideIcon;
  title?:       string;
  description?: string;
  /** Acción principal (ej: "Agregar primero" o "Limpiar filtros") */
  action?:      { label: string; onClick: () => void };
  className?:   string;
}

/**
 * Estado vacío diseñado para usarse dentro de un `<tbody>` de tabla.
 * Ocupa todas las columnas mediante `colSpan` y centra el contenido.
 *
 * @example
 * <tbody>
 *   {data.length === 0 && (
 *     <TableEmptyState colSpan={5} title="Sin resultados" />
 *   )}
 * </tbody>
 */
export function TableEmptyState({
  colSpan,
  icon: Icon = SearchX,
  title = "Sin resultados",
  description = "No se encontraron registros que coincidan con los filtros aplicados.",
  action,
  className,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center py-12 px-6",
            className
          )}
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Icon size={22} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {description}
            </p>
          )}
          {action && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
