"use client";

import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight, BarChart2, Box, Layers, PlayCircle, Settings, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { createRiskRule, updateRiskRule, deleteRiskRule } from "@/lib/actions/risk";
import { useTransition } from "react";
import { AddConnectionsModal } from "@/components/RiskManager/AddConnectionsModal";

export default function RiskClient({ initialConfigs, connections }: { initialConfigs: any[], connections: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const configs = initialConfigs;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const StatusBadge = ({ status, onClick }: { status: string, onClick: () => void }) => {
    if (status === "ENABLED") {
      return (
        <span 
          onClick={onClick}
          className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          ENABLED
        </span>
      );
    }
    return (
      <span 
        onClick={onClick}
        className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 cursor-pointer hover:bg-rose-500/20 transition-colors"
      >
        DISABLED
      </span>
    );
  };

  const getValueColorClass = (value: string | number, status: string) => {
    const num = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]+/g, ""));
    if (num === 0 || isNaN(num)) {
      return "text-gray-500 font-bold";
    }
    return status === "ENABLED" ? "text-emerald-500 font-bold" : "text-rose-500 font-bold";
  };

  const handleToggleLimit = (id: string, field: string) => {
    const config = configs.find(c => c.id === id);
    if (!config) return;
    
    startTransition(async () => {
      await updateRiskRule(id, {
        [field]: config[field] === "ENABLED" ? "DISABLED" : "ENABLED"
      });
    });
  };

  const handleChangeLimit = (id: string, field: string, value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
    
    startTransition(async () => {
      await updateRiskRule(id, {
        [field]: field === 'trailingDd' ? value : numValue
      });
    });
  };

  const handleDeleteConfig = (id: string) => {
    startTransition(async () => {
      await deleteRiskRule(id);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredConfigs = configs.filter(c => {
    const q = searchQuery.toLowerCase();
    const platform = c.connection?.broker || "";
    const account = c.connection?.accountId || "";
    return platform.toLowerCase().includes(q) || account.toLowerCase().includes(q);
  });

  const totalItems = filteredConfigs.length;
  const safeItemsPerPage = itemsPerPage > 0 ? itemsPerPage : 1;
  const totalPages = Math.ceil(totalItems / safeItemsPerPage) || 1;
  const startIndex = (currentPage - 1) * safeItemsPerPage;
  const paginatedConfigs = filteredConfigs.slice(startIndex, startIndex + safeItemsPerPage);

  const handleAddConnections = (selected: any[]) => {
    startTransition(async () => {
      for (const account of selected) {
        await createRiskRule({ connectionId: account.id });
      }
      setIsAddModalOpen(false);
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Top Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Risk Manager</h1>
        <div className="h-[1px] w-12 bg-purple-500/50 mt-2 mb-4"></div>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Monitor and enforce global and account-specific drawdown limits.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row justify-end items-start xl:items-center gap-4">
        
        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <div className="flex items-center bg-[#0A0A0A] border border-purple-500/50 rounded-lg px-3 py-2 w-64 transition-all animate-in fade-in slide-in-from-right-2">
              <Search className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search accounts..."
                className="bg-transparent text-sm text-white placeholder-[#888888] focus:outline-none w-full font-mono"
                onBlur={() => {
                  if (!searchQuery) setIsSearchOpen(false);
                }}
              />
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-mono uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
                <th className="p-5 w-[15%]">PLATFORM</th>
                <th className="p-5 w-[12%]">ACCOUNT</th>
                <th className="p-5 w-[12%]">BALANCE</th>
                <th className="p-5 w-[13%]">WEEK PROFIT LIMIT</th>
                <th className="p-5 w-[13%]">WEEK LOSS LIMIT</th>
                <th className="p-5 w-[12%]">DAILY PROFIT LIMIT</th>
                <th className="p-5 w-[12%]">DAILY LOSS LIMIT</th>
                <th className="p-5 w-[8%]">TRAILING DD</th>
                <th className="p-5 w-[5%] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConfigs.length > 0 ? (
                paginatedConfigs.map((row, i) => {
                  const wpColor = getValueColorClass(row.wpLimit, row.wpStatus);
                  const wlColor = getValueColorClass(row.wlLimit, row.wlStatus);
                  const dpColor = getValueColorClass(row.dpLimit, row.dpStatus);
                  const dlColor = getValueColorClass(row.dlLimit, row.dlStatus);

                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <td className="p-5 text-sm text-[#E5E5E5] font-medium group-hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-[#888888] shrink-0 group-hover:border-purple-500/30 overflow-hidden transition-all">
                            {row.connection?.broker === 'Tradovate' ? (
                              <img src="/broker-logo/tradovate.png" alt="Tradovate" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : row.connection?.broker === 'MT5' || row.connection?.broker === 'MetaTrader 5' ? (
                              <img src="/broker-logo/mt5.jpg" alt="MT5" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : row.connection?.broker === 'Rithmic' ? (
                              <img src="/broker-logo/rithimic.jpg" alt="Rithmic" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <Layers className="w-3.5 h-3.5" />
                            )}
                          </div>
                          {row.connection?.broker === 'MetaTrader 5' ? 'MT5' : (row.connection?.broker || "Unknown")}
                        </div>
                      </td>
                      <td className="p-5 text-sm text-[#888888] font-mono tracking-widest">{row.connection?.accountId || "Unknown"}</td>
                      <td className="p-5 text-sm font-mono text-emerald-400 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.connection?.equity || 0)}</td>
                      <td className="p-5 text-sm font-mono text-[13px]">
                        <div className="flex items-center">
                          <span className={wpColor}>$</span>
                          <input 
                            type="text" 
                            value={row.wpLimit} 
                            onChange={(e) => handleChangeLimit(row.id, 'wpLimit', e.target.value)}
                            className={`bg-transparent outline-none border-b border-dashed border-[#2C2C2E] focus:border-purple-500 w-[60px] pb-0.5 mr-2 ${wpColor}`}
                          />
                          <StatusBadge status={row.wpStatus} onClick={() => handleToggleLimit(row.id, 'wpStatus')} />
                        </div>
                      </td>
                      <td className="p-5 text-sm font-mono text-[13px]">
                        <div className="flex items-center">
                          <span className={wlColor}>$</span>
                          <input 
                            type="text" 
                            value={row.wlLimit} 
                            onChange={(e) => handleChangeLimit(row.id, 'wlLimit', e.target.value)}
                            className={`bg-transparent outline-none border-b border-dashed border-[#2C2C2E] focus:border-purple-500 w-[60px] pb-0.5 mr-2 ${wlColor}`}
                          />
                          <StatusBadge status={row.wlStatus} onClick={() => handleToggleLimit(row.id, 'wlStatus')} />
                        </div>
                      </td>
                      <td className="p-5 text-sm font-mono text-[13px]">
                        <div className="flex items-center">
                          <span className={dpColor}>$</span>
                          <input 
                            type="text" 
                            value={row.dpLimit} 
                            onChange={(e) => handleChangeLimit(row.id, 'dpLimit', e.target.value)}
                            className={`bg-transparent outline-none border-b border-dashed border-[#2C2C2E] focus:border-purple-500 w-[60px] pb-0.5 mr-2 ${dpColor}`}
                          />
                          <StatusBadge status={row.dpStatus} onClick={() => handleToggleLimit(row.id, 'dpStatus')} />
                        </div>
                      </td>
                      <td className="p-5 text-sm font-mono text-[13px]">
                        <div className="flex items-center">
                          <span className={dlColor}>$</span>
                          <input 
                            type="text" 
                            value={row.dlLimit} 
                            onChange={(e) => handleChangeLimit(row.id, 'dlLimit', e.target.value)}
                            className={`bg-transparent outline-none border-b border-dashed border-[#2C2C2E] focus:border-purple-500 w-[60px] pb-0.5 mr-2 ${dlColor}`}
                          />
                          <StatusBadge status={row.dlStatus} onClick={() => handleToggleLimit(row.id, 'dlStatus')} />
                        </div>
                      </td>
                      <td className="p-5 text-sm font-mono text-[13px] text-gray-400">
                        <input 
                          type="text" 
                          value={row.trailingDd}
                          onChange={(e) => handleChangeLimit(row.id, 'trailingDd', e.target.value)}
                          className="bg-transparent outline-none border-b border-dashed border-[#2C2C2E] focus:border-purple-500 w-[50px] pb-0.5 text-gray-400"
                        />
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleDeleteConfig(row.id)} 
                          className="p-2 hover:bg-rose-500/10 rounded-lg hover:text-rose-400 transition-all text-[#888888]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-[var(--color-text-secondary)]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#161618] border border-[#2C2C2E] flex items-center justify-center">
                        <Shield className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-white">No risk rules found</p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors mt-2 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add connections
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4 text-[10px] text-[#888888] font-mono tracking-widest uppercase">
            <span>Showing {paginatedConfigs.length} of {totalItems} accounts</span>
            <div className="flex items-center gap-2">
              <span>Show</span>
              <input 
                type="number"
                min="1"
                value={itemsPerPage || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setItemsPerPage(isNaN(val) ? 0 : Math.max(1, val));
                  setCurrentPage(1);
                }}
                className="bg-[#111113] border border-white/10 rounded-md px-2 py-1 text-white font-bold w-16 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#888888] font-mono">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                  currentPage === page 
                    ? "bg-purple-500 text-white" 
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <AddConnectionsModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddConnections} 
        connections={connections}
      />
    </div>
  );
}
