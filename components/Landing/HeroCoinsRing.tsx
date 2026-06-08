"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const COIN_IMAGES = [
  "/coins/btc-coin.png",
  "/coins/eth-coin.png",
  "/coins/eur-coin.png",
  "/coins/gbp-coin.png",
  "/coins/usd-coin.png",
  "/coins/xau-coin.png",
  "/coins/bnb-coin.png",
  "/coins/sol-coin.png",
  "/coins/thether-coin.png",
  "/coins/xrp-coin.png"
];

export function HeroCoinsRing() {
  const numCoins = COIN_IMAGES.length;
  // Increase radius since the 3D tilt compresses the visual Y-axis
  const radius = 450; 

  const coins = COIN_IMAGES.map((src, i) => {
    const angle = (i * (360 / numCoins)) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      id: i,
      src,
      x,
      y,
      delay: i * 0.15,
    };
  });

  return (
    <div 
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto" 
      style={{ perspective: "1500px" }}
    >
      {/* 3D Orbiting Plane */}
      <motion.div
        initial={{ rotateX: 65, rotateZ: 0 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute flex items-center justify-center"
      >
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{ x: coin.x, y: coin.y, scale: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5 + coin.delay,
            }}
            className="absolute flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            
            {/* Counter Z-Rotation to stop spinning */}
            <motion.div
              initial={{ rotateZ: 0 }}
              animate={{ rotateZ: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
              className="absolute flex items-center justify-center"
            >
              
              {/* Counter X-Rotation to face camera perfectly upright */}
              <motion.div
                initial={{ rotateX: -65 }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute flex items-center justify-center"
              >
                
                {/* Floating animation */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 4 + (coin.id % 3),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-[110px] h-[110px]"
                >
                  
                  {/* Interactive hover container */}
                  <motion.div 
                    whileHover={{ rotateY: 360, scale: 1.25 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="w-full h-full cursor-pointer drop-shadow-[0_0_20px_rgba(201,179,252,0.3)]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image 
                      src={coin.src} 
                      alt="Coin" 
                      fill
                      priority
                      className="object-contain"
                    />
                  </motion.div>
                  
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
