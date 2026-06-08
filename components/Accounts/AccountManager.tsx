"use client";
import { useState } from "react";
import { Platform, PlatformSelector } from "./PlatformSelector";
import { DynamicCredentialForm } from "./DynamicCredentialForm";
import { Link2 } from "lucide-react";

export function AccountManager() {
  const [platform, setPlatform] = useState<Platform | null>(null);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border-[var(--color-border-active)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 text-white">Connect New Account</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">Select a platform to link your Forex or Futures account securely.</p>
        </div>
        <div className="p-3 bg-[var(--color-bg-surface-hover)] rounded-xl border border-[var(--color-border-subtle)]">
          <Link2 className="w-6 h-6 text-[var(--color-brand-primary)]" />
        </div>
      </div>
      
      <PlatformSelector selected={platform} onSelect={setPlatform} />
      
      {platform && (
        <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-6">
          <DynamicCredentialForm platform={platform} />
          
          <div className="mt-8 flex justify-end">
            <button className="bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
              Link Account securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
