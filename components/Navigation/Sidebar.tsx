"use client";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Link as LinkIcon, Users, Shield, BarChart2, Settings, X, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/ui";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/Dashboard/ThemeToggle";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/dashboard" },
  { icon: LinkIcon, label: "CONNECTIONS", href: "/connections" },
  { icon: Users, label: "GROUPS", href: "/groups" },
  { icon: Shield, label: "RISK MANAGER", href: "/risk" },
  { icon: BarChart2, label: "ANALYTICS", href: "/analytics" },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar, isSidebarMinimized, toggleSidebarMinimized } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      <aside className={cn(
        "border-r border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col shrink-0",
        "fixed inset-y-0 left-0 z-50 h-[100dvh] shadow-[10px_0_30px_rgba(0,0,0,0.5)] lg:shadow-none lg:static transition-all duration-300 ease-out overflow-hidden relative",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isSidebarMinimized ? "w-20" : "w-72 lg:w-64"
      )}>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className={cn(
          "h-20 flex items-center border-b border-white/5 shrink-0 relative z-10",
          isSidebarMinimized ? "justify-center" : "justify-between px-6"
        )}>
          {!isSidebarMinimized && (
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              Kairo
            </h1>
          )}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebarMinimized} 
              className="hidden lg:flex p-2 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
            >
              {isSidebarMinimized ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <button 
              onClick={closeSidebar} 
              className="lg:hidden p-2 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      
        <nav className="flex-1 overflow-y-auto py-8 space-y-2 overflow-x-hidden relative z-10 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <div key={item.label} className="px-4">
                <Link
                  href={item.href}
                  onClick={() => closeSidebar()}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest transition-all duration-300 group whitespace-nowrap",
                    isActive 
                      ? "text-white bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                      : "text-[#888888] hover:text-white hover:bg-white/5 border border-transparent",
                    isSidebarMinimized && "justify-center px-0 shadow-none border-none bg-transparent hover:bg-white/5",
                    isActive && isSidebarMinimized && "bg-purple-500/10 text-purple-400"
                  )}
                  title={isSidebarMinimized ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors",
                    isActive && !isSidebarMinimized ? "text-purple-400" : "group-hover:text-white",
                    isActive && isSidebarMinimized ? "text-purple-400" : ""
                  )} />
                  {!isSidebarMinimized && <span className="mt-0.5">{item.label}</span>}
                </Link>
              </div>
            );
          })}
        </nav>
      
        <div className="px-4 pb-8 pt-6 border-t border-white/5 shrink-0 flex flex-col gap-2 overflow-x-hidden relative z-10">
          <ThemeToggle isMinimized={isSidebarMinimized} />
          <Link
            href="/settings"
            onClick={() => closeSidebar()}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest transition-all duration-300 group whitespace-nowrap",
              pathname === "/settings" 
                ? "text-white bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                : "text-[#888888] hover:text-white hover:bg-white/5 border border-transparent",
              isSidebarMinimized && "justify-center px-0 shadow-none border-none bg-transparent hover:bg-white/5",
              pathname === "/settings" && isSidebarMinimized && "bg-purple-500/10 text-purple-400"
            )}
            title={isSidebarMinimized ? "SETTINGS" : undefined}
          >
            <Settings className={cn("w-[18px] h-[18px] shrink-0 transition-colors", pathname === "/settings" ? "text-purple-400" : "group-hover:text-white")} />
            {!isSidebarMinimized && <span className="mt-0.5">SETTINGS</span>}
          </Link>
          <button 
            onClick={() => signOut({ redirectUrl: '/sign-in' })}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest transition-all duration-300 group whitespace-nowrap text-[#888888] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 w-full mt-2",
              isSidebarMinimized && "justify-center px-0 shadow-none border-none bg-transparent hover:bg-red-500/10 hover:border-transparent"
            )}
            title={isSidebarMinimized ? "SIGN OUT" : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-red-400" />
            {!isSidebarMinimized && <span className="mt-0.5">SIGN OUT</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
