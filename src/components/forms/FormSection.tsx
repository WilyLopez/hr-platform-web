import { cn } from "@/utils/cn";
import { Divider } from "@/components/ui";

interface FormSectionProps {
  title:        string;
  description?: string;
  children:     React.ReactNode;
  className?:   string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className="text-sm font-semibold text-neutral-800">{title}</h4>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}