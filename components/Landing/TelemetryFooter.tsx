"use client";

import React, { useEffect, useState } from "react";
import { CornerAccents } from "./CornerAccents";

export function TelemetryFooter() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const startTime = Date.now();
    const interval = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute bottom-4 left-4 z-50 pointer-events-none">
      <div className="relative border border-white/20 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center space-x-8" style={{ fontFamily: "var(--font-roboto-mono)" }}>
        <CornerAccents />
        <div className="flex flex-col space-y-1">
          <div className="text-[#A3A3A3] text-[10px] uppercase">Cursor X: <span className="text-white w-8 inline-block">{cursorPos.x}</span></div>
          <div className="text-[#A3A3A3] text-[10px] uppercase">Cursor Y: <span className="text-white w-8 inline-block">{cursorPos.y}</span></div>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="flex flex-col space-y-1">
          <div className="text-[#A3A3A3] text-[10px] uppercase">Scroll: <span className="text-white w-8 inline-block">{Math.floor(scrollY)}</span></div>
          <div className="text-[#A3A3A3] text-[10px] uppercase">Time: <span className="text-white w-12 inline-block">{time.toFixed(1)}s</span></div>
        </div>
      </div>
    </div>
  );
}
