import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  lines?:     number;
}

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "rounded-md",
        // Base fallback color for reduced motion
        "bg-neutral-200 dark:bg-neutral-800",
        // Shimmer effect (only runs if motion is safe)
        "motion-safe:bg-gradient-to-r motion-safe:from-neutral-200 motion-safe:via-neutral-100 motion-safe:to-neutral-200",
        "dark:motion-safe:from-neutral-800 dark:motion-safe:via-neutral-700 dark:motion-safe:to-neutral-800",
        "motion-safe:bg-[length:1000px_100%] motion-safe:animate-shimmer",
        className
      )}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3 }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-full w-10 h-10", className)} />;
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-64 flex items-end gap-2", className)}>
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="w-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
      ))}
    </div>
  );
}