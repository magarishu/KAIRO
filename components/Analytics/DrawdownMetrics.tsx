import { Wallet, TrendingDown, Percent, DollarSign } from "lucide-react";

export function DrawdownMetrics() {
  const metrics = [
    { label: "Total Equity", value: "$52,450.00", icon: Wallet, color: "text-[var(--color-brand-primary)]", bg: "bg-[var(--color-brand-primary)]/10", border: "border-[var(--color-brand-primary)]/20" },
    { label: "Margin Used", value: "12.4%", icon: Percent, color: "text-[var(--color-brand-secondary)]", bg: "bg-[var(--color-brand-secondary)]/10", border: "border-[var(--color-brand-secondary)]/20" },
    { label: "Float PnL", value: "+$400.00", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Current Drawdown", value: "-1.2%", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-5 hover:bg-[var(--color-bg-surface-hover)] transition-all border-[var(--color-border-active)] group hover:border-[var(--color-border-subtle)]">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${m.bg} border ${m.border} group-hover:scale-110 transition-transform duration-300`}>
            <m.icon className={`w-7 h-7 ${m.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{m.label}</p>
            <h3 className="text-2xl font-black text-white tracking-wide">{m.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
