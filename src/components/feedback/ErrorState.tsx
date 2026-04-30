import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorStateProps {
  title?:   string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title   = "Ocurrió un error",
  message = "No se pudo cargar la información. Por favor intenta de nuevo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-danger" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}