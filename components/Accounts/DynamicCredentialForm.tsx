import { Platform } from "./PlatformSelector";

export function DynamicCredentialForm({ platform }: { platform: Platform }) {
  if (platform === "MT4" || platform === "MT5") {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Login / Account Number</label>
            <input type="text" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="e.g. 1004567" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
            <input type="password" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="••••••••" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Server Name</label>
            <input type="text" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="e.g. MetaQuotes-Demo" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Broker</label>
            <input type="text" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="e.g. FTMO, E8 Funding" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">API Key</label>
          <input type="text" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="sk_live_..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">API Secret</label>
          <input type="password" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-active)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all" placeholder="••••••••" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 p-4 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border-subtle)] w-fit">
        <span className="text-sm font-medium">Environment:</span>
        <div className="flex items-center gap-1 bg-[var(--color-bg-surface-hover)] p-1 rounded-md border border-[var(--color-border-active)]">
          <button className="px-4 py-1.5 rounded bg-[var(--color-brand-primary)] text-black font-semibold text-sm shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all">Simulation</button>
          <button className="px-4 py-1.5 rounded text-[var(--color-text-secondary)] hover:text-white font-semibold text-sm transition-colors">Live</button>
        </div>
      </div>
    </div>
  );
}
