import { CreditCard, Zap, CheckCircle2, FileText, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserSubscription } from "@/lib/actions/billing";

export function BillingTab() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscription, setSubscription] = useState<{tier: string, status: string} | null>(null);

  useEffect(() => {
    async function fetchSub() {
      const sub = await getUserSubscription();
      setSubscription(sub);
    }
    fetchSub();
  }, []);

  const handleAddPaymentMethod = async () => {
    // As requested: Razorpay shouldn't open from here. Payment methods should be added when upgrading a plan.
    alert("Please upgrade or purchase a plan to add a payment method.");
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
        
        <div className="pb-4 border-b border-white/5">
          <h2 className="text-3xl font-black text-white tracking-tight">Billing & Plan</h2>
          <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-2">Manage your subscription, payment methods, and billing history.</p>
        </div>

        <div className="space-y-6">
          
          {/* Current Plan */}
          {!subscription ? (
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 flex items-center justify-center shadow-2xl relative overflow-hidden h-[300px]">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : subscription.tier === "FREE" || subscription.status === "INACTIVE" ? (
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 relative z-10">
                <Zap className="w-10 h-10 text-white/30" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10 tracking-tight">No Active Plan</h3>
              <p className="text-[11px] font-bold text-[#888888] font-mono uppercase tracking-widest max-w-md mb-8 relative z-10 leading-relaxed">
                You are currently on the free tier. Upgrade your plan to manage unlimited master accounts, add slave accounts, and access premium tools.
              </p>
              <Link href="/billing" className="relative z-10">
                <button className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all flex items-center gap-3">
                  View Plans <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute top-8 right-8 pointer-events-none opacity-[0.03]">
                <Zap className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{subscription.tier} Trader Plan</h3>
                    <span className="px-3 py-1 rounded-md text-[9px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 font-mono tracking-widest uppercase">{subscription.status}</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-8 max-w-sm leading-relaxed">
                    You are on the {subscription.tier} plan. You have access to {
                      subscription.tier === "BASIC" ? "up to 10 slave accounts" :
                      subscription.tier === "PRO" ? "up to 50 slave accounts" :
                      "up to 120 slave accounts"
                    } and premium execution.
                  </p>
                  
                  <div className="flex items-center gap-3 text-[11px] font-bold font-mono tracking-widest uppercase text-white mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
                    {
                      subscription.tier === "BASIC" ? "10 active slave accounts" :
                      subscription.tier === "PRO" ? "50 active slave accounts" :
                      "120 active slave accounts"
                    }
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold font-mono tracking-widest uppercase text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated IP routing
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-start md:items-end gap-6">
                  <div className="text-left md:text-right">
                    <p className="text-5xl font-black text-white tracking-tighter">
                      ${subscription.tier === "BASIC" ? "199" : subscription.tier === "PRO" ? "999" : "2399"}
                      <span className="text-sm text-[#888888] font-mono tracking-widest uppercase ml-1">/mo</span>
                    </p>
                    <p className="text-[10px] font-bold font-mono tracking-widest uppercase text-emerald-500 mt-2">Active Subscription</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all">
                      Cancel Plan
                    </button>
                    <Link href="/billing">
                      <button className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all w-full md:w-auto">
                        Upgrade Plan
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-[11px] font-bold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
                <CreditCard className="w-4 h-4 text-purple-400" />
                Payment Method
              </h3>
              <button 
                onClick={handleAddPaymentMethod}
                disabled={isProcessing}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 font-mono tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Add New"}
              </button>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div key={method.id} className={`flex items-center justify-between p-5 rounded-xl transition-all ${method.isDefault ? "border border-purple-500/30 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "border border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-9 bg-white rounded-md flex items-center justify-center shrink-0">
                        <span className="text-[#0A0A0A] font-black italic tracking-tighter text-[10px] uppercase">
                          {method.brand}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{method.brand} ending in {method.last4}</p>
                        <p className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#888888] mt-1">Expires {method.exp}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-md font-mono tracking-widest uppercase">Default</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[11px] font-bold font-mono tracking-widest uppercase text-[#888888]">
                  No payment methods added. Upgrade your plan to add a method.
                </div>
              )}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-[11px] font-bold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
                <FileText className="w-4 h-4 text-purple-400" />
                Billing History
              </h3>
            </div>
            <div className="relative z-10 w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
                    <th className="p-6">Date</th>
                    <th className="p-6">Description</th>
                    <th className="p-6">Amount</th>
                    <th className="p-6 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">
                      No billing history available yet. 
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
