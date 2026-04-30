import { cn } from "@/utils/cn";

type Size = "xs" | "sm" | "md" | "lg";

interface SpinnerProps {
  size?:      Size;
  className?: string;
}

const sizes: Record<Size, string> = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizes[size],
        className
      )}
    />
  );
}