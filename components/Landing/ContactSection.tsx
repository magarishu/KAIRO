"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="relative w-full min-h-screen bg-[#050505] z-20 flex flex-col items-center justify-center px-6 py-24 border-t border-white/5">
      <div className="max-w-4xl w-full mx-auto">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            Get in Touch.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Have questions about custom institutional solutions or API access? Our team is ready to assist you.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16 mb-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4 max-w-xs"
          >
            <div className="w-12 h-12 bg-[#161618] border border-[#2C2C2E] rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#C9B3FC]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Email Us</h4>
              <p className="text-sm text-gray-400 mb-2">For general inquiries and support.</p>
              <a href="mailto:ishuthapa942@gmail.com" className="text-sm text-white hover:text-[#C9B3FC] transition-colors font-mono">ishuthapa942@gmail.com</a>
            </div>
          </motion.div>



          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-4 max-w-xs"
          >
            <div className="w-12 h-12 bg-[#161618] border border-[#2C2C2E] rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Direct Support</h4>
              <p className="text-sm text-gray-400 mb-2">Direct line for custom routing setups.</p>
              <a href="tel:+919511073317" className="text-sm text-white hover:text-blue-400 transition-colors font-mono">+91 95110 73317</a>
            </div>
          </motion.div>
        </div>
        
        {/* Important Information & Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-12 border-t border-[#2C2C2E] text-center"
        >
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto">
            <strong className="text-gray-400">Important Disclaimer:</strong> Kairo provides a sophisticated software platform for trade copying and account management. We are not a registered broker-dealer, investment advisor, or financial service provider. All trading in financial markets involves substantial risk of loss and is not suitable for every investor. By utilizing our platform, you acknowledge that past performance is not indicative of future results. You maintain full responsibility for all trades routed and executed through our software. Please review your broker's terms and conditions before linking accounts.
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
