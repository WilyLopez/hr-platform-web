"use client";
import { useState } from "react";
import { cn } from "@/utils/cn";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content:    string;
  children:   React.ReactNode;
  position?:  Position;
  className?: string;
}

const positions: Record<Position, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full  left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full  top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={cn(
            "absolute z-50 whitespace-nowrap px-2 py-1 rounded text-xs font-medium",
            "bg-neutral-800 text-white shadow-dropdown animate-fade-in pointer-events-none",
            positions[position]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}