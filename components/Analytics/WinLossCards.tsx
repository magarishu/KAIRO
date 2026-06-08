import { TrendingUp, TrendingDown } from "lucide-react";

export function WinLossCards() {
  return (
    <div className="grid grid-cols-2 gap-6">
      
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all duration-500"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Largest Win</p>
          <TrendingUp className="w-4 h-4 text-emerald-500 opacity-80" />
        </div>
        <h3 className="text-3xl font-black text-[#888888] mb-2 tracking-tight relative z-10">$0.00</h3>
        <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase relative z-10">No trades recorded</p>
      </div>

      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-rose-500/20 transition-all duration-500"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Largest Loss</p>
          <TrendingDown className="w-4 h-4 text-rose-500 opacity-80" />
        </div>
        <h3 className="text-3xl font-black text-[#888888] mb-2 tracking-tight relative z-10">$0.00</h3>
        <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase relative z-10">No trades recorded</p>
      </div>

    </div>
  );
}
