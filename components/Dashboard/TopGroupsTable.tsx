"use client";

import { motion } from "framer-motion";

export function TopGroupsTable({ groups = [] }: { groups?: any[] }) {
  // Sort by total slave equity descending and take top 3
  const sortedGroups = [...groups].map(g => {
    const equity = (g.slaves || []).reduce((sum: number, s: any) => sum + (s.balance || 0), 0);
    const pnl = (g.slaves || []).reduce((sum: number, s: any) => sum + (s.pnl || 0), 0);
    return { ...g, equity, pnl };
  }).sort((a, b) => b.equity - a.equity).slice(0, 3);

  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative"
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex justify-between items-center p-6 border-b border-white/5">
        <h3 className="text-[11px] font-bold text-[#888888] tracking-widest font-mono">TOP PERFORMING GROUPS</h3>
        <button className="text-[10px] font-bold text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors uppercase tracking-widest border border-white/5">
          View All
        </button>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Group Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Equity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono text-right">Daily P&L</th>
            </tr>
          </thead>
          <tbody>
            {sortedGroups.length > 0 ? (
              sortedGroups.map((g, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors group cursor-pointer">
                  <td className="px-6 py-5 text-sm text-[#E5E5E5] font-medium group-hover:text-white transition-colors flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all" />
                    {g.name}
                  </td>
                  <td className="px-6 py-5 text-sm text-white font-mono">{formatCurrency(g.equity)}</td>
                  <td className={`px-6 py-5 text-sm font-bold text-right font-mono ${g.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {g.pnl >= 0 ? '+' : ''}{formatCurrency(g.pnl)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-sm text-center text-[#888888] font-mono">
                  NO ACTIVE GROUPS FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
