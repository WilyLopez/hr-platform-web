"use client";

import { useToastStore } from "@/hooks/useToast";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export function Toaster() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        let Icon = Info;
        let bgColor = "bg-slate-900";
        let borderColor = "border-slate-800";
        let textColor = "text-white";

        if (toast.variant === "success") {
          Icon = CheckCircle;
          bgColor = "bg-green-500/10";
          borderColor = "border-green-500/20";
          textColor = "text-green-500";
        } else if (toast.variant === "error") {
          Icon = AlertCircle;
          bgColor = "bg-red-500/10";
          borderColor = "border-red-500/20";
          textColor = "text-red-500";
        } else if (toast.variant === "warning") {
          Icon = AlertTriangle;
          bgColor = "bg-amber-500/10";
          borderColor = "border-amber-500/20";
          textColor = "text-amber-500";
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-slide-up ${bgColor} ${borderColor}`}
          >
            <Icon className={`shrink-0 mt-0.5 ${textColor}`} size={20} />
            <div className="flex-1 text-sm font-medium text-slate-100">
              {toast.message}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
