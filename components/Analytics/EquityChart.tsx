"use client";
import { useState } from "react";
import { LineChart } from "lucide-react";

export function EquityChart({ connection }: { connection?: any }) {
  const [activeTab, setActiveTab] = useState<"7D" | "1M" | "ALL">("1M");

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col relative overflow-hidden shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Header & Toggles */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-sm font-bold text-white">Equity Growth</h2>
        <div className="flex bg-[#111113] border border-white/10 rounded-md p-1 opacity-50 pointer-events-none">
          {(["7D", "1M", "ALL"] as const).map(tab => (
            <button
              key={tab}
              className={`px-4 py-1 text-[10px] tracking-widest font-mono font-bold rounded-sm transition-colors uppercase ${
                activeTab === tab 
                  ? "bg-white/10 text-white" 
                  : "text-[#888888]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State SVG Area */}
      <div className="flex-1 w-full relative flex flex-col items-center justify-center text-[#888888] animate-in fade-in duration-500">
        <LineChart className="w-12 h-12 mb-4 opacity-20 text-white" />
        <p className="text-[11px] font-bold tracking-widest font-mono uppercase">No historical equity data yet.</p>
        <p className="text-[10px] mt-1 opacity-50 font-mono uppercase tracking-widest">Data will populate as Kairo tracks daily equity.</p>
      </div>

    </div>
  );
}
