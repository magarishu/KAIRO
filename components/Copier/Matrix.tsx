import { SetupRow } from "./SetupRow";
import { GitMerge } from "lucide-react";

export function Matrix() {
  return (
    <div className="glass-panel rounded-2xl p-6 border-[var(--color-border-active)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 text-white">Copier Matrix</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">Configure and monitor your active trade copy routes.</p>
        </div>
        <div className="p-3 bg-[var(--color-bg-surface-hover)] rounded-xl border border-[var(--color-border-subtle)]">
          <GitMerge className="w-6 h-6 text-[var(--color-brand-secondary)]" />
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 pb-3 border-b border-[var(--color-border-subtle)] mb-4">
        <div className="flex-1 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Master Source</div>
        <div className="w-5"></div>
        <div className="flex-1 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Follower Target</div>
        <div className="flex-1 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Risk Mode</div>
        <div className="w-32 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Max Slippage</div>
        <div className="w-12 text-center text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Status</div>
      </div>

      <div className="space-y-3">
        <SetupRow master="Apex_Fund_01" brokerMaster="Tradovate" follower="Prop_Follower_A" brokerFollower="Rithmic" defaultMode="Multiplier" />
        <SetupRow master="Apex_Fund_01" brokerMaster="Tradovate" follower="Personal_MT5" brokerFollower="FTMO" defaultMode="Equity-Ratio" />
      </div>
    </div>
  );
}
