"use client";
import { useState } from "react";
import { ChevronDown, ArrowRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetupRowProps {
  master: string;
  follower: string;
  brokerMaster: string;
  brokerFollower: string;
  defaultMode?: string;
}

export function SetupRow({ master, follower, brokerMaster, brokerFollower, defaultMode = "Multiplier" }: SetupRowProps) {
  const [active, setActive] = useState(true);

  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border transition-all duration-300",
      active 
        ? "bg-[var(--color-bg-surface-hover)] border-[var(--color-border-active)]" 
        : "bg-[var(--color-bg-main)] border-[var(--color-border-subtle)] opacity-70"
    )}>
      {/* Master */}
      <div className="w-full md:flex-1 flex items-center gap-3 bg-[var(--color-bg-main)] md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none">
        <div className="w-8 h-8 rounded bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/30 flex items-center justify-center text-[var(--color-brand-primary)] font-bold text-xs shadow-[0_0_10px_rgba(0,240,255,0.1)] shrink-0">
          M
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">{master}</p>
          <p className="text-xs text-[var(--color-text-secondary)] truncate">{brokerMaster}</p>
        </div>
      </div>

      <ArrowRight className="hidden md:block w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />

      {/* Follower */}
      <div className="w-full md:flex-1 flex items-center gap-3 bg-[var(--color-bg-main)] md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none">
        <div className="w-8 h-8 rounded bg-[var(--color-brand-secondary)]/10 border border-[var(--color-brand-secondary)]/30 flex items-center justify-center text-[var(--color-brand-secondary)] font-bold text-xs shadow-[0_0_10px_rgba(112,0,255,0.1)] shrink-0">
          F
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">{follower}</p>
          <p className="text-xs text-[var(--color-text-secondary)] truncate">{brokerFollower}</p>
        </div>
      </div>

      {/* Controls Wrapper for Mobile */}
      <div className="flex w-full md:w-auto items-center gap-4 md:contents">
        {/* Risk Mode */}
        <div className="flex-1">
        <div className="bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:border-[var(--color-brand-primary)] transition-all">
          <span className="text-sm text-white font-medium">{defaultMode} <span className="text-[var(--color-brand-primary)] font-bold ml-1">1.5x</span></span>
          <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>
      </div>

      {/* Max Slippage */}
      <div className="w-32 relative">
        <input 
          type="number" 
          defaultValue={3} 
          className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-2 pl-3 pr-8 text-sm text-white font-medium focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] font-medium">ticks</span>
      </div>

      {/* Active Toggle */}
      <button 
        onClick={() => setActive(!active)}
        className={cn(
          "w-12 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
          active 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
            : "bg-[var(--color-bg-main)] text-[var(--color-text-secondary)] border border-[var(--color-border-active)] hover:bg-[var(--color-bg-surface)] hover:text-white"
        )}
      >
        {active ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
      </button>
      </div>
    </div>
  );
}
