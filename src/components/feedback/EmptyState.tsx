import { cn } from "@/utils/cn";
import { Button } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?:        LucideIcon;
  image?:       string;
  title:        string;
  description?: string;
  action?:      { label: string; onClick: () => void };
  className?:   string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  image,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in",
        className
      )}
    >
      {image ? (
        <img src={image} alt="Empty state illustration" className="w-48 h-auto mb-6 opacity-80 select-none pointer-events-none" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center mb-5 shadow-sm">
          <Icon size={22} className="text-neutral-400 dark:text-neutral-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-sm">{description}</p>
      )}
      {action && (
        <Button size="sm" variant="outline" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}