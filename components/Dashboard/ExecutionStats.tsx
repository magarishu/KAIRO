"use client";

import { motion } from "framer-motion";

export function ExecutionStats() {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <h3 className="text-[11px] font-bold text-[#888888] tracking-widest font-mono uppercase mb-4 ml-1">EXECUTION STATS</h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Trading Week Performance */}
        <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-64 flex flex-col justify-between group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono uppercase">Trading Week</p>
            <div className="text-right">
              <p className="text-[10px] text-[#888888] font-mono">TOTAL P&L</p>
              <p className="text-xl font-black text-white tracking-tight">$0</p>
            </div>
          </div>
          <div className="flex justify-between items-end h-32 mt-4 px-2 xl:px-8 relative z-10">
            {[{day: 'SUN', val: '$0', h1: 0, h2: 0}, {day: 'MON', val: '$0', h1: 0, h2: 0}, {day: 'TUE', val: '$0', h1: 0, h2: 0}, {day: 'WED', val: '$0', h1: 0, h2: 0}, {day: 'THU', val: '$0', h1: 0, h2: 0}, {day: 'FRI', val: '$0', h1: 0, h2: 0}].map(d => (
              <div key={d.day} className="flex flex-col items-center gap-2 group/bar cursor-pointer">
                <div className="flex items-end gap-[2px] h-20 w-4 justify-center">
                  <div className="w-1.5 md:w-2 bg-purple-500 rounded-t-[2px] transition-all group-hover/bar:bg-purple-400 group-hover/bar:shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{height: `${d.h1}%`}}></div>
                  <div className="w-1.5 md:w-2 bg-purple-900 rounded-t-[2px] transition-all group-hover/bar:bg-purple-800" style={{height: `${d.h2}%`}}></div>
                </div>
                <div className="text-center mt-1">
                  <p className="text-[10px] font-bold text-white font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-4 -translate-x-1/2 left-1/2">{d.val}</p>
                  <p className="text-[10px] text-[#888888] font-mono tracking-widest">{d.day}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Session Win Rates */}
        <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-64 flex flex-col justify-between group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono uppercase mb-6 relative z-10">Session Win Rates</p>
          <div className="space-y-6 flex-1 flex flex-col justify-center relative z-10">
            {[{name: 'NEW YORK', val: '0%', w: '0%', c: 'bg-blue-500'}, {name: 'LONDON', val: '0%', w: '0%', c: 'bg-indigo-500'}, {name: 'ASIA', val: '0%', w: '0%', c: 'bg-purple-500'}].map(s => (
              <div key={s.name} className="group/row">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-mono text-[#E5E5E5] tracking-widest">{s.name}</p>
                  <p className="text-[11px] font-bold font-mono text-white group-hover/row:text-blue-400 transition-colors">{s.val}</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${s.c} rounded-full transition-all duration-1000`} style={{width: s.w}}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Profitability */}
        <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-52 flex flex-col justify-between group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono uppercase">Profitability</p>
            <div className="text-right">
              <p className="text-[10px] text-[#888888] font-mono uppercase">Total Trades</p>
              <p className="text-sm font-black text-white">0</p>
            </div>
          </div>
          
          <div className="mt-4 relative z-10">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[10px] text-[#888888] font-mono mb-1 uppercase tracking-widest">Won</p>
                <p className="text-2xl font-black text-emerald-400">0%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#888888] font-mono mb-1 uppercase tracking-widest">Lost</p>
                <p className="text-2xl font-black text-rose-400">0%</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3 flex">
              <div className="h-full bg-emerald-500 rounded-l-full transition-all" style={{width: '0%'}}></div>
              <div className="h-full bg-rose-500 rounded-r-full transition-all" style={{width: '0%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[#888888] font-mono">0 TRADES</p>
              <p className="text-[10px] text-[#888888] font-mono">0 TRADES</p>
            </div>
          </div>
        </motion.div>

        {/* Most Traded Instruments */}
        <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-52 flex flex-col justify-between group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono uppercase mb-4 relative z-10">Instruments</p>
          <div className="flex justify-around items-center flex-1 mt-2 relative z-10">
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3 group/pie">
                <div className="relative w-16 h-16 rounded-full border-[3px] border-white/5 flex items-center justify-center group-hover/pie:border-white/10 transition-colors">
                  <span className="text-[10px] font-bold text-[#888888] font-mono relative z-10 group-hover/pie:text-white transition-colors">0%</span>
                </div>
                <div className="text-center mt-1">
                  <p className="text-[10px] font-bold text-[#E5E5E5] font-mono tracking-widest">---</p>
                  <p className="text-[9px] text-[#888888] font-mono">0 TRADES</p>
                </div>
              </div>
            ))}

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
