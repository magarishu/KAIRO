"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Target, Globe, Server, Activity } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      title: "Cross-Market Routing",
      description: "Seamlessly bridge executions across Forex, Crypto, and Synthetics using our proprietary global network.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Zero Latency Drift",
      description: "Direct market access nodes in LD4, NY4, and TY3 guarantee sub-millisecond execution synchronization.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Algorithmic Risk Control",
      description: "Set hard drawdowns, dynamic lot multipliers, and equity protectors on a strictly per-account basis.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Absolute Precision",
      description: "Built exclusively for prop firm managers and institutions where every single pip translates to millions.",
      icon: <Target className="w-6 h-6 text-white" />
    },
    {
      title: "Infinite Scalability",
      description: "Manage 10 or 10,000 slave accounts simultaneously without a single drop in performance or execution speed.",
      icon: <Server className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Telemetry",
      description: "Monitor live drawdown, latency spikes, and execution history across your entire portfolio instantly.",
      icon: <Activity className="w-6 h-6 text-white" />
    }
  ];

  return (
    <section id="about" className="relative w-full min-h-screen bg-[#050505] z-20 flex flex-col items-center justify-center px-6 py-32 border-t border-white/5">
      <div className="max-w-[1200px] w-full mx-auto">
        
        {/* Section 1: What is Kairo & Unique Value Proposition */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8"
          >
            What is KAIRO?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-6"
          >
            KAIRO is not just another trade copier. It is a <strong className="text-white font-bold">next-generation cross-market infrastructure protocol</strong> designed to bridge the gap between retail platforms and institutional execution.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 font-light leading-relaxed"
          >
            Unlike traditional cloud copiers that suffer from slippage and server delays, KAIRO utilizes dedicated institutional routing. Whether you are managing multiple prop firm accounts or running a massive investment fund, our platform guarantees that your master trades are mirrored to unlimited slave accounts instantaneously.
          </motion.p>
        </div>

        {/* Section 2: What we give / Features Grid */}
        <div className="mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 tracking-wide uppercase text-white"
            style={{ fontFamily: "var(--font-roboto-mono)" }}
          >
            The Arsenal
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#111113] border border-[#2C2C2E] p-8 rounded-2xl hover:border-gray-500 hover:bg-[#161618] transition-all group"
              >
                <div className="w-14 h-14 bg-[#1C1C1E] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlight Stats (From original) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-24 pt-16 border-t border-white/5" 
          style={{ fontFamily: "var(--font-roboto-mono)" }}
        >
          <div>
            <span className="block text-5xl text-white font-black mb-2">&lt; 1.2ms</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Average Execution Latency</span>
          </div>
          <div>
            <span className="block text-5xl text-white font-black mb-2">99.99%</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Guaranteed Uptime SLA</span>
          </div>
          <div>
            <span className="block text-5xl text-white font-black mb-2">Zero</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Master-to-Slave Latency Drift</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
