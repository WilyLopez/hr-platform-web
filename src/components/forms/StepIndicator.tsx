import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps:   Step[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <nav aria-label="Pasos" className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const pending = i > current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                  done    && "bg-brand border-brand text-white",
                  active  && "bg-white border-brand text-brand",
                  pending && "bg-white border-neutral-300 text-neutral-400"
                )}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 font-medium whitespace-nowrap",
                  active  ? "text-brand"       : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16 mx-2 mb-5 transition-colors",
                  i < current ? "bg-brand" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}