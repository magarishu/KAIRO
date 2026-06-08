"use client";

import { CheckCircle2, XCircle, XSquare } from "lucide-react";
import { useState } from "react";
import { useGroups } from "@/context/GroupContext";

export function SlavePerformanceTable({ groupName }: { groupName?: string }) {
  const { groups } = useGroups();
  
  let slavesToShow: any[] = [];
  if (!groupName || groupName === "All Groups") {
    slavesToShow = groups.flatMap(g => g.slaves);
  } else {
    const selectedGroup = groups.find(g => g.name === groupName);
    if (selectedGroup) {
      slavesToShow = selectedGroup.slaves;
    }
  }

  const getStatusStyle = (status: string) => {
    if (status === "SYNCED") return { color: "text-emerald-500", dot: "bg-emerald-500" };
    if (status === "PAUSED") return { color: "text-amber-500", dot: "bg-amber-500" };
    if (status === "ERROR") return { color: "text-rose-500", dot: "bg-rose-500" };
    return { color: "text-gray-500", dot: "bg-gray-500" };
  };

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">Slave Accounts Performance</h2>
      </div>
      <div className="w-full overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
              <th className="p-5 w-[25%]">ACCOUNT</th>
              <th className="p-5 w-[20%]">BROKER</th>
              <th className="p-5 w-[20%]">DAILY P&L</th>
              <th className="p-5 w-[20%]">WIN RATE</th>
              <th className="p-5 w-[20%]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {slavesToShow.length > 0 ? (
              slavesToShow.map((acc, i) => {
                const { color: statusColor, dot } = getStatusStyle(acc.status);
                return (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="p-5">
                      <p className="text-[11px] font-bold text-[#E5E5E5] uppercase tracking-widest">{acc.name}</p>
                      <p className="text-[10px] text-[#888888] font-mono mt-1">{acc.accountId}</p>
                    </td>
                    <td className="p-5 text-[11px] font-bold text-[#888888] font-mono uppercase tracking-widest">{acc.broker === 'MetaTrader 5' ? 'MT5' : acc.broker}</td>
                    <td className={`p-5 text-[11px] font-black font-mono tracking-widest ${acc.pnlColor || "text-emerald-500"}`}>{acc.pnl || "$0.00"}</td>
                    <td className="p-5 text-[11px] font-bold text-[#888888] font-mono tracking-widest">{acc.winRate || "N/A"}</td>
                    <td className="p-5 text-xs font-mono font-bold tracking-widest uppercase">
                      <div className={`flex items-center gap-2 ${statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
                        {acc.status}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 text-xs">
                  No slave accounts found for this group.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TradeHistoryTable() {
  const [page, setPage] = useState(1);

  const trades: any[] = [];

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden mt-6 shadow-2xl relative">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">Trade History</h2>
      </div>
      <div className="w-full overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
              <th className="p-5">ID</th>
              <th className="p-5">DATE/TIME</th>
              <th className="p-5">ASSET</th>
              <th className="p-5">DIRECTION</th>
              <th className="p-5">ENTRY/EXIT</th>
              <th className="p-5">P&L ($)</th>
              <th className="p-5">OUTCOME</th>
            </tr>
          </thead>
          <tbody className={page > 1 ? 'opacity-50 animate-pulse' : ''}>
            {trades.length > 0 ? (
              trades.map((tx, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="p-5 text-[11px] text-[#888888] font-mono whitespace-pre-line leading-relaxed tracking-widest">{tx.id}</td>
                  <td className="p-5 text-[11px] text-[#888888] font-mono whitespace-pre-line leading-relaxed tracking-widest">{tx.date}</td>
                  <td className="p-5 text-[11px] text-[#E5E5E5] font-bold font-mono tracking-widest">
                    <div className="flex items-center gap-2">
                      {tx.asset}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider font-mono uppercase border ${tx.dirClass.replace('bg-', 'border-').replace('/10', '/30')} ${tx.dirClass}`}>
                      {tx.dir}
                    </span>
                  </td>
                  <td className="p-5 text-[11px] text-[#888888] font-mono whitespace-pre-line leading-relaxed tracking-widest">{tx.entry}</td>
                  <td className={`p-5 text-[11px] font-black font-mono tracking-widest ${tx.pnlColor}`}>{tx.pnl}</td>
                  <td className="p-5">
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase ${tx.outcomeColor}`}>
                      <tx.outcomeIcon className="w-3.5 h-3.5" />
                      <span className="whitespace-pre-line leading-tight font-medium">{tx.outcome}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 text-xs">
                  No trades recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Pagination */}
      <div className="p-5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
        <span className="text-[10px] text-[#888888] font-bold font-mono uppercase tracking-widest">
          Showing 0-0 of 0 trades
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={true}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            disabled={true}
            onClick={() => setPage(p => Math.min(13, p + 1))}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
