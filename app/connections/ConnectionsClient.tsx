"use client";

import { Wallet, Link, Filter, RefreshCcw, Plus, Pencil, Unlink, Trash2, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ConnectAccountModal } from "@/components/Connections/ConnectAccountModal";
import { EditAccountModal } from "@/components/Connections/EditAccountModal";

import { createConnection, updateConnection, deleteConnection, syncConnection } from "@/lib/actions/connections";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ConnectionsClient({ initialConnections }: { initialConnections: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accounts = initialConnections;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const filteredAccounts = accounts.filter(acc => {
    const matchesStatus = filterStatus ? acc.status === filterStatus : true;
    const q = filterQuery.toLowerCase();
    const matchesQuery = !q || 
      acc.broker.toLowerCase().includes(q) || 
      acc.name.toLowerCase().includes(q) || 
      acc.accountId.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteConnection(id);
    });
  };

  const handleAddAccount = async (newAccount: any) => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          await createConnection({
            broker: newAccount.broker,
            name: newAccount.name,
            accountId: newAccount.id,
            password: newAccount.password,
            server: newAccount.server,
          });
          setIsModalOpen(false);
          router.refresh();
          resolve();
        } catch (error: any) {
          alert(error.message || "Failed to add account");
          reject(error);
        }
      });
    });
  };

  const handleUpdateAccount = (updatedAccount: any) => {
    startTransition(async () => {
      await updateConnection(updatedAccount.id, {
        name: updatedAccount.name,
        status: updatedAccount.status,
      });
      setEditingAccount(null);
    });
  };

  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSyncStatus = (id: string) => {
    setSyncingId(id);
    startTransition(async () => {
      try {
        await syncConnection(id);
      } catch (error) {
        console.error("Failed to sync connection:", error);
      } finally {
        setSyncingId(null);
      }
    });
  };

  const parseCurrency = (str: string) => parseFloat(str.replace(/[$,+]/g, '')) || 0;
  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const totalEquity = accounts.reduce((acc, curr) => acc + (typeof curr.equity === 'number' ? curr.equity : parseCurrency(curr.equity || "0")), 0);
  const formattedEquity = formatCurrency(totalEquity);
  const onlineAccountsCount = accounts.filter(a => a.status === "ONLINE").length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Active Connections</h1>
          <div className="h-[1px] w-12 bg-purple-500/50 mt-2 mb-4"></div>
          <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Manage and monitor all your linked broker accounts.</p>
        </div>

        <div className="flex items-center gap-4 text-[#888888]">
          <button className="hover:text-white transition-colors bg-[#0A0A0A] border border-white/5 p-2.5 rounded-lg"><RefreshCcw className="w-4 h-4" /></button>
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className={`transition-colors bg-[#0A0A0A] border border-white/5 p-2.5 rounded-lg ${isFilterOpen || filterStatus ? 'text-purple-400 border-purple-500/50' : 'hover:text-white'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-white/5">
                  <h3 className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">Search</h3>
                  <input 
                    type="text"
                    placeholder="Broker, Name, or ID..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full bg-[#111113] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-[#888888] focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  />
                </div>
                <div className="p-3 border-b border-white/5 bg-[#111113]">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Status</h3>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <button 
                    onClick={() => { setFilterStatus(null); setIsFilterOpen(false); }}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${!filterStatus ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    All Statuses
                  </button>
                  <button 
                    onClick={() => { setFilterStatus('ONLINE'); setIsFilterOpen(false); }}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${filterStatus === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Online
                  </button>
                  <button 
                    onClick={() => { setFilterStatus('OFFLINE'); setIsFilterOpen(false); }}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${filterStatus === 'OFFLINE' ? 'bg-rose-500/10 text-rose-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Offline
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-mono uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Total Equity</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-purple-500/10 transition-all">
              <Wallet className="w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{formattedEquity}</h3>
            <p className="text-xs text-[#888888]">
              {accounts.length > 0 ? (
                <><span className="text-purple-400 font-medium font-mono">LIVE</span> from {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</>
              ) : (
                "No active accounts"
              )}
            </p>
          </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Connections</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-blue-500/10 transition-all">
              <Link className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{accounts.length}</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono">Active</p>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-amber-500/10 transition-all">
              <Zap className="w-4 h-4 text-white/50 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{onlineAccountsCount} <span className="text-[#888888] font-normal text-xl">/ {accounts.length}</span></h3>
            <p className="text-xs text-[#888888] font-mono">
              {accounts.length > 0 ? `${((onlineAccountsCount / accounts.length) * 100).toFixed(1)}% UPTIME` : "NO ACTIVE"}
            </p>
          </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Broker</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Account Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Account ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Equity (USD)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-none hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black border border-white/10 rounded flex items-center justify-center overflow-hidden shrink-0">
                          {acc.broker === 'Tradovate' ? (
                            <img src="/broker-logo/tradovate.png" alt="Tradovate" className="w-full h-full object-cover opacity-80" />
                          ) : acc.broker === 'MT5' || acc.broker === 'MetaTrader 5' ? (
                            <img src="/broker-logo/mt5.jpg" alt="MT5" className="w-full h-full object-cover opacity-80" />
                          ) : acc.broker === 'Rithmic' ? (
                            <img src="/broker-logo/rithimic.jpg" alt="Rithmic" className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <span className={`text-[10px] font-black ${acc.iconColor || 'text-white'}`}>{acc.icon || 'B'}</span>
                          )}
                        </div>
                        <span className="text-[#E5E5E5] font-medium group-hover:text-white transition-colors">{acc.broker === 'MetaTrader 5' ? 'MT5' : acc.broker}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#A3A3A3] font-medium">{acc.name}</td>
                    <td className="px-6 py-5 text-sm text-[#888888] font-mono tracking-widest">{acc.accountId}</td>
                    <td className="px-6 py-5 text-sm font-black text-white font-mono">{formatCurrency(acc.equity)}</td>
                    <td className="px-6 py-5 text-sm">
                      {acc.status === "ONLINE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> ONLINE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#888888] text-[10px] font-bold tracking-widest font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#888888]"></span> OFFLINE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 text-[#888888]">
                        <button onClick={() => setEditingAccount(acc)} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleSyncStatus(acc.id)} 
                          className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-all disabled:opacity-50"
                          disabled={syncingId === acc.id}
                          title="Refresh connection status"
                        >
                          <RefreshCcw className={`w-4 h-4 ${syncingId === acc.id ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => handleDelete(acc.id)} className="p-2 hover:bg-rose-500/10 rounded-lg hover:text-rose-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-12 h-12 rounded-full bg-[#161618] border border-[#2C2C2E] flex items-center justify-center mb-3">
                        <Link className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-white mb-2">No connections found</p>
                      <p className="text-xs text-gray-500 mb-4">You haven't added any broker connections yet.</p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add connection
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-white/5 text-[10px] text-[#888888] font-mono uppercase tracking-widest bg-white/[0.01]">
          Showing {filteredAccounts.length} of {accounts.length} linked accounts.
        </div>
      </div>

      <ConnectAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleAddAccount}
      />

      <EditAccountModal 
        isOpen={!!editingAccount} 
        onClose={() => setEditingAccount(null)} 
        onUpdate={handleUpdateAccount}
        account={editingAccount}
      />
    </div>
  );
}
