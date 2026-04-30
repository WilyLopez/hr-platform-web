import { cn } from "@/utils/cn";

interface DividerProps {
  label?:     string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 border-t border-neutral-200" />
        <span className="text-xs text-neutral-400 font-medium">{label}</span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>
    );
  }
  return <hr className={cn("border-neutral-200", className)} />;
}