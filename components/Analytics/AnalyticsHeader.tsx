"use client";

import { ChevronDown, FileText, Loader2, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGroups } from "@/context/GroupContext";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

interface AnalyticsHeaderProps {
  connections?: any[];
  onAnalysisChange?: (type: "group" | "connection", entityName: string) => void;
  onDateChange?: (monthIdx: number, year: number) => void;
}

export function AnalyticsHeader({ connections = [], onAnalysisChange, onDateChange }: AnalyticsHeaderProps) {
  const { groups } = useGroups();
  const [activeEntity, setActiveEntity] = useState("Overview");
  const [tempGroup, setTempGroup] = useState("");
  const [tempConnection, setTempConnection] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [currentMonthIdx, setCurrentMonthIdx] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAccounts = connections.filter(acc => 
    acc.name.toLowerCase().includes(tempConnection.toLowerCase()) || 
    acc.id.toLowerCase().includes(tempConnection.toLowerCase())
  );

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-20 shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Left: Selected Group Name */}
      <div className="flex flex-col relative z-10">
        <h2 className="text-3xl font-black text-white tracking-tight">{activeEntity}</h2>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-1">Performance overview and trade analytics</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Filters Dropdown */}
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest font-mono transition-all ${
              isFilterOpen 
                ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                : 'bg-white/5 border-white/10 text-[#888888] hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 z-50">
              
              {/* Groups Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Group</label>
                <div className="relative">
                  <select 
                    value={tempGroup}
                    onChange={(e) => {
                      setTempGroup(e.target.value);
                      setTempConnection("");
                    }}
                    className="w-full bg-[#111113] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-xs font-bold text-white font-mono appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="" disabled className="text-gray-500">Select Group...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Search Individual */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Search Connections</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={tempConnection}
                    onChange={(e) => {
                      setTempConnection(e.target.value);
                      setTempGroup("");
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-[#111113] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs font-bold text-white font-mono focus:outline-none focus:border-purple-500 transition-colors placeholder:text-[#888888]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && tempConnection.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map(acc => (
                          <div 
                            key={acc.id}
                            className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                            onClick={() => {
                              setTempConnection(acc.name);
                              setTempGroup("");
                              setShowSuggestions(false);
                            }}
                          >
                            <p className="text-[11px] font-bold text-white uppercase tracking-widest">{acc.name}</p>
                            <p className="text-[10px] text-[#888888] font-mono mt-1">{acc.id} • {acc.broker === 'MetaTrader 5' ? 'MT5' : acc.broker}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-gray-500 text-center">
                          No matching connections found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-2">Date</label>
                <div className="relative flex items-center justify-between bg-[#111113] border border-white/10 rounded-lg px-3 py-2" ref={monthPickerRef}>
                  
                  <button 
                    onClick={() => {
                      setCurrentMonthIdx((prev) => {
                        if (prev === 0) {
                          setCurrentYear(y => y - 1);
                          return 11;
                        }
                        return prev - 1;
                      });
                    }} 
                    className="hover:bg-white/10 p-1 rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500 hover:text-white" />
                  </button>
                  
                  <button 
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className="text-xs font-bold text-white hover:text-purple-400 transition-colors min-w-[70px] text-center font-mono uppercase tracking-widest"
                  >
                    {MONTHS[currentMonthIdx]} {currentYear}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setCurrentMonthIdx((prev) => {
                        if (prev === 11) {
                          setCurrentYear(y => y + 1);
                          return 0;
                        }
                        return prev + 1;
                      });
                    }} 
                    className="hover:bg-white/10 p-1 rounded transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500 hover:text-white" />
                  </button>

                  {/* Month Picker Dropdown */}
                  {showMonthPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      
                      {/* Year Selector */}
                      <div className="flex justify-between items-center mb-3 px-2 border-b border-white/10 pb-3">
                        <button onClick={() => setCurrentYear(y => y - 1)} className="hover:bg-white/10 p-1 rounded transition-colors">
                          <ChevronLeft className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <span className="text-[10px] font-bold text-gray-300">{currentYear}</span>
                        <button onClick={() => setCurrentYear(y => y + 1)} className="hover:bg-white/10 p-1 rounded transition-colors">
                          <ChevronRight className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        {MONTHS.map((m, idx) => (
                          <button
                            key={m}
                            onClick={() => {
                              setCurrentMonthIdx(idx);
                              setShowMonthPicker(false);
                            }}
                            className={`py-2 px-1 text-[10px] rounded-md transition-colors ${
                              idx === currentMonthIdx 
                                ? "bg-purple-500/20 text-purple-400 font-bold" 
                                : "text-gray-400 hover:bg-[#2C2C2E] hover:text-white"
                            }`}
                          >
                            {m.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analyse Button */}
              <button 
                onClick={() => {
                  if (tempGroup) {
                    setActiveEntity(tempGroup);
                    onAnalysisChange?.("group", tempGroup);
                  } else if (tempConnection) {
                    setActiveEntity(tempConnection);
                    onAnalysisChange?.("connection", tempConnection);
                  }

                  onDateChange?.(currentMonthIdx, currentYear);

                  setIsFilterOpen(false);
                }}
                disabled={!tempGroup && !tempConnection}
                className="w-full bg-white/5 border border-white/10 text-white font-bold text-[10px] font-mono tracking-widest uppercase py-3 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyse
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
