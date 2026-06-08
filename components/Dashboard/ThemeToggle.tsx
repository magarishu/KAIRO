"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  isMinimized?: boolean;
}

export function ThemeToggle({ isMinimized }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("kairo-theme");
    if (theme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("kairo-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("kairo-theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) return <div className="h-[42px] w-full" />;

  return (
    <button 
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest transition-all duration-300 group whitespace-nowrap text-[#888888] hover:text-white hover:bg-white/5 border border-transparent w-full",
        isMinimized && "justify-center px-0 shadow-none border-none bg-transparent hover:bg-white/5 hover:border-transparent"
      )}
      title={isMinimized ? (isDark ? "LIGHT MODE" : "DARK MODE") : undefined}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-white" />
      ) : (
        <Moon className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-white" />
      )}
      {!isMinimized && <span className="mt-0.5">{isDark ? "LIGHT MODE" : "DARK MODE"}</span>}
    </button>
  );
}
