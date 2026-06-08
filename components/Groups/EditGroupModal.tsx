import { X, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Group } from "@/types/group";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string, master: string, slaves: string[]) => void;
  group: Group | null;
  connections?: any[];
}

export function EditGroupModal({ isOpen, onClose, onUpdate, group, connections = [] }: EditGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [masterAccount, setMasterAccount] = useState<any>(null);
  const [slaveSettings, setSlaveSettings] = useState<Record<string, { selected: boolean, multiplier: string, copySl: boolean, copyTp: boolean }>>({});
  
  // Use real connections from the database
  const allAccounts = useMemo(() => connections.map(c => ({
    id: c.id,
    name: c.name,
    accountId: c.accountId || c.id,
    balance: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c.equity || 0),
  })), [connections]);

  useEffect(() => {
    if (group) {
      setGroupName(group.name);
      
      // Find master account by checking accountId or matching the subtitle name
      const masterName = group.subtitle.split(" • ")[0];
      const foundMaster = allAccounts.find(a => a.accountId === group.accountId || a.name === masterName) || allAccounts[0];
      setMasterAccount(foundMaster);

      // Map existing slaves to connections
      const initialSettings: Record<string, { selected: boolean, multiplier: string, copySl: boolean, copyTp: boolean }> = {};
      group.slaves.forEach((slave: any) => {
        const foundSlaveAcc = allAccounts.find(a => a.accountId === slave.accountId || a.name === slave.name);
        if (foundSlaveAcc) {
          initialSettings[foundSlaveAcc.id] = { 
            selected: true, 
            multiplier: slave.multiplier?.toString() || "1.0", 
            copySl: slave.copySl ?? true, 
            copyTp: slave.copyTp ?? true 
          };
        }
      });
      setSlaveSettings(initialSettings);
    }
  }, [group, allAccounts]);

  if (!isOpen || !group) return null;

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

  const handleUpdate = () => {
    const selectedSlaveIds = Object.keys(slaveSettings).filter(id => slaveSettings[id].selected);
    if (!groupName || !masterAccount || selectedSlaveIds.length === 0) {
      alert("Please enter a group name, set a master account, and select at least one slave.");
      return;
    }
    // We pass slave IDs for now; in a real app you might pass the detailed settings object
    onUpdate(groupName, masterAccount.name, selectedSlaveIds);
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
      <div className="relative w-full max-w-4xl bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2C2C2E] flex justify-between items-center bg-[#111113]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Edit Group</h2>
            <p className="text-xs text-gray-400 mt-1">Configure your master and slave accounts for copy trading.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2C2C2E] rounded-md transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* General Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">1</span>
              Group Details
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Group Name</label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Alpha Fleet Prop Accounts" 
                className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Master Account Dropzone */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">2</span>
              Master Account
            </h3>
            
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`w-full border-2 border-dashed rounded-xl p-6 transition-colors flex items-center justify-center ${
                masterAccount ? 'border-purple-500 bg-purple-500/10' : 'border-[#2C2C2E] bg-[#111113] hover:border-gray-500'
              }`}
            >
              {!masterAccount ? (
                <p className="text-sm text-gray-500">Drag & Drop an account here from the table below to make it the Master</p>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Master Source</span>
                    <span className="text-lg font-bold text-white">{masterAccount.name}</span>
                    <span className="text-xs text-gray-400">Balance: {masterAccount.balance}</span>
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
            <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">3</span>
              Slave Accounts Selection
            </h3>
            
            <div className="border border-[#2C2C2E] rounded-xl overflow-hidden bg-[#111113]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2C2C2E] bg-[#161618] text-xs font-semibold text-gray-400">
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
                        className={`border-b border-[#2C2C2E] last:border-0 hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing ${isSelected ? 'bg-purple-900/10' : ''}`}
                      >
                        <td className="p-3 pl-4">
                          <button 
                            onClick={() => toggleSlaveSelection(acc.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                              isSelected ? "bg-purple-500 border-purple-500" : "border-gray-500 bg-[#161618]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{acc.name}</p>
                          <p className="text-[11px] text-gray-500">Bal: {acc.balance}</p>
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            disabled={!isSelected}
                            value={settings.multiplier}
                            onChange={(e) => updateSlaveSetting(acc.id, 'multiplier', e.target.value)}
                            className={`w-20 bg-[#161618] border border-[#2C2C2E] rounded px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-purple-500 ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <div className="p-8 text-center text-gray-500 text-sm">
                  No other accounts available.
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500 text-right mt-2">* You can drag and drop rows from this table to the Master Account zone above.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-[#2C2C2E] flex justify-end gap-3 bg-[#111113]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#2C2C2E] text-sm font-bold text-gray-300 hover:bg-[#2C2C2E] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="px-6 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-bold hover:bg-purple-400 transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
