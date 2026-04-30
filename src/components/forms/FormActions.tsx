import { cn } from "@/utils/cn";
import { Button } from "@/components/ui";

interface FormActionsProps {
  onCancel?:      () => void;
  submitLabel?:   string;
  cancelLabel?:   string;
  loading?:       boolean;
  className?:     string;
  align?:         "left" | "right";
}

export function FormActions({
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  loading     = false,
  className,
  align       = "right",
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-4 border-t border-neutral-200",
        align === "right" ? "justify-end" : "justify-start",
        className
      )}
    >
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </div>
  );
}