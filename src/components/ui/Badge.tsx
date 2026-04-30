import { cn } from "@/utils/cn";

type Variant = "success" | "warning" | "danger" | "neutral" | "brand" | "info";

interface BadgeProps {
  variant?:  Variant;
  children:  React.ReactNode;
  className?: string;
  dot?:      boolean;
}

const variants: Record<Variant, string> = {
  success: "bg-success-light text-success-dark",
  warning: "bg-warning-light text-warning-dark",
  danger:  "bg-danger-light  text-danger-dark",
  neutral: "bg-neutral-100   text-neutral-600",
  brand:   "bg-brand-pale    text-brand-dark",
  info:    "bg-blue-50       text-blue-700",
};

const dots: Record<Variant, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  neutral: "bg-neutral-400",
  brand:   "bg-brand",
  info:    "bg-blue-500",
};

export function Badge({ variant = "neutral", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
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