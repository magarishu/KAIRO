"use client";

import { AlertOctagon } from "lucide-react";
import { useState } from "react";

export function PanicButton() {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="h-full bg-[var(--color-bg-main)] border border-red-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[300px]">
      <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
      
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 z-10 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
        <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 z-10">Emergency Halt</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8 z-10 px-4">Instantly flatten all open positions and pause copying across all accounts.</p>
      
      {!confirming ? (
        <button 
          onClick={() => setConfirming(true)}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all z-10 tracking-widest uppercase border border-red-400"
        >
          Flatten All Accounts
        </button>
      ) : (
        <div className="w-full space-y-3 z-10 animate-in zoom-in-95 duration-200">
          <p className="text-xs text-red-400 font-bold mb-2 tracking-widest">ARE YOU SURE?</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                alert("EMERGENCY FLATTEN TRIGGERED!");
                setConfirming(false);
              }}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.8)] transition-all uppercase tracking-widest"
            >
              Execute
            </button>
            <button 
              onClick={() => setConfirming(false)}
              className="w-full bg-[var(--color-bg-surface-hover)] border border-[var(--color-border-active)] hover:bg-[var(--color-bg-surface)] text-white font-bold py-3 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
