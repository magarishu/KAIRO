import { BarChart2 } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 h-[80vh] flex flex-col">
      <div className="glass-panel rounded-2xl p-8 border-[var(--color-border-active)] flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <BarChart2 className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-widest mb-4">REPORTS</h1>
        <p className="text-[var(--color-text-secondary)] max-w-md">Detailed execution reporting and analytics will be available here.</p>
      </div>
    </div>
  );
}
