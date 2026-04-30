"use client";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  options:      SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "form-input appearance-none pr-9",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            size={16}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        {hint && !error && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";