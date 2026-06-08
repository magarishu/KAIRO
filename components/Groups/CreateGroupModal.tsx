import { X, Check } from "lucide-react";
import { useState } from "react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, master: string, slaves: string[]) => void;
  connections?: any[];
}

export function CreateGroupModal({ isOpen, onClose, onCreate, connections = [] }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [masterAccount, setMasterAccount] = useState<any>(null);
  const [slaveSettings, setSlaveSettings] = useState<Record<string, { selected: boolean, multiplier: string, copySl: boolean, copyTp: boolean }>>({});
  
  if (!isOpen) return null;

  // Use real connections from the database
  const allAccounts = connections.map(c => ({
    id: c.id,
    name: c.name,
    accountId: c.accountId || c.id,
    balance: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c.equity || 0),
  }));

  const availableSlaves = allAccounts.filter(acc => acc.id !== masterAccount?.id);

  const handleDragStart = (e: React.DragEvent, account: any) => {
    e.dataTransfer.setData("accountId", account.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const accountId = e.dataTransfer.getData("accountId");
    const account = allAccounts.find(a => a.id === accountId);
    if (account) {
      setMasterAccount(account);
      setSlaveSettings(prev => {
        const next = { ...prev };
        delete next[accountId];
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const toggleSlaveSelection = (id: string) => {
    setSlaveSettings(prev => {
      const current = prev[id] || { selected: false, multiplier: "1.0", copySl: true, copyTp: true };
      return { ...prev, [id]: { ...current, selected: !current.selected } };
    });
  };

  const updateSlaveSetting = (id: string, field: string, value: any) => {
    setSlaveSettings(prev => {
      const current = prev[id] || { selected: false, multiplier: "1.0", copySl: true, copyTp: true };
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  };

  const handleCreate = () => {
    const selectedSlaveIds = Object.keys(slaveSettings).filter(id => slaveSettings[id].selected);
    if (!groupName || !masterAccount || selectedSlaveIds.length === 0) {
      alert("Please enter a group name, set a master account, and select at least one slave.");
      return;
    }
    // Pass the masterAccount.id so the client can find the correct connection
    onCreate(groupName, masterAccount.id, selectedSlaveIds);
    // Reset state
    setGroupName("");
    setMasterAccount(null);
    setSlaveSettings({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Create New Group</h2>
            <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-1">Configure your master and slave accounts for copy trading.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 relative z-10">
          
          {/* General Details */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">1</span>
              Group Details
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Group Name</label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Alpha Fleet Prop Accounts" 
                className="w-full bg-[#111113] border border-white/5 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Master Account Dropzone */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">2</span>
              Master Account
            </h3>
            
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`w-full border-2 border-dashed rounded-xl p-6 transition-colors flex items-center justify-center ${
                masterAccount ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              {!masterAccount ? (
                <p className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">Drag & Drop an account here from the table below to make it the Master</p>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 font-mono">Master Source</span>
                    <span className="text-xl font-black text-white">{masterAccount.name}</span>
                    <span className="text-[11px] font-bold text-[#888888] font-mono uppercase tracking-widest">Balance: <span className="text-white font-black">{masterAccount.balance}</span></span>
                  </div>
                  <button 
                    onClick={() => setMasterAccount(null)}
                    className="p-2 bg-black/40 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-md transition-colors border border-transparent hover:border-rose-500/30"
                    title="Remove Master"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Slave Accounts Table */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">3</span>
              Slave Accounts Selection
            </h3>
            
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest">
                    <th className="p-3 pl-4 w-12 text-center">Select</th>
                    <th className="p-3">Account</th>
                    <th className="p-3 w-32 text-center">Multiplier</th>
                    <th className="p-3 w-24 text-center">Copy SL</th>
                    <th className="p-3 w-24 text-center">Copy TP</th>
                  </tr>
                </thead>
                <tbody>
                  {availableSlaves.map(acc => {
                    const settings = slaveSettings[acc.id] || { selected: false, multiplier: "1.0", copySl: true, copyTp: true };
                    const isSelected = settings.selected;
                    
                    return (
                      <tr 
                        key={acc.id} 
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, acc)}
                        className={`border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-grab active:cursor-grabbing ${isSelected ? 'bg-purple-500/10' : ''}`}
                      >
                        <td className="p-3 pl-4">
                          <button 
                            onClick={() => toggleSlaveSelection(acc.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                              isSelected ? "bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "border-white/20 bg-black"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{acc.name}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mt-1">
                            <span className="text-gray-400">{acc.accountId}</span>
                            <span>•</span>
                            <span className={isSelected ? 'text-white font-black' : ''}>Bal: {acc.balance}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            disabled={!isSelected}
                            value={settings.multiplier}
                            onChange={(e) => updateSlaveSetting(acc.id, 'multiplier', e.target.value)}
                            className={`w-20 bg-[#0A0A0A] border border-white/10 rounded px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-purple-500 font-mono ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox"
                            disabled={!isSelected}
                            checked={settings.copySl}
                            onChange={(e) => updateSlaveSetting(acc.id, 'copySl', e.target.checked)}
                            className={`w-4 h-4 rounded accent-purple-500 cursor-pointer ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox"
                            disabled={!isSelected}
                            checked={settings.copyTp}
                            onChange={(e) => updateSlaveSetting(acc.id, 'copyTp', e.target.checked)}
                            className={`w-4 h-4 rounded accent-purple-500 cursor-pointer ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {availableSlaves.length === 0 && (
                <div className="p-8 text-center text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">
                  No other accounts available.
                </div>
              )}
            </div>
            <p className="text-[10px] text-purple-400 font-mono tracking-widest uppercase text-right mt-2">* You can drag and drop rows from this table to the Master Account zone above.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02] relative z-10">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-white/10 text-[10px] font-bold font-mono uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            className="px-6 py-3 rounded-lg bg-purple-500 text-white text-[10px] font-bold font-mono uppercase tracking-widest hover:bg-purple-400 transition-colors"
          >
            Create Group
          </button>
        </div>

      </div>
    </div>
  );
}
