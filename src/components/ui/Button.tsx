"use client";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark border-transparent",
  secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-transparent",
  danger:    "bg-danger text-white hover:bg-danger-dark border-transparent",
  ghost:     "bg-transparent text-neutral-600 hover:bg-neutral-100 border-transparent",
  outline:   "bg-white text-brand border-brand hover:bg-brand-pale",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-3 text-xs gap-1.5",
  md: "h-9  px-4 text-sm gap-2",
  lg: "h-11 px-6 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md border",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-brand/40 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";