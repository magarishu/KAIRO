"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme on mount
    const checkTheme = () => {
      const theme = localStorage.getItem("kairo-theme");
      if (theme === "light") {
        setIsDark(false);
        document.documentElement.classList.add("light-mode");
      } else {
        setIsDark(true);
        document.documentElement.classList.remove("light-mode");
      }
    };

    checkTheme();

    // Listen for storage changes in case it's toggled from another tab or component
    window.addEventListener("storage", (e) => {
      if (e.key === "kairo-theme") {
        checkTheme();
      }
    });

    // We also need to listen for a custom event since localStorage changes in the SAME window don't trigger the "storage" event
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isLight = document.documentElement.classList.contains("light-mode");
          setIsDark(!isLight);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {mounted && !isDark && (
        <style dangerouslySetInnerHTML={{__html: `
          /* Layout Background */
          html.light-mode [class*="bg-[#050505]"],
          html.light-mode [class*="bg-[#05010D]"] { background-color: #f8fafc !important; }
          html.light-mode [class*="radial-gradient"] { opacity: 0 !important; }
          
          /* Cards and Panels */
          html.light-mode [class*="bg-[#0A0A0A]"],
          html.light-mode [class*="bg-black/40"] { background-color: #ffffff !important; }
          
          /* Inner containers and hover states */
          html.light-mode [class*="bg-[#111113]"],
          html.light-mode [class*="bg-[#161618]"],
          html.light-mode [class*="hover:bg-[#111113]"]:hover { background-color: #f3f4f6 !important; }
          
          /* Text */
          html.light-mode [class*="text-white"],
          html.light-mode [class*="text-transparent"] { color: #000000 !important; background-image: none !important; background-clip: initial !important; -webkit-background-clip: initial !important; }
          
          html.light-mode [class*="text-[#888888]"],
          html.light-mode [class*="text-[#A3A3A3]"],
          html.light-mode [class*="text-gray-500"],
          html.light-mode [class*="text-gray-400"] { color: #6b7280 !important; }
          
          html.light-mode [class*="text-[#E5E5E5]"] { color: #374151 !important; }
          
          /* Borders and subtle backgrounds */
          html.light-mode [class*="border-white/5"] { border-color: rgba(0, 0, 0, 0.05) !important; }
          html.light-mode [class*="border-white/10"] { border-color: rgba(0, 0, 0, 0.1) !important; }
          html.light-mode [class*="border-[#2C2C2E]"] { border-color: rgba(0, 0, 0, 0.1) !important; }
          
          html.light-mode [class*="bg-white/5"] { background-color: rgba(0, 0, 0, 0.03) !important; }
          html.light-mode [class*="hover:bg-white/10"]:hover { background-color: rgba(0, 0, 0, 0.08) !important; }
          html.light-mode [class*="bg-white/[0.02]"],
          html.light-mode [class*="bg-white/[0.01]"] { background-color: rgba(0, 0, 0, 0.02) !important; }
          html.light-mode [class*="hover:bg-white/[0.03]"]:hover,
          html.light-mode [class*="hover:bg-white/[0.02]"]:hover { background-color: rgba(0, 0, 0, 0.04) !important; }
          
          /* Fix specific text overrides */
          html.light-mode [class*="group-hover:text-white"]:hover { color: #111827 !important; }
        `}} />
      )}
      {children}
    </>
  );
}
