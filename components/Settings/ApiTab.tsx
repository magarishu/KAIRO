import { Key, Copy, Eye, EyeOff, Plus, Network } from "lucide-react";
import { useState } from "react";

export function ApiTab() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="border-b border-[#2C2C2E] pb-5">
        <h2 className="text-xl font-bold text-white tracking-wide">API & Webhooks</h2>
        <p className="text-sm text-gray-400 mt-1">Manage programmatic access and external webhook integrations.</p>
      </div>

      <div className="space-y-6">
        
        {/* API Keys */}
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#2C2C2E] bg-[#111113] flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Active API Keys
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#2C2C2E] text-xs font-bold text-gray-300 hover:bg-[#2C2C2E] transition-colors">
              <Plus className="w-3 h-3" /> Generate Key
            </button>
          </div>
          <div className="p-6">
            <div className="border border-[#2C2C2E] rounded-lg p-4 bg-[#111113]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-bold text-white mb-1">Main Trade Execution Key</p>
                  <p className="text-xs text-gray-500">Created on Oct 12, 2023 • Last used 2 hours ago</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">ACTIVE</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type={showKey ? "text" : "password"} 
                  value="kr_live_8f92j3k9f8j239f8j23f8j923f"
                  readOnly
                  className="flex-1 bg-[#161618] border border-[#2C2C2E] rounded-md px-3 py-2 text-xs text-white font-mono"
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 border border-[#2C2C2E] rounded-md text-gray-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button className="p-2 border border-[#2C2C2E] rounded-md text-gray-400 hover:text-white transition-colors bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-400">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#2C2C2E] bg-[#111113]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              Webhook Endpoints
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-400 mb-4">Automatically push trade events and status updates to your external services.</p>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Endpoint URL</label>
              <input 
                type="text" 
                placeholder="https://your-domain.com/webhook/kairo"
                className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Events to send</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
                  <span className="text-sm text-gray-300">Trade Open/Close</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
                  <span className="text-sm text-gray-300">Drawdown Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-purple-500 w-4 h-4" />
                  <span className="text-sm text-gray-300">System Errors</span>
                </label>
              </div>
            </div>
            
            <button className="mt-4 px-5 py-2.5 rounded-lg border border-purple-500/50 text-purple-400 text-sm font-bold hover:bg-purple-500/10 transition-colors">
              Save Webhook
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
