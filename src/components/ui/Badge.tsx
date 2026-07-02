import { cn } from "@/utils/cn";

type Variant = "success" | "warning" | "danger" | "neutral" | "brand" | "info" | "slate";

interface BadgeProps {
  variant?:  Variant;
  children:  React.ReactNode;
  className?: string;
  dot?:      boolean;
}

const variants: Record<Variant, string> = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger:  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  brand:   "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
  info:    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  slate:   "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const dots: Record<Variant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-rose-500",
  neutral: "bg-slate-500",
  brand:   "bg-slate-900",
  info:    "bg-sky-500",
  slate:   "bg-slate-500",
};

export function Badge({ variant = "neutral", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dots[variant])} />
      )}
      {children}
    </span>
  );
}