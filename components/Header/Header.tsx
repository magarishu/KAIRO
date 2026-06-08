"use client";

import { Menu, Bell, User } from "lucide-react";
import { useUIStore } from "@/store/ui";

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 border-b border-[#2C2C2E] bg-[#161618] backdrop-blur-lg flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shrink-0">
      
      {/* Mobile Menu Toggle */}
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
