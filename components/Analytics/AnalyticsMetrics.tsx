import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function AnalyticsMetrics({ connection }: { connection?: any }) {
  const equity = connection?.equity ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(connection.equity) : '$0.00';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Total Equity / P&L (No historical data, so show current equity) */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all duration-500"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Current Equity</p>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-white font-mono uppercase tracking-widest">Live</span>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight relative z-10">{equity}</h3>
        <div className="mt-4 w-full h-1 bg-purple-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 w-full shadow-[0_0_15px_rgba(168,85,247,0.8)] rounded-full"></div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 shadow-2xl">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Win Rate</p>
          <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">No trades yet</p>
        </div>
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <h3 className="text-3xl font-black text-[#888888] tracking-tight">0.0%</h3>
          <Minus className="w-5 h-5 text-[#888888]" />
        </div>
        <div className="flex items-center gap-1.5 relative z-10">
          <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
          <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
          <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
          <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
          <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Profit Factor */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 shadow-2xl">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Profit Factor</p>
          <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">Target: 2.0</p>
        </div>
        <h3 className="text-3xl font-black text-[#888888] mb-2 tracking-tight">0.00</h3>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Need more trade history</p>
      </div>

      {/* Risk Profile */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 shadow-2xl">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Risk Profile</p>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
          </div>
        </div>
        <h3 className="text-3xl font-black text-[#888888] mb-2 tracking-tight">Unknown</h3>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Max Drawdown: 0.0%</p>
      </div>

    </div>
  );
}
