"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
  isLoading: boolean;
}

export function Loader({ onComplete, isLoading }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    let startTime: number;
    const duration = 2500; // 2.5 seconds loading sequence

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percent = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(percent);

      if (percent < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(onComplete, 400); // small delay at 100% before firing complete
      }
    };

    requestAnimationFrame(updateProgress);
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-white"
        >
          <div className="text-sm tracking-[0.3em] text-[#A3A3A3] mb-4 uppercase">Initializing Environment</div>
          <div className="text-7xl font-light" style={{ fontFamily: "var(--font-roboto-mono)" }}>
            {progress}%
          </div>
          <div className="w-48 h-px bg-white/20 mt-8 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
