"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Loader } from "@/components/Landing/Loader";
import { Navbar } from "@/components/Landing/Navbar";
import { HeroCoinsRing } from "@/components/Landing/HeroCoinsRing";
import { AboutSection } from "@/components/Landing/AboutSection";
import { PricingSection } from "@/components/Landing/PricingSection";
import { TestimonialSection } from "@/components/Landing/TestimonialSection";
import { ContactSection } from "@/components/Landing/ContactSection";

function MainContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Math for the dive:
  // Using an exponential scale curve makes the camera zoom feel completely smooth and natural
  const kairoScale = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], 
    [1, 1.5, 2.5, 5, 10, 25, 60, 150]
  );
  
  // Fade out completely to reveal the void
  const kairoOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);

  // Coins scale down to 0 (collect in middle) and fade out
  const coinsScale = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const coinsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative w-full"
    >
      <Navbar />

      {/* The Tall Scroll Container (250vh creates physical scroll space for the zoom) */}
      <div ref={containerRef} className="relative w-full h-[250vh]">
        
        {/* Sticky Hero Section - Stays fixed on screen while the user scrolls down */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-transparent">

          {/* Background Coins Ring - Shrinks to center and fades out */}
          <motion.div 
            style={{ 
              opacity: coinsOpacity,
              scale: coinsScale 
            }} 
            className="absolute inset-0 z-0 pointer-events-auto"
          >
             <HeroCoinsRing />
          </motion.div>

          {/* KAIRO Container - Scales and fades based on scroll */}
          <motion.div
            style={{ 
              scale: kairoScale,
              opacity: kairoOpacity,
              transformOrigin: "center center"
            }}
            className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Entrance Animation Wrapper */}
            <motion.div
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-6xl sm:text-8xl md:text-[140px] font-bold tracking-tighter leading-none whitespace-nowrap flex items-center justify-center pointer-events-auto text-white">
                {"KAIRO".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ 
                      y: -20, 
                      scale: 1.2
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className={`inline-block cursor-default relative z-10 hover:text-purple-400 transition-colors`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ABOUT SECTION */}
      <AboutSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Contact Section */}
      <ContactSection />

    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-transparent text-white selection:bg-white selection:text-black font-sans relative">
      <MainContent />
    </div>
  );
}
