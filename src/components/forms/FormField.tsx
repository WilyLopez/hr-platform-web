import { cn } from "@/utils/cn";

interface FormFieldProps {
  label:       string;
  error?:      string;
  hint?:       string;
  required?:   boolean;
  children:    React.ReactNode;
  className?:  string;
}

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <label className="form-label">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  );
}