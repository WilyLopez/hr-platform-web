"use client";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Calendar } from "lucide-react";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

/**
 * DatePicker nativo ligero utilizando `<input type="date">`.
 * Soporta de manera nativa los calendarios del sistema en iOS/Android/Desktop.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="date"
            id={inputId}
            className={cn(
              "form-input pl-9",
              // [type="date"] nativo requiere este estilo para que el icono de calendario por defecto no se superponga
              "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={16}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
