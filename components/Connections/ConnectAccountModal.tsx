"use client";

import { X, Info, Link as LinkIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (account: any) => void;
}

export function ConnectAccountModal({ isOpen, onClose, onConnect }: ConnectAccountModalProps) {
  const [selectedBroker, setSelectedBroker] = useState("MT5");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const brokers = [
    { name: "Tradovate", image: "/broker-logo/tradovate.png" },
    { name: "MT5", image: "/broker-logo/mt5.jpg" },
    { name: "Rithmic", image: "/broker-logo/rithimic.jpg" },
  ];

  const handleConnect = async () => {
    if (!accountName || !accountId) {
      alert("Please fill out Account Name and Account ID");
      return;
    }
    if (selectedBroker === "MT5" && (!password || !server)) {
      alert("MT5 requires Password and Server");
      return;
    }
    if (selectedBroker === "Tradovate" && (!password || !server)) {
      alert("Tradovate requires Password and Environment (Live or Demo)");
      return;
    }
    if (selectedBroker === "Rithmic" && (!password || !server)) {
      alert("Rithmic requires Password and System Name");
      return;
    }

    setIsConnecting(true);
    const brokerInfo = brokers.find(b => b.name === selectedBroker) || brokers[1];

    const newAccount = {
      broker: selectedBroker,
      name: accountName,
      id: accountId,
      password: password,
      server: server,
      equity: "$0.00",
      status: "ONLINE",
      icon: brokerInfo.image,
      iconColor: ""
    };

    if (onConnect) {
      // Assuming onConnect returns a promise so we can stop loading
      try {
        await onConnect(newAccount);
      } catch(e) {
        // Errors are handled in the parent
      }
    }
    
    // Reset state
    setAccountName("");
    setAccountId("");
    setPassword("");
    setServer("");
    setSelectedBroker("MT5");
    setIsConnecting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[500px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5 bg-white/[0.02] relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Connect Account</h2>
            <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">Follow the steps to link your trading provider.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto relative z-10">
          {/* Section 1: Select Broker */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">1</div>
              <h3 className="text-[11px] font-bold text-white font-mono uppercase tracking-widest">Select Broker Provider</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {brokers.map((broker) => (
                <button
                  key={broker.name}
                  onClick={() => setSelectedBroker(broker.name)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    selectedBroker === broker.name 
                      ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                      : "border-white/5 bg-[#111113] hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className={`w-10 h-10 bg-black rounded-lg flex items-center justify-center text-lg font-black shadow-inner overflow-hidden border border-white/5`}>
                    <img src={broker.image} alt={broker.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-300">{broker.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Account Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">2</div>
              <h3 className="text-[11px] font-bold text-white font-mono uppercase tracking-widest">Account Credentials</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Account Name (Nickname)</label>
                <input 
                  type="text" 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. My Funding Account" 
                  className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">
                    {selectedBroker === "Tradovate" || selectedBroker === "Rithmic" ? "Username" : "Account ID"}
                  </label>
                  <input 
                    type="text" 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder={selectedBroker === "Tradovate" || selectedBroker === "Rithmic" ? "Username" : "123456"} 
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">
                  {selectedBroker === "Tradovate" ? "Environment" : selectedBroker === "Rithmic" ? "System Name" : "Server Name"}
                </label>
                {selectedBroker === "Tradovate" ? (
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>Select Environment</option>
                    <option value="Demo">Demo</option>
                    <option value="Live">Live</option>
                  </select>
                ) : selectedBroker === "Rithmic" ? (
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>Select System Name</option>
                    <option value="Rithmic Paper Trading">Rithmic Paper Trading</option>
                    <option value="Rithmic Live">Rithmic Live</option>
                    <option value="Apex">Apex</option>
                    <option value="Topstep">Topstep</option>
                    <option value="MyFundedFutures">MyFundedFutures</option>
                    <option value="TradeDay">TradeDay</option>
                  </select>
                ) : (
                  <input 
                    type="text"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    placeholder="Type server name..."
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 flex gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
              <Info className="w-5 h-5 text-purple-400 shrink-0" />
              <p className="text-[10px] font-mono text-gray-300 leading-relaxed uppercase tracking-widest">
                Encryption active. Your credentials are securely stored using AES-256 bank-grade encryption and never transmitted in plain text.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02] relative z-10">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-white/10 text-[10px] font-bold font-mono uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest text-white transition-colors ${
              isConnecting ? "bg-purple-500/50 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-400"
            }`}
          >
            {isConnecting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LinkIcon className="w-4 h-4" />
            )}
            {isConnecting ? "Connecting..." : "Connect Account"}
          </button>
        </div>

      </div>
    </div>
  );
}
