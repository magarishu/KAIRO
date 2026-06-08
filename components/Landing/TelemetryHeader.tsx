"use client";

import React, { useEffect, useState } from "react";
import { CornerAccents } from "./CornerAccents";

const INITIAL_ASSETS = [
  { symbol: "BTC", price: 71717.50, change: 0.33, isUp: true },
  { symbol: "IMOEX", price: 3412.10, change: -0.12, isUp: false },
  { symbol: "S&P500", price: 5130.25, change: 0.82, isUp: true },
];

export function TelemetryHeader() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const changePercent = (Math.random() * 0.2 - 0.1);
          const newPrice = asset.price * (1 + changePercent / 100);
          const newChange = asset.change + changePercent;
          return {
            ...asset,
            price: newPrice,
            change: newChange,
            isUp: newChange >= 0
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full z-50 pointer-events-none p-4 flex justify-between items-start">
      {/* Top Left Frame */}
      <div className="relative border border-white/20 bg-black/40 backdrop-blur-md p-4 pointer-events-auto">
        <CornerAccents />
        <div className="flex items-center space-x-6" style={{ fontFamily: "var(--font-roboto-mono)" }}>
          <div className="logoBlock text-white font-bold tracking-wider text-sm flex items-center space-x-2">
            <img src="/logo.jpg" alt="Kairo Logo" className="w-7 h-7 object-cover rounded-full" />
            <span>KAIRO</span>
          </div>
          
          <div className="flex space-x-4">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center space-x-2 bg-white/10 rounded-full pr-3 p-1">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">{asset.symbol[0]}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest leading-none">{asset.symbol}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-xs font-bold leading-none mt-1">
                      {asset.price < 10 ? asset.price.toFixed(4) : Math.round(asset.price).toLocaleString()}
                    </span>
                    <span className={`text-[10px] flex items-center mt-1 ${asset.isUp ? "text-[#65A049]" : "text-[#A0494B]"}`}>
                      <svg width="6" height="8" viewBox="0 0 8 12" fill="none" className={`mr-1 ${asset.isUp ? "" : "rotate-180"}`}>
                        <path d="M6 8H2L4 5.5L6 8Z" fill="currentColor"/>
                      </svg>
                      {Math.abs(asset.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Right Frame */}
      <div className="relative border border-white/20 bg-black/40 backdrop-blur-md px-6 py-4 pointer-events-auto flex items-center space-x-6">
        <CornerAccents />
        <a href="mailto:support@kairo.com" className="text-white text-xs uppercase tracking-widest hover:text-white/70 transition-colors" style={{ fontFamily: "var(--font-roboto-mono)" }}>
          SUPPORT <span className="inline-block ml-1 bg-white w-1 h-1" />
        </a>
      </div>
    </header>
  );
}
