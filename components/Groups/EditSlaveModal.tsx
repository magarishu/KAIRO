import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { SlaveAccount } from "@/types/group";

interface EditSlaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (slave: SlaveAccount) => void;
  slave: SlaveAccount | null;
}

export function EditSlaveModal({ isOpen, onClose, onUpdate, slave }: EditSlaveModalProps) {
  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");

  useEffect(() => {
    if (slave) {
      setName(slave.name);
      setBroker(slave.broker || "");
    }
  }, [slave]);

  if (!isOpen || !slave) return null;

  const handleUpdate = () => {
    if (!name || !broker) {
      alert("Please fill in all fields.");
      return;
    }
    onUpdate({ ...slave, name, broker });
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
      <div className="relative w-full max-w-md bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2C2C2E] flex justify-between items-center bg-[#111113]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Edit Slave Account</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2C2C2E] rounded-md transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Account Name / ID</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Broker</label>
            <input 
              type="text" 
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-[#2C2C2E] flex justify-end gap-3 bg-[#111113]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#2C2C2E] text-sm font-bold text-gray-300 hover:bg-[#2C2C2E] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="px-6 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-bold hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
