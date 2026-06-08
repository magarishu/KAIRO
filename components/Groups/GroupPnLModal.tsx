import React, { useEffect, useState } from 'react';
import { LayoutGrid, Eye, User, X, TrendingUp, TrendingDown, Building2, CreditCard } from 'lucide-react';
import { Group } from '@/types/group';

interface GroupPnLModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: any;
}

export function GroupPnLModal({ isOpen, onClose, group }: GroupPnLModalProps) {
  const [timeRange, setTimeRange] = useState("day");
  const [showBalance, setShowBalance] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }));
    }
  }, [isOpen]);

  if (!isOpen || !group) return null;

  const timeRangeLabel = {
    day: "Today's",
    week: "This Week's",
    month: "This Month's",
    year: "This Year's",
  }[timeRange] || "Today's";

  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const totalBalanceVal = (group.slaves || []).reduce((sum: number, s: any) => sum + (s.balance || 0), 0);
  const totalPnlVal = (group.slaves || []).reduce((sum: number, s: any) => sum + (s.pnl || 0), 0);
  const totalAccounts = group.slaves?.length || 0;
  const usernameStr = group.subtitle ? group.subtitle.split(' • ')[0] : "@master_account";

  const isPositive = totalPnlVal >= 0;
  const pnlColorClass = isPositive ? 'text-[#22C55E]' : 'text-rose-400';
  const pnlShadowClass = isPositive ? 'drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]' : 'drop-shadow-[0_0_25px_rgba(251,113,133,0.4)]';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const accountsData = (group.slaves || []).map((s: any) => ({
    name: s.name,
    platform: s.broker === 'MetaTrader 5' ? 'MT5' : s.broker || 'Unknown',
    pnl: s.pnl || 0,
  }));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full ${isDetailedView ? 'max-w-6xl' : 'max-w-3xl'} bg-[#121214] border border-[#2A2A2D] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2D] bg-[#16161A]">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-white">Group P&L Card</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDetailedView(!isDetailedView)}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${isDetailedView ? 'bg-[#B19DF7] text-black hover:bg-[#A38FF0]' : 'border border-[#2A2A2D] text-gray-400 hover:text-white'}`}
            >
              Detailed View
            </button>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className={`flex items-center gap-2 px-3 py-1.5 border text-xs rounded transition-colors ${showBalance ? 'border-[#B19DF7] text-[#B19DF7]' : 'border-[#2A2A2D] text-gray-400 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5" /> {showBalance ? 'Hide Balance' : 'Show Balance'}
            </button>
            <button 
              onClick={() => setShowUsername(!showUsername)}
              className={`flex items-center gap-2 px-3 py-1.5 border text-xs rounded transition-colors ${showUsername ? 'border-[#B19DF7] text-[#B19DF7]' : 'border-[#2A2A2D] text-gray-400 hover:text-white'}`}
            >
              <User className="w-3.5 h-3.5" /> {showUsername ? 'Hide Username' : 'Show Username'}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 border border-[#2A2A2D] text-gray-400 rounded hover:text-white hover:bg-white/5 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row min-h-[550px]">
          
          {/* Left Column (Main P&L) */}
          <div className="flex-1 p-8 relative flex flex-col overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-bl-xl">
              <video 
                src="/swordman.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-50 modal-video"
              />
              {/* Fade out edges so text remains readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-[#121214]/40 to-transparent"></div>
            </div>

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg border border-[#2A2A2D] flex items-center justify-center bg-black/50">
                  <User className="w-6 h-6 text-[#ffffff]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#ffffff] tracking-tight">{group.name}</h2>
                  <p className="text-xs text-[#ffffff] mt-1">Copy Trading Group</p>
                  <p className="text-xs text-[#ffffff] mt-0.5 tracking-widest">{showUsername ? usernameStr : '@**********'}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-[#ffffff] font-bold tracking-widest uppercase mb-1">Total Balance</p>
                <p className="text-xl font-bold text-[#ffffff] font-mono tracking-widest">{showBalance ? formatCurrency(totalBalanceVal) : '$***,***.**'}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-10 mt-12 mb-8">
              <p className="text-sm font-medium text-[#ffffff] mb-4">{timeRangeLabel} Group P&L</p>
              <div className="flex items-center gap-4">
                <h1 className={`text-6xl md:text-7xl font-bold ${pnlColorClass} tracking-tighter ${pnlShadowClass}`}>
                  {(isPositive ? "+" : "") + formatCurrency(totalPnlVal)}
                </h1>
                <TrendIcon className={`w-10 h-10 ${pnlColorClass}`} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Right Column (Accounts List) */}
          {isDetailedView && (
            <div className="w-full lg:w-[400px] border-l border-[#2A2A2D] flex flex-col bg-[#121214] animate-in slide-in-from-right-8 duration-300">
              <div className="p-5 border-b border-[#2A2A2D] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-200 tracking-wider">ACCOUNTS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#1A1A24] border border-[#2A2A2D] text-[10px] font-bold text-[#A38FF0]">
                    {totalAccounts} total
                  </span>
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-[#16161A] border border-[#2A2A2D] text-gray-300 text-xs rounded-md px-2 py-1 outline-none focus:border-[#7559B6] cursor-pointer"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[450px] custom-scrollbar">
                {accountsData.length > 0 ? accountsData.map((acc: any, idx: number) => {
                  const isAccPositive = acc.pnl >= 0;
                  return (
                    <div key={idx} className="bg-[#16161A] border border-[#2A2A2D] rounded-lg p-3">
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">{acc.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#1F1F24] flex items-center justify-center text-gray-400 border border-[#2A2A2D]">
                            {acc.platform === 'X' ? <X className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                          </div>
                          <span className="text-xs font-medium text-gray-300 uppercase">{acc.platform}</span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isAccPositive ? 'text-[#22C55E]' : 'text-rose-400'}`}>
                              {(isAccPositive ? "+" : "") + formatCurrency(acc.pnl)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500 py-10">
                    No slave accounts found.
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2A2D] bg-[#16161A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            Powered by 
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#2A2A2D] bg-[#121214] text-[#D0C1FF]">
              <LayoutGrid className="w-3 h-3" /> Kairo
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            {currentTime}
          </div>
        </div>
        
      </div>
    </div>
  );
}
