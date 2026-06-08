import { X, Search, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AddConnectionsModal({ isOpen, onClose, onAdd, connections = [] }: { isOpen: boolean, onClose: () => void, onAdd: (selected: any[]) => void, connections?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filtered = connections.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.accountId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleAdd = () => {
    const selected = connections.filter(a => selectedIds.has(a.id));
    onAdd(selected);
    onClose();
    setSelectedIds(new Set());
    setSearchQuery("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase mb-1">Add Connections</h2>
            <p className="text-[9px] font-bold text-[#888888] font-mono tracking-widest uppercase">Select accounts to apply risk rules</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto max-h-[60vh] relative z-10">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111113] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase py-8">No accounts found.</p>
            ) : (
              filtered.map(acc => {
                const isSelected = selectedIds.has(acc.id);
                return (
                  <div 
                    key={acc.id} 
                    onClick={() => toggleSelect(acc.id)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected ? "bg-purple-500/10 border-purple-500/50" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-purple-500 border-purple-500 text-white" : "border-white/20 bg-black"
                    )}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{acc.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 font-mono tracking-widest uppercase mt-0.5">{acc.broker === 'MetaTrader 5' ? 'MT5' : acc.broker} • {acc.accountId}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-5 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3 relative z-10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest border border-white/10 text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
            className="px-5 py-2.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest bg-purple-500 hover:bg-purple-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Selected ({selectedIds.size})
          </button>
        </div>
      </div>
    </>
  );
}
