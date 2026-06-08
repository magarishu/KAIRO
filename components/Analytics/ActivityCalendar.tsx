"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, MousePointerClick, TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export function ActivityCalendar({ monthIdx = 9, year = 2023 }: { monthIdx?: number, year?: number }) {
  const [hoveredDate, setHoveredDate] = useState<any>(null);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(monthIdx);
  const [currentYear, setCurrentYear] = useState(year);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentMonthIdx(monthIdx);
    setCurrentYear(year);
  }, [monthIdx, year]);

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  
  // Compute actual calendar days
  const getCalendarDays = (month: number, year: number) => {
    // day 1 of the month
    const firstDay = new Date(year, month, 1);
    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    let startDayOfWeek = firstDay.getDay(); 
    // We want Monday = 0, Sunday = 6
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // We need exactly 35 cells (5 weeks * 7 days)
    // If the month requires 6 weeks (e.g. starts on Sunday and has 31 days), we will just show 35 cells to keep the UI fixed, or we can expand to 42.
    // The current UI grid is fixed to 5 weeks. Let's see if 35 is enough. Usually it is, but sometimes 42 is needed.
    // Actually, to keep it simple and fit the exact layout of 5 rows, we will generate 35 items.
    
    const calendarDates = [];
    
    // Previous month's trailing days
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDates.unshift({
        d: daysInPrevMonth - i,
        type: "neutral",
        opacity: "opacity-40",
        pnl: "$0.00",
        trades: 0,
        isCurrentMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDates.push({
        d: i,
        type: "neutral",
        opacity: "",
        pnl: "$0.00",
        trades: 0,
        isCurrentMonth: true
      });
    }
    
    // Next month's leading days to fill 35 or 42 grid
    const totalCells = calendarDates.length > 35 ? 42 : 35;
    let nextMonthDay = 1;
    while (calendarDates.length < totalCells) {
      calendarDates.push({
        d: nextMonthDay++,
        type: "neutral",
        opacity: "opacity-40",
        pnl: "$0.00",
        trades: 0,
        isCurrentMonth: false
      });
    }
    
    return calendarDates;
  };

  const dates = getCalendarDays(currentMonthIdx, currentYear);
  const totalWeeks = dates.length / 7;

  const weeks = Array.from({ length: totalWeeks }, (_, i) => ({
    d: `Week ${i + 1}`,
    type: "neutral",
    pnl: "$0.00",
    trades: 0,
    isWeek: true
  }));

  const handlePrevMonth = () => {
    setCurrentMonthIdx((prev) => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthIdx((prev) => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Calendar Card */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex-1 flex flex-col relative shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-sm font-bold text-white">Activity Calendar</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 relative" ref={pickerRef}>
            <button onClick={handlePrevMonth} className="hover:bg-white/10 p-1 rounded transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
            </button>
            
            <button 
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="hover:text-white transition-colors min-w-[70px] text-center font-mono tracking-widest uppercase text-[10px]"
            >
              {MONTHS[currentMonthIdx]} {currentYear}
            </button>
            
            <button onClick={handleNextMonth} className="hover:bg-white/10 p-1 rounded transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
            </button>

            {/* Month Picker Dropdown */}
            {showMonthPicker && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                
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

        {/* Days Header */}
        <div className="grid grid-cols-8 gap-2 mb-3">
          {days.map((day, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-gray-500">{day}</div>
          ))}
          <div></div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-8 gap-2 relative z-10">
          {dates.map((date, i) => {
            let bgClass = "bg-[#111113] border-white/5 text-[#888888] hover:border-white/20";
            if (date.type === "profit") bgClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20";
            if (date.type === "loss") bgClass = "bg-rose-500/10 border-rose-500/50 text-rose-400 hover:bg-rose-500/20";
            
            const weekIndex = Math.floor(i/7);
            const weekLabel = (i % 7 === 6) ? (
              <div 
                className="flex items-center justify-center text-[9px] text-gray-600 font-bold hover:text-white cursor-pointer transition-colors"
                onMouseEnter={() => setHoveredDate(weeks[weekIndex])}
                onMouseLeave={() => setHoveredDate(null)}
              >
                W{weekIndex+1}
              </div>
            ) : null;

            return (
              <React.Fragment key={i}>
                <div 
                  className={`aspect-square rounded border flex items-center justify-center text-[11px] font-semibold cursor-pointer transition-colors ${bgClass} ${date.opacity || ''}`}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {date.d}
                </div>
                {weekLabel}
              </React.Fragment>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between px-2 text-[10px] font-semibold text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500/50"></div> Profit</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-rose-500/50"></div> Loss</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-[#2C2C2E]"></div> Neutral</div>
        </div>
      </div>

      {/* Info Card below calendar */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-[100px] flex flex-col items-center justify-center text-center transition-colors group shadow-2xl">
        {hoveredDate ? (
          <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
              {hoveredDate.isWeek ? MONTHS[currentMonthIdx] : `${MONTHS[currentMonthIdx]} ${hoveredDate.d}, ${currentYear}`}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {hoveredDate.type === "profit" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : hoveredDate.type === "loss" ? (
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-500" />
                )}
                <span className={`text-lg font-bold ${
                  hoveredDate.type === "profit" ? "text-emerald-500" : 
                  hoveredDate.type === "loss" ? "text-rose-500" : "text-gray-400"
                }`}>
                  {hoveredDate.pnl}
                </span>
              </div>
              <div className="w-[1px] h-6 bg-[#2C2C2E]"></div>
              <div className="text-left">
                <p className="text-[10px] text-[#888888] font-bold font-mono tracking-widest uppercase">Trades</p>
                <p className="text-lg text-white font-black tracking-tight">{hoveredDate.trades}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 cursor-pointer">
            <MousePointerClick className="w-5 h-5 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
            <p className="text-[11px] font-medium">Hover over a date or week to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
