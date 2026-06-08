import { Terminal } from "lucide-react";

export function SlippageTable() {
  const logs = [
    { id: 1, masterTime: "10:45:12.304", followerTime: "10:45:12.316", latency: "12ms", slippage: "0.0", pair: "EURUSD", status: "Success" },
    { id: 2, masterTime: "10:46:05.101", followerTime: "10:46:05.131", latency: "30ms", slippage: "-0.2", pair: "NQ", status: "Warning" },
    { id: 3, masterTime: "10:48:22.050", followerTime: "10:48:22.058", latency: "8ms", slippage: "0.0", pair: "XAUUSD", status: "Success" },
  ];

  return (
    <div className="glass-panel rounded-2xl border-[var(--color-border-active)] overflow-hidden h-full">
      <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-bg-surface)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-brand-secondary)]/10 rounded-lg border border-[var(--color-brand-secondary)]/20">
            <Terminal className="w-5 h-5 text-[var(--color-brand-secondary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Execution Audit Log</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">Millisecond-precision synchronization trace</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase text-[var(--color-text-secondary)] bg-[var(--color-bg-main)]">
            <tr>
              <th className="px-6 py-3 font-bold tracking-widest border-b border-[var(--color-border-subtle)]">Asset</th>
              <th className="px-6 py-3 font-bold tracking-widest border-b border-[var(--color-border-subtle)]">Master Exec</th>
              <th className="px-6 py-3 font-bold tracking-widest border-b border-[var(--color-border-subtle)]">Follower Exec</th>
              <th className="px-6 py-3 font-bold tracking-widest border-b border-[var(--color-border-subtle)]">Net Delta</th>
              <th className="px-6 py-3 font-bold tracking-widest border-b border-[var(--color-border-subtle)]">Slippage</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface-hover)] transition-colors font-mono">
                <td className="px-6 py-4 font-bold text-white">{log.pair}</td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{log.masterTime}</td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{log.followerTime}</td>
                <td className="px-6 py-4 text-[var(--color-brand-primary)] font-bold">{log.latency}</td>
                <td className={`px-6 py-4 font-bold ${log.slippage === "0.0" ? "text-emerald-400" : "text-red-400"}`}>{log.slippage} ticks</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
