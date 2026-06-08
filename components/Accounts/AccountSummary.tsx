import { Users, Server, Network } from "lucide-react";

export function AccountSummary() {
  const stats = [
    { label: "Master Accounts", value: "2", icon: Server, color: "text-[var(--color-brand-primary)]", bg: "bg-[var(--color-brand-primary)]/10", border: "border-[var(--color-brand-primary)]/20" },
    { label: "Slave Accounts", value: "5", icon: Users, color: "text-[var(--color-brand-secondary)]", bg: "bg-[var(--color-brand-secondary)]/10", border: "border-[var(--color-brand-secondary)]/20" },
    { label: "Total Accounts", value: "7", icon: Network, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border-[var(--color-border-active)] h-full flex flex-col justify-center">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-1 text-white">Accounts Overview</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">Summary of your linked trading accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {stats.map((m, i) => (
          <div key={i} className="bg-[var(--color-bg-main)] p-6 rounded-2xl flex flex-col items-center justify-center gap-4 border border-[var(--color-border-subtle)] hover:border-[var(--color-border-active)] transition-all group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${m.bg} border ${m.border} group-hover:scale-110 transition-transform duration-300`}>
              <m.icon className={`w-8 h-8 ${m.color}`} />
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-black text-white tracking-wide mb-1">{m.value}</h3>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{m.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
