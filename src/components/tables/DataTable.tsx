import { cn } from "@/utils/cn";
import { SkeletonTable } from "@/components/ui";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export interface Column<T> {
  key:        string;
  header:     string;
  render?:    (row: T) => React.ReactNode;
  className?: string;
  width?:     string;
}

interface DataTableProps<T> {
  columns:     Column<T>[];
  data:        T[];
  keyField:    keyof T;
  isLoading?:  boolean;
  isError?:    boolean;
  onRetry?:    () => void;
  emptyTitle?:  string;
  emptyDesc?:  string;
  onRowClick?: (row: T) => void;
  className?:  string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading  = false,
  isError    = false,
  onRetry,
  emptyTitle = "Sin resultados",
  emptyDesc  = "No se encontraron registros.",
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) return <SkeletonTable rows={5} />;
  if (isError)   return <ErrorState onRetry={onRetry} />;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-800/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wide",
                  col.width,
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDesc} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800/60 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-neutral-700 dark:text-slate-300", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}