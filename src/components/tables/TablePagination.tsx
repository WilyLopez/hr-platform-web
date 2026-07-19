import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage:  number;
  totalPages:   number;
  totalItems:   number;
  pageSize:     number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-slate-800">
      <p className="text-xs text-neutral-500 dark:text-slate-400">
        Mostrando <span className="font-medium">{from}–{to}</span> de{" "}
        <span className="font-medium">{totalItems}</span> resultados
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          leftIcon={<ChevronLeft size={14} />}
        >
          Anterior
        </Button>
        <span className="text-xs text-neutral-500 dark:text-slate-400 px-2">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          rightIcon={<ChevronRight size={14} />}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}