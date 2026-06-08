"use client";

import { Filter, Plus, ChevronDown, ChevronRight, Eye, Edit2, Trash2, Rocket, Shield, Landmark, RefreshCcw, Search } from "lucide-react";
import React, { useState } from "react";
import { CreateGroupModal } from "@/components/Groups/CreateGroupModal";
import { GroupPnLModal } from "@/components/Groups/GroupPnLModal";
import { EditGroupModal } from "@/components/Groups/EditGroupModal";
import { EditSlaveModal } from "@/components/Groups/EditSlaveModal";
import { Group, SlaveAccount } from "@/types/group";
import { createGroup, updateGroup, deleteGroup, updateSlave, deleteSlave } from "@/lib/actions/groups";
import { useTransition } from "react";
import { useGroups } from "@/context/GroupContext";

export default function GroupsClient({ initialGroups, connections }: { initialGroups: any[], connections: any[] }) {
  const [isPending, startTransition] = useTransition();
  const { refreshGroups } = useGroups();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pnlModalGroup, setPnlModalGroup] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const groups = initialGroups;

  // Determine which connections are already used in existing groups
  const usedConnectionIds = new Set<string>();
  groups.forEach(g => {
    if (g.accountId) usedConnectionIds.add(g.accountId);
    if (g.slaves) {
      g.slaves.forEach((s: any) => {
        if (s.accountId) usedConnectionIds.add(s.accountId);
      });
    }
  });

  // Filter out used connections so they cannot be reused in new groups
  const availableConnections = connections.filter(c => !usedConnectionIds.has(c.accountId));

  const getPnLColor = (pnlValue: string) => {
    const value = parseFloat(pnlValue?.replace(/[$,+]/g, '') || "0");
    return value >= 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    );
  };

  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [editingSlaveData, setEditingSlaveData] = useState<{groupId: string, slaveIndex: number, slave: any} | null>(null);

  const handleCreateGroup = (name: string, masterId: string, slaveIds: string[]) => {
    startTransition(async () => {
      const master = connections.find(c => c.id === masterId);
      await createGroup({
        name,
        accountId: master?.accountId || "Unknown",
        subtitle: `${master?.name || 'Master'} • Created Today`,
        slaves: slaveIds.map((sId, i) => {
          const c = connections.find(c => c.id === sId);
          return {
            name: c ? c.name : `Slave ${i+1}`,
            accountId: c ? c.accountId : sId,
            broker: c ? (c.broker === 'MetaTrader 5' ? 'MT5' : c.broker) : "Pending Connection"
          };
        })
      });
      refreshGroups();
      setIsCreateModalOpen(false);
    });
  };

  const handleDeleteGroup = (id: string) => {
    startTransition(async () => {
      await deleteGroup(id);
      refreshGroups();
    });
  };

  const handleUpdateGroup = (name: string, master: string, slaves: string[]) => {
    if (!editingGroup) return;
    startTransition(async () => {
      await updateGroup(editingGroup.id, {
        name,
        subtitle: `${master} • Edited`
      });
      refreshGroups();
      setEditingGroup(null);
    });
  };

  const handleDeleteSlave = (groupId: string, slaveIndex: number) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const slaveId = group.slaves[slaveIndex]?.id;
    if (!slaveId) return;
    
    startTransition(async () => {
      await deleteSlave(slaveId);
      refreshGroups();
    });
  };

  const handleUpdateSlave = (updatedSlave: any) => {
    if (!editingSlaveData) return;
    startTransition(async () => {
      await updateSlave(updatedSlave.id, {
        name: updatedSlave.name,
        multiplier: updatedSlave.multiplier,
        copySl: updatedSlave.copySl,
        copyTp: updatedSlave.copyTp
      });
      refreshGroups();
      setEditingSlaveData(null);
    });
  };

  const parseCurrency = (str: string) => parseFloat(str?.replace(/[$,+]/g, '') || "0");
  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const totalGroups = groups.length;
  const totalAccounts = groups.reduce((acc, g) => acc + 1 + (g.slaves?.length || 0), 0);
  const totalCapital = groups.reduce((acc, g) => acc + (g.slaves || []).reduce((sum: number, s: any) => sum + (s.balance || 0), 0), 0);
  const totalPnl = groups.reduce((acc, g) => acc + (g.slaves || []).reduce((sum: number, s: any) => sum + (s.pnl || 0), 0), 0);

  const formattedCapital = formatCurrency(totalCapital);
  const formattedPnl = (totalPnl >= 0 ? '+' : '') + formatCurrency(totalPnl);
  const pnlColorClass = totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400';

  const filteredGroups = groups.filter(g => 
    !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateGroup}
        connections={availableConnections}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        group={editingGroup}
        onUpdate={handleUpdateGroup}
        connections={connections.filter(c => 
          !usedConnectionIds.has(c.accountId) || c.accountId === editingGroup?.accountId
        )}
      />

      {/* Edit Slave Modal */}
      <EditSlaveModal
        isOpen={!!editingSlaveData}
        onClose={() => setEditingSlaveData(null)}
        slave={editingSlaveData?.slave || null}
        onUpdate={handleUpdateSlave}
      />

      {/* Group PnL Modal */}
      <GroupPnLModal 
        isOpen={!!pnlModalGroup}
        onClose={() => setPnlModalGroup(null)}
        group={pnlModalGroup}
      />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Copy Trading Groups</h1>
          <div className="h-[1px] w-12 bg-purple-500/50 mt-2 mb-4"></div>
          <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Manage master accounts and their associated slaves</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="hidden md:flex p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#888888] hover:text-white hover:bg-white/10 transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>

          {isSearchOpen ? (
            <div className="flex items-center bg-[#0A0A0A] border border-purple-500/50 rounded-lg px-3 py-2 w-64 transition-all animate-in fade-in slide-in-from-right-2">
              <Search className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
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
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg text-sm font-bold transition-all uppercase tracking-widest font-mono"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono mb-4">Capital Managed</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{formattedCapital}</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono mb-4">Daily P&L</p>
          <h3 className={`text-3xl font-black tracking-tight ${pnlColorClass}`}>{formattedPnl}</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono mb-4">Groups</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{totalGroups}</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#111113] hover:border-white/10 transition-all duration-300">
          <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest font-mono mb-4">Accounts</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{totalAccounts}</h3>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-[1000px] flex flex-col">
            {/* Header Row */}
            <div className="grid grid-cols-12 border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
              <div className="col-span-3 py-5 pl-14 font-medium">Group Name</div>
              <div className="col-span-2 py-5 font-medium text-center">Master ID</div>
              <div className="col-span-2 py-5 font-medium text-center">Accounts</div>
              <div className="col-span-2 py-5 font-medium text-center">Total Balance</div>
              <div className="col-span-2 py-5 font-medium text-center">Unrealized P&L</div>
              <div className="col-span-1 py-5 font-medium text-center">Actions</div>
            </div>

            {/* Body */}
            <div className="flex flex-col">
              {filteredGroups.length > 0 ? (
                filteredGroups.map(g => {
                  const isOpen = expandedGroups.includes(g.id);
                  return (
                    <React.Fragment key={g.id}>
                      {/* Master Row */}
                      <div 
                        onClick={() => toggleGroup(g.id)}
                        className="grid grid-cols-12 items-center border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      >
                        <div className="col-span-3 py-5 pl-14 text-sm">
                          <div className="flex items-center gap-4">
                            <button className="text-[#888888] group-hover:text-white transition-colors">
                              {isOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                            </button>
                            <div className="truncate pr-4">
                              <p className="text-lg text-white font-black tracking-tight truncate">{g.name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 py-5 flex flex-col justify-center items-center text-sm text-[#888888] font-mono tracking-widest text-center">
                          {g.accountId || "N/A"}
                        </div>
                        <div className="col-span-2 py-5 text-sm text-white text-center font-mono">{g.slaves?.length || 0}</div>
                        <div className="col-span-2 py-5 text-sm font-black text-white text-center font-mono">{formatCurrency((g.slaves || []).reduce((sum: number, s: any) => sum + (s.balance || 0), 0))}</div>
                        <div className={`col-span-2 py-5 text-sm font-black font-mono ${getPnLColor(((g.slaves || []).reduce((sum: number, s: any) => sum + (s.pnl || 0), 0)).toString())} text-center`}>{formatCurrency((g.slaves || []).reduce((sum: number, s: any) => sum + (s.pnl || 0), 0))}</div>
                        <div className="col-span-1 py-5 text-center flex items-center justify-center">
                          <div className="flex items-center gap-3 text-[#888888]">
                            <button onClick={(e) => { e.stopPropagation(); setPnlModalGroup(g); }} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setEditingGroup(g); }} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }} className="p-2 hover:bg-rose-500/10 rounded-lg hover:text-rose-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Row (Slaves) */}
                      {isOpen && g.slaves.length > 0 && (
                        <div className="border-b border-white/5 bg-black/40">
                          <div className="relative py-6">
                            {/* Accent Line absolutely positioned */}
                            <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-purple-500/50 rounded-full"></div>
                            
                            <div className="w-full pb-2">
                              <p className="text-[10px] font-bold text-[#888888] font-mono mb-5 tracking-widest pl-14 uppercase">Slave Accounts ({g.slaves.length})</p>
                              
                              <div className="flex flex-col w-full">
                                {/* Slave Header */}
                                <div className="grid grid-cols-12 border-b border-white/5 text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
                                  <div className="col-span-3 pb-3 pl-14 font-medium">Account Name</div>
                                  <div className="col-span-2 pb-3 font-medium text-center">Account ID</div>
                                  <div className="col-span-2 pb-3 font-medium text-center">Broker</div>
                                  <div className="col-span-2 pb-3 font-medium text-center">Balance</div>
                                  <div className="col-span-2 pb-3 font-medium text-center">Daily P&L</div>
                                  <div className="col-span-1 pb-3 font-medium text-center">Actions</div>
                                </div>
                                
                                {/* Slave Body */}
                                <div className="flex flex-col">
                                  {g.slaves.map((slave: any, i: number) => (
                                    <div key={i} className="grid grid-cols-12 items-center border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                      <div className="col-span-3 py-4 pl-14 text-sm text-[#E5E5E5] font-medium truncate pr-4">{slave.name}</div>
                                      <div className="col-span-2 py-4 text-sm text-[#888888] font-mono tracking-widest truncate text-center">{slave.accountId || "N/A"}</div>
                                      <div className="col-span-2 py-4 text-sm text-[#888888] font-mono tracking-widest uppercase truncate px-2 text-center">{slave.broker === 'MetaTrader 5' ? 'MT5' : slave.broker}</div>
                                      <div className="col-span-2 py-4 text-sm font-black text-white font-mono truncate text-center">{formatCurrency(slave.balance || 0)}</div>
                                      <div className={`col-span-2 py-4 text-sm font-black font-mono ${slave.pnl ? getPnLColor(slave.pnl.toString()) : 'text-[#888888]'} truncate text-center`}>{slave.pnl ? formatCurrency(slave.pnl) : "$0.00"}</div>
                                      <div className="col-span-1 py-4 text-center flex items-center justify-center">
                                        <div className="flex items-center gap-3 text-[#888888]">
                                          <button onClick={(e) => { e.stopPropagation(); setEditingSlaveData({ groupId: g.id, slaveIndex: i, slave }); }} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSlave(g.id, i); }} className="p-2 hover:bg-rose-500/10 rounded-lg hover:text-rose-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-12 h-12 rounded-full bg-[#161618] border border-[#2C2C2E] flex items-center justify-center mb-3">
                    <Rocket className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-white mb-2">No groups found</p>
                  <p className="text-xs text-gray-500 mb-4">You haven't created any copy trading groups yet.</p>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Group
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
