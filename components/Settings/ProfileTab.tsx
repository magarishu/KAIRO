import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

export function ProfileTab() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // Read existing preferences from Clerk's unsafeMetadata, or default
  const [timezone, setTimezone] = useState((user?.unsafeMetadata?.timezone as string) || "utc");
  const [currency, setCurrency] = useState((user?.unsafeMetadata?.currency as string) || "usd");

  if (!isLoaded || !user) return <div className="text-gray-400">Loading profile...</div>;

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          timezone,
          currency
        }
      });
      setMessage("Preferences updated successfully!");
    } catch (err: any) {
      setMessage("Failed to update preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-3xl font-black text-white tracking-tight">Profile & Preferences</h2>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-2">Manage your account details and local settings.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Details */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[11px] font-bold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
              <User className="w-4 h-4 text-purple-400" />
              Account Details
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">First Name</span>
              <p className="text-lg font-black text-white">{user.firstName || "-"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Last Name</span>
              <p className="text-lg font-black text-white">{user.lastName || "-"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Username</span>
              <p className="text-lg font-black text-white">{user.username || "-"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">Email Address</span>
              <p className="text-lg font-black text-white">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold text-white mb-6 uppercase tracking-widest font-mono border-b border-white/5 pb-4">Display Preferences</h3>
            {message && (
              <div className={`p-3 mb-4 rounded-md text-sm font-medium ${message.includes("success") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {message}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-3">Default Timezone</label>
                <div className="relative">
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 text-xs font-bold font-mono text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                  >
                    <option value="pst">(UTC-08:00) Pacific Time</option>
                    <option value="est">(UTC-05:00) Eastern Time</option>
                    <option value="utc">(UTC+00:00) Coordinated Universal Time</option>
                    <option value="ist">(UTC+05:30) Indian Standard Time</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-3">Base Display Currency</label>
                <div className="relative">
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 text-xs font-bold font-mono text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                  >
                    <option value="usd">USD ($) - US Dollar</option>
                    <option value="eur">EUR (€) - Euro</option>
                    <option value="gbp">GBP (£) - British Pound</option>
                    <option value="inr">INR (₹) - Indian Rupee</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-white/5 relative z-10">
            <button 
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase transition-colors w-full sm:w-auto flex items-center justify-center min-w-[160px] disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-[#111113]/20 border-t-[#111113] rounded-full animate-spin" />
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
