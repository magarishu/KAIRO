"use client";

import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAccount: any) => void;
  account: any;
}

export function EditAccountModal({ isOpen, onClose, onUpdate, account }: EditAccountModalProps) {
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    if (account) {
      setAccountName(account.name || "");
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleUpdate = () => {
    if (!accountName.trim()) {
      alert("Please enter an Account Name");
      return;
    }

    const updatedAccount = {
      ...account,
      name: accountName,
    };

    onUpdate(updatedAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Small Modal Card */}
      <div className="relative w-full max-w-sm bg-[#161618] border border-[#2C2C2E] rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
          <h2 className="text-sm font-bold text-white">Edit Account Name</h2>
          <button 
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Account Name</label>
            <input 
              type="text" 
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. My Funding Account" 
              className="w-full bg-black border border-[#2C2C2E] rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2C2C2E] flex justify-end gap-2 bg-[#111113] rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#2C2C2E] text-xs font-medium text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-purple-300 text-purple-950 text-xs font-bold hover:bg-purple-200 transition-colors"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
