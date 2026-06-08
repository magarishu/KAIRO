import { Settings, Globe, Clock, DollarSign, ShieldAlert } from "lucide-react";

export function PreferencesTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="border-b border-[#2C2C2E] pb-5">
        <h2 className="text-xl font-bold text-white tracking-wide">Trading Preferences</h2>
        <p className="text-sm text-gray-400 mt-1">Set your default display currencies, timezones, and global limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Localization */}
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#2C2C2E] bg-[#111113]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              Localization
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Default Timezone</label>
              <div className="relative">
                <select className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg pl-10 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option selected>EST (Eastern Standard Time)</option>
                  <option>GMT (Greenwich Mean Time)</option>
                </select>
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Base Display Currency</label>
              <div className="relative">
                <select className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg pl-10 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
                  <option selected>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">All dashboard metrics will be converted to this currency.</p>
            </div>
          </div>
        </div>

        {/* Global Fail-safes */}
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#2C2C2E] bg-[#111113]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Global Fail-safes
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Max Slippage Tolerance (Pips)</label>
              <input 
                type="number" 
                defaultValue="3.0"
                step="0.5"
                className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1.5">Trades will not execute if slippage exceeds this value.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Global Daily Drawdown Pause</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  defaultValue="5.0"
                  className="w-24 bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors text-center"
                />
                <span className="text-gray-400 text-sm">%</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">Automatically suspends all copying if aggregate loss hits this percentage in a single day.</p>
            </div>
          </div>
        </div>

      </div>
      
      <div className="flex justify-end pt-4">
        <button className="px-6 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-bold hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          Save Preferences
        </button>
      </div>

    </div>
  );
}
