"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { AnalyticsHeader } from "@/components/Analytics/AnalyticsHeader";
import { AnalyticsMetrics } from "@/components/Analytics/AnalyticsMetrics";
import { EquityChart } from "@/components/Analytics/EquityChart";
import { ActivityCalendar } from "@/components/Analytics/ActivityCalendar";
import { WinLossCards } from "@/components/Analytics/WinLossCards";
import { SlavePerformanceTable, TradeHistoryTable } from "@/components/Analytics/PerformanceTables";

export default function AnalyticsClient({ connections }: { connections: any[] }) {
  const [analysisType, setAnalysisType] = useState<"group" | "connection" | null>(null);
  const [activeEntityName, setActiveEntityName] = useState<string>("");
  const [calendarMonthIdx, setCalendarMonthIdx] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Main Title Header (without bell/user as requested) */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Analytics</h1>
        <div className="h-[1px] w-12 bg-purple-500/50 mt-2"></div>
      </div>

      <AnalyticsHeader 
        connections={connections}
        onAnalysisChange={(type, name) => {
          setAnalysisType(type);
          setActiveEntityName(name);
        }} 
        onDateChange={(idx, year) => {
          setCalendarMonthIdx(idx);
          setCalendarYear(year);
        }}
      />
      {activeEntityName ? (
        <>
          <AnalyticsMetrics connection={connections.find(c => c.name === activeEntityName || c.accountId === activeEntityName)} />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <EquityChart />
              <WinLossCards />
            </div>
            <div className="col-span-1">
              <ActivityCalendar monthIdx={calendarMonthIdx} year={calendarYear} />
            </div>
          </div>

          {analysisType === "group" && (
            <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <SlavePerformanceTable groupName={activeEntityName} />
            </div>
          )}
          <TradeHistoryTable />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Filter className="w-12 h-12 mb-4 opacity-20 text-white" />
          <p className="text-[11px] font-bold tracking-widest font-mono uppercase text-[#888888]">Please select a Group or Connection from the filters to view analytics.</p>
        </div>
      )}

    </div>
  );
}
