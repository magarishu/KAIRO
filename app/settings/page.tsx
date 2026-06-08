"use client";

import { User, Lock, Key, Settings2, CreditCard } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProfileTab } from "@/components/Settings/ProfileTab";
import { SecurityTab } from "@/components/Settings/SecurityTab";
import { BillingTab } from "@/components/Settings/BillingTab";

function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  
  const [activeTab, setActiveTab] = useState(() => {
    if (["profile", "security", "billing"].includes(defaultTab)) return defaultTab;
    return "profile";
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row min-h-[800px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-[280px] shrink-0 border-r border-white/5 pr-0">
          <div className="px-6 mb-8">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Settings</h1>
            <div className="h-[1px] w-12 bg-purple-500/50 mt-2"></div>
          </div>
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest font-mono transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-purple-500/10 text-white border-r-[3px] border-purple-500 shadow-[inset_4px_0_0_0_rgba(168,85,247,0.2)]" 
                    : "text-[#888888] hover:text-white hover:bg-white/5 border-r-[3px] border-transparent"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 min-w-0 pl-0 md:pl-10 pt-2">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "billing" && <BillingTab />}
        </div>
      </div>

    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[800px]"><div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div></div>}>
      <SettingsContent />
    </Suspense>
  );
}
