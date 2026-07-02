import { cn } from "@/utils/cn";

interface CardProps {
  children:       React.ReactNode;
  className?:     string;
  padding?:       boolean;
  overflowHidden?: boolean;
  interactive?: boolean;
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

export function Card({ children, className, padding = false, overflowHidden = false, interactive = false }: CardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm", 
        padding && "p-6", 
        overflowHidden && "overflow-hidden", 
        interactive && "transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500",
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
    <div className={cn("flex items-start justify-between gap-4 p-6 border-b border-slate-100 dark:border-slate-800", className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}