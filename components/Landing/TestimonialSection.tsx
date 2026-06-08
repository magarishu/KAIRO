"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alexander Vance",
    title: "Head of Execution",
    company: "QUANTEDGE",
    content: "The routing precision KAIRO provides is unprecedented. We migrated our entire algorithmic infrastructure and saw execution latency drop by 40% globally across all major synthetic pairs.",
    metric: "0.8ms Latency"
  },
  {
    name: "Sarah Lin",
    title: "Director of Trading",
    company: "APEX PROPRIETARY",
    content: "Managing risk constraints across 5,000 sub-accounts used to require an entire engineering team. KAIRO's institutional telemetry dashboard handles it effortlessly out of the box.",
    metric: "5k+ Accounts"
  },
  {
    name: "James O'Connor",
    title: "Chief Risk Officer",
    company: "MERIDIAN CAPITAL",
    content: "Zero latency drift between master and slave terminals, even during NFP releases. The platform's resilience under extreme market volatility is exactly what high-frequency institutions require.",
    metric: "Zero Drift"
  },
  {
    name: "Dr. Elena Rostova",
    title: "Lead Quantitative Analyst",
    company: "NEXUS ALPHA",
    content: "The API integration was mathematically flawless. We can now spin up isolated trading environments for our quantitative researchers in milliseconds rather than days.",
    metric: "Direct API"
  }
];

export function TestimonialSection() {
  // Seamless infinite loop
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="relative w-full min-h-screen bg-[#050505] z-20 flex flex-col justify-center py-32 border-t border-white/5 overflow-hidden">
      
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="text-center mb-24 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6"
          >
            What our clients say.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#A3A3A3] max-w-2xl mx-auto font-light leading-relaxed"
          >
            Institutional-grade infrastructure demands institutional-grade performance. 
            Discover how leading prop firms and hedge funds leverage KAIRO to secure their edge.
          </motion.p>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="w-full relative overflow-hidden flex py-10">
        
        {/* Deep Blur Fades for a seamless entering/exiting effect */}
        <div className="absolute left-0 top-0 z-10 h-full w-48 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent backdrop-blur-[4px] pointer-events-none"></div>
        <div className="absolute right-0 top-0 z-10 h-full w-48 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent backdrop-blur-[4px] pointer-events-none"></div>
        
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4 w-max"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="w-[420px] flex-shrink-0 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#333333] transition-all duration-500 rounded-lg p-10 flex flex-col justify-between group relative"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />

              <div>
                <div className="flex justify-between items-start mb-8">
                  <Quote className="w-8 h-8 text-[#333333] group-hover:text-white transition-colors duration-500" />
                  <span 
                    className="text-xs font-bold text-white bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-roboto-mono)" }}
                  >
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-[#E5E5E5] text-base leading-loose font-light mb-10">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#1A1A1A]">
                <p className="font-bold text-white text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-roboto-mono)" }}>
                  {testimonial.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#A3A3A3] uppercase tracking-widest" style={{ fontFamily: "var(--font-roboto-mono)" }}>
                  <span>{testimonial.title}</span>
                  <span className="w-1 h-1 bg-[#333333] rounded-full"></span>
                  <span className="text-white">{testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
