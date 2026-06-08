"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { FloatingSupport } from "@/components/Navigation/FloatingSupport";
import { GroupProvider } from "@/context/GroupContext";
import { BackgroundTexture } from "@/components/ui/BackgroundTexture";
import { ThemeProvider } from "@/components/ThemeProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const isLandingPage = pathname === "/";

  if (isAuthPage || isLandingPage) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#050505] relative">
        <BackgroundTexture />
        <div className="relative z-10 w-full h-full">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </div>
      </div>
    );
  }

  return (
    <GroupProvider>
      <div className="relative flex h-screen w-full bg-[#050505] overflow-hidden">
        <BackgroundTexture />
        <div className="relative z-10 flex w-full h-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-screen">
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </main>
          </div>
        </div>
        <FloatingSupport />
      </div>
    </GroupProvider>
  );
}
