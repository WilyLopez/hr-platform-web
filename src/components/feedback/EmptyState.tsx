import { cn } from "@/utils/cn";
import { Button } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?:        LucideIcon;
  title:        string;
  description?: string;
  action?:      { label: string; onClick: () => void };
  className?:   string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-neutral-400" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <Button size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}