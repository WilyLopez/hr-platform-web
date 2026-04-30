import { cn } from "@/utils/cn";
import { formatInitials } from "@/utils/format";

type Size = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  name:       string;
  src?:       string | null;
  size?:      Size;
  className?: string;
}

const sizes: Record<Size, string> = {
  xs: "w-6  h-6  text-xs",
  sm: "w-8  h-8  text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium flex-shrink-0",
        "bg-brand-pale text-brand-dark select-none",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        formatInitials(name)
      )}
    </div>
  );
}