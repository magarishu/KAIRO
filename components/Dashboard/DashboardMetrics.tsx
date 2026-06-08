"use client";

import { Wallet, TrendingUp, Link as LinkIcon, Users } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardMetrics({ connections = [], groups = [] }: { connections?: any[], groups?: any[] }) {
  const totalEquity = connections.reduce((acc, curr) => acc + (curr.equity || 0), 0);
  const formattedEquity = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalEquity);
  
  const activeConnections = connections.filter(c => c.status === "ONLINE").length;
  const totalConnections = connections.length;
  const connectionPercentage = totalConnections === 0 ? 0 : Math.round((activeConnections / totalConnections) * 100);

  const activeGroups = groups.filter(g => g.status === "ACTIVE").length;
  const totalGroups = groups.length;

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {/* Total Equity */}
      <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono">TOTAL EQUITY</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:border-purple-500/20 transition-all">
              <Wallet className="w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{formattedEquity}</h3>
          <p className="text-xs text-[#888888] flex items-center gap-2">
            <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider">+0.0%</span> 
            <span>vs yesterday</span>
          </p>
        </div>
      </motion.div>

      {/* Today's P&L */}
      <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono">TODAY'S P&L</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-amber-500/10 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all">
              <TrendingUp className="w-4 h-4 text-white/50 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-emerald-400 mb-2 tracking-tight">+$0.00</h3>
          <p className="text-xs text-[#888888] font-mono uppercase tracking-wider">Real-time spread</p>
        </div>
      </motion.div>

      {/* Active Connections */}
      <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono">CONNECTIONS</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:border-purple-500/20 transition-all">
              <LinkIcon className="w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{activeConnections}<span className="text-[#888888] text-lg font-normal">/{totalConnections}</span></h3>
          <div className="w-full h-1.5 bg-purple-500/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${connectionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] rounded-full" 
            />
          </div>
        </div>
      </motion.div>

      {/* Active Groups */}
      <motion.div variants={item} className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-bold text-[#888888] tracking-widest font-mono">GROUPS</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
              <Users className="w-4 h-4 text-white/50 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{activeGroups}<span className="text-[#888888] text-lg font-normal">/{totalGroups}</span></h3>
          <p className="text-[11px] text-[#888888] font-mono uppercase tracking-wider">
            {totalGroups > 0 ? `${totalGroups - activeGroups} INACTIVE` : "NO GROUPS"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
