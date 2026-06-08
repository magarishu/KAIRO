"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center bg-transparent backdrop-blur-sm border-b border-transparent hover:border-white/10 transition-colors"
    >
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <img src="/logo.jpg" alt="Kairo Logo" className="w-5 h-5 object-cover rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-300" />
          <span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "var(--font-roboto-mono)" }}>KAIRO</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-[#A3A3A3]" style={{ fontFamily: "var(--font-roboto-mono)" }}>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>

      {/* Auth Actions */}
      <div className="flex items-center space-x-6 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-roboto-mono)" }}>
        <Link href="/sign-in" className="text-[#A3A3A3] hover:text-white transition-colors">
          Sign In
        </Link>
        <Link href="/sign-up" className="bg-white text-black px-5 py-2.5 hover:bg-white/90 transition-colors font-bold">
          Sign Up
        </Link>
      </div>
    </motion.nav>
  );
}
