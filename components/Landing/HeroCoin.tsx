"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function HeroCoin() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const translateX = mousePos.x * -30;
  const translateY = mousePos.y * -30;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-auto z-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <div 
        className={`relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] transition-all duration-700 ease-in-out ${isHovered ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
      >
        <Image 
          src="/coins.png" 
          alt="Coins" 
          fill
          priority
          className="object-contain opacity-60 mix-blend-screen"
        />
      </div>
    </div>
  );
}
