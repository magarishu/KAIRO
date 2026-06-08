import { DashboardMetrics } from "@/components/Dashboard/DashboardMetrics";
import { WelcomeBanner } from "@/components/Dashboard/WelcomeBanner";
import { TopGroupsTable } from "@/components/Dashboard/TopGroupsTable";
import { ExecutionStats } from "@/components/Dashboard/ExecutionStats";

import { getConnections } from "@/lib/actions/connections";
import { getGroups } from "@/lib/actions/groups";

export default async function Home() {
  const connections = await getConnections();
  const groups = await getGroups();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Dashboard</h1>
          <div className="h-[1px] w-12 bg-purple-500/50 mt-2 mb-4"></div>
          <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">System overview and performance metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="text-[10px] font-bold text-[#10b981] font-mono tracking-widest uppercase">Active Trader</span>
          </div>
        </div>
      </div>
      <DashboardMetrics connections={connections} groups={groups} />
      <WelcomeBanner />
      <TopGroupsTable groups={groups} />
      <ExecutionStats />
    </div>
  );
}
