"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Group } from "@/types/group";
import { Rocket, Zap, Shield } from "lucide-react";

interface GroupContextType {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  refreshGroups: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

import { getGroups, seedInitialData } from "@/app/actions/groups";
import { useUser } from "@clerk/nextjs";

// Helper to map Prisma icon string to Lucide component
const getIcon = (name: string | null) => {
  if (name === "Zap") return Zap;
  if (name === "Shield") return Shield;
  return Rocket;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isLoaded, isSignedIn } = useUser();

  const refreshGroups = () => setRefreshTrigger(prev => prev + 1);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function loadGroups() {
      try {
        let dbGroups = await getGroups();

        const formattedGroups: Group[] = dbGroups.map((g: any) => {
          const totalBalance = g.slaves.reduce((acc: number, s: any) => acc + s.balance, 0);
          const totalPnl = g.slaves.reduce((acc: number, s: any) => acc + s.pnl, 0);

          return {
            id: g.id,
            name: g.name,
            accountId: g.accountId,
            subtitle: g.subtitle || "",
            icon: getIcon(g.icon),
            iconColor: g.iconColor || "text-blue-400",
            iconBg: g.iconBg || "bg-blue-900/40 border-blue-800",
            accountsCount: g.slaves.length,
            balance: formatCurrency(totalBalance),
            pnl: (totalPnl >= 0 ? "+" : "") + formatCurrency(totalPnl),
            pnlColor: totalPnl >= 0 ? "text-emerald-400" : "text-rose-400",
            status: g.status,
            slaves: g.slaves.map((s: any) => ({
              id: s.id,
              name: s.name,
              accountId: s.accountId,
              broker: s.broker,
              status: s.status,
              balance: formatCurrency(s.balance),
              pnl: (s.pnl >= 0 ? "+" : "") + formatCurrency(s.pnl),
              pnlColor: s.pnl >= 0 ? "text-emerald-400" : "text-rose-400",
              multiplier: s.multiplier,
              copySl: s.copySl,
              copyTp: s.copyTp,
            }))
          };
        });

        setGroups(formattedGroups);
      } catch (error) {
        console.error("Failed to load groups:", error);
      }
    }
    loadGroups();
  }, [isLoaded, isSignedIn, refreshTrigger]);

  return (
    <GroupContext.Provider value={{ groups, setGroups, refreshGroups }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
}
