"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let savedTheme: string | null = null;

    try {
      savedTheme = sessionStorage.getItem("theme");
    } catch {
      // Use the system preference when browser storage is unavailable.
    }

    const useDarkTheme = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    root.classList.toggle("dark", useDarkTheme);
    root.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      sessionStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      sessionStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`size-9 rounded-md border border-border/50 bg-white/60 text-foreground transition-all hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 ${className ?? ""}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <Moon className="size-4 text-slate-700 transition-transform duration-200 dark:hidden" />
      <Sun className="hidden size-4 text-amber-400 transition-transform duration-200 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
