import { cn } from "@/lib/utils";

export type Platform = "MT4" | "MT5" | "TRADOVATE" | "RITHMIC";

interface PlatformSelectorProps {
  selected: Platform | null;
  onSelect: (p: Platform) => void;
}

const platforms: { id: Platform; name: string; type: "Forex" | "Futures" }[] = [
  { id: "MT4", name: "MetaTrader 4", type: "Forex" },
  { id: "MT5", name: "MT5", type: "Forex" },
  { id: "TRADOVATE", name: "Tradovate", type: "Futures" },
  { id: "RITHMIC", name: "Rithmic", type: "Futures" },
];

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {platforms.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={cn(
            "p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300",
            selected === p.id 
              ? "bg-[var(--color-brand-primary)]/10 border-[var(--color-brand-primary)] shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
              : "bg-[var(--color-bg-surface-hover)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-bg-surface)]"
          )}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{p.type}</span>
          <span className={cn(
            "font-semibold",
            selected === p.id ? "text-[var(--color-brand-primary)]" : "text-white"
          )}>{p.name}</span>
        </button>
      ))}
    </div>
  );
}
