"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open:           boolean;
  onClose:        () => void;
  onConfirm:      () => void;
  title:          string;
  description:    string;
  confirmLabel?:  string;
  cancelLabel?:   string;
  variant?:       "danger" | "primary";
  loading?:       boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel  = "Cancelar",
  variant      = "danger",
  loading      = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center">
          <AlertTriangle size={22} className="text-danger" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}