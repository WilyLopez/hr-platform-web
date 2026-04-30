"use client";
import { useEffect } from "react";
import { cn } from "@/utils/cn";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast as ToastType, ToastVariant } from "@/hooks/useToast";
import { useToastStore } from "@/hooks/useToast";

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle   size={18} className="text-success" />,
  error:   <XCircle       size={18} className="text-danger"  />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info:    <Info          size={18} className="text-brand"   />,
};

const borders: Record<ToastVariant, string> = {
  success: "border-l-success",
  error:   "border-l-danger",
  warning: "border-l-warning",
  info:    "border-l-brand",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const remove = useToastStore((s) => s.remove);
  return (
    <div
      className={cn(
        "flex items-start gap-3 bg-white border border-neutral-200 border-l-4 rounded-lg",
        "shadow-dropdown px-4 py-3 min-w-72 max-w-sm animate-slide-down",
        borders[toast.variant]
      )}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[toast.variant]}</span>
      <p className="flex-1 text-sm text-neutral-700">{toast.message}</p>
      <button
        onClick={() => remove(toast.id)}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}