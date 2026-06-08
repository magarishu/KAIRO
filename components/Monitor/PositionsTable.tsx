"use client";

import { memo, useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Zustand Store
const usePositions = () => {
  const [positions, setPositions] = useState([
    { id: "1", symbol: "EURUSD", direction: "Long", size: "3.0", pnl: 240.50, account: "Apex_Fund_01" },
    { id: "2", symbol: "NQ", direction: "Short", size: "1.0", pnl: -125.00, account: "Tradovate" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(p => ({
        ...p,
        pnl: p.pnl + (Math.random() * 10 - 5)
      })));
    }, 500); // 500ms updates to simulate WS
    return () => clearInterval(interval);
  }, []);

  return positions;
};

const PositionRow = memo(({ position }: { position: any }) => {
  const isProfit = position.pnl >= 0;
  
  return (
    <div className="flex items-center gap-4 p-4 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface-hover)] transition-colors">
      <div className="w-1/4 font-bold text-white">{position.symbol}</div>
      <div className="w-1/4">
        <span className={cn(
          "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
          position.direction === "Long" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        )}>
          {position.direction}
        </span>
      </div>
      <div className="w-1/4 font-medium text-[var(--color-text-secondary)]">{position.size} {position.symbol === "NQ" ? "Contracts" : "Lots"}</div>
      <div className={cn(
        "w-1/4 text-right font-mono font-bold text-lg",
        isProfit ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" : "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]"
      )}>
        {isProfit ? "+" : "-"}${Math.abs(position.pnl).toFixed(2)}
      </div>
    </div>
  );
});
PositionRow.displayName = "PositionRow";

export function PositionsTable() {
  const positions = usePositions();

  return (
    <div className="glass-panel rounded-2xl border-[var(--color-border-active)] overflow-hidden h-full flex flex-col min-h-[300px]">
      <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-bg-surface)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-brand-primary)]/10 rounded-lg border border-[var(--color-brand-primary)]/20">
            <Activity className="w-5 h-5 text-[var(--color-brand-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Positions</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">Aggregated from all active followers via WebSocket</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 tracking-wider">LIVE STREAM</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-main)]">
          <div className="w-1/4 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Symbol</div>
          <div className="w-1/4 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Net Direction</div>
          <div className="w-1/4 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Aggregate Size</div>
          <div className="w-1/4 text-right text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Floating PnL</div>
        </div>
        
        <div className="px-2 pb-2">
          {positions.map(p => (
            <PositionRow key={p.id} position={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
