"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Dropdown, DropdownTriggerDots } from "./Dropdown";
import { Button } from "./Button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevenir FOUC (hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />
    );
  }

  const items = [
    {
      label: "Claro",
      icon: Sun,
      onClick: () => setTheme("light"),
    },
    {
      label: "Oscuro",
      icon: Moon,
      onClick: () => setTheme("dark"),
    },
    {
      label: "Sistema",
      icon: Monitor,
      onClick: () => setTheme("system"),
    },
  ];

  return (
    <Dropdown 
      items={items} 
      align="right"
      trigger={
        <button className="relative flex items-center justify-center text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-muted transition-colors">
          {theme === "dark" ? (
            <Moon size={18} />
          ) : theme === "light" ? (
            <Sun size={18} />
          ) : (
            <Monitor size={18} />
          )}
        </button>
      }
    />
  );
}
