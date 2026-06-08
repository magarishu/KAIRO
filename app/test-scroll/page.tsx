"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TestScrollPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scale from 1 to 150 as the user scrolls
  const scale = useTransform(scrollYProgress, [0, 1], [1, 150]);
  
  // Fade out at the very end
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Tall container to allow scrolling */}
      <div ref={containerRef} className="relative w-full h-[300vh]">
        
        {/* Sticky element that stays in place while scrolling */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden border-4 border-red-500">
          
          <motion.div
            style={{ 
              scale: scale, 
              opacity: opacity,
              transformOrigin: "center center"
            }}
            className="flex items-center justify-center"
          >
            <h1 className="text-9xl font-bold tracking-widest whitespace-nowrap">
              KA<span className="text-white">I</span>RO
            </h1>
          </motion.div>
          
          {/* Debug overlay */}
          <div className="absolute top-4 left-4 bg-white/10 p-4 font-mono text-sm">
            <p>Scroll down inside the red box!</p>
          </div>

        </div>
      </div>
      
      {/* Content below the scroll container */}
      <div className="h-screen flex items-center justify-center bg-zinc-900">
        <h2 className="text-4xl">You made it through the I!</h2>
      </div>
    </div>
  );
}
