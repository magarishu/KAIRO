"use client";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function WelcomeBanner() {
  const { user } = useUser();
  const username = user?.firstName || user?.username || "there";

  return (
    <div className="relative w-full h-[240px] md:h-[280px] rounded-2xl overflow-hidden border border-white/5 bg-[#050505] group shadow-2xl">
      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[50%] -left-[20%] w-[80%] h-[200%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[200%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" 
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center p-10 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight mb-3 drop-shadow-sm">
            Welcome back, {username}.
          </h2>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-xl leading-relaxed font-light font-mono">
            SYSTEM STATUS: <span className="text-emerald-400 font-medium">OPTIMAL</span>. OVERSEE YOUR KAIRO INFRASTRUCTURE AND LIVE EXECUTION METRICS.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
