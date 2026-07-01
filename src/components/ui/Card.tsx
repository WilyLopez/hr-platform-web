import { cn } from "@/utils/cn";

interface CardProps {
  children:       React.ReactNode;
  className?:     string;
  padding?:       boolean;
  overflowHidden?: boolean;
}

interface CardHeaderProps {
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  className?:  string;
}

interface CardBodyProps {
  children:   React.ReactNode;
  className?: string;
}

export function Card({ children, className, padding = false, overflowHidden = false, interactive = false }: CardProps & { interactive?: boolean }) {
  return (
    <div 
      className={cn(
        "card", 
        padding && "p-6", 
        overflowHidden && "overflow-hidden", 
        interactive && "transition-all duration-200 hover:border-brand/40 hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        className
      )}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn("card-header flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn("card-body", className)}>
      {children}
    </div>
  );
}