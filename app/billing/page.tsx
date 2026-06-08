"use client";

import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { createRazorpayOrder, verifyPayment } from "@/lib/actions/billing";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      // 1. Create order on server
      const res = await createRazorpayOrder(planName, isAnnual);
      if (!res.success) {
        alert("Failed to initiate checkout: " + res.error);
        setLoadingPlan(null);
        return;
      }

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: res.amount,
        currency: res.currency,
        name: "Kairo Analytics",
        description: `${planName} Subscription`,
        order_id: res.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            planName
          );

          if (verifyRes.success) {
            alert(`Successfully upgraded to ${planName}!`);
            router.refresh();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        theme: {
          color: "#A855F7", // Purple 500
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500 pb-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Header Area */}
      <div className="text-center mb-20 relative">
        <Link href="/settings?tab=billing" className="absolute left-0 top-0 z-20 inline-block">
          <button className="flex items-center gap-2 text-sm text-gray-400 font-medium hover:text-white transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
          </button>
        </Link>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-5xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight mb-6">
          Upgrade your Arsenal.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Scale your copy-trading operations with dedicated routing, unlimited accounts, and sub-millisecond execution.
        </p>

        {/* Toggle */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <span className={`text-sm font-semibold transition-all duration-300 ${!isAnnual ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-gray-500"}`}>Monthly</span>
          
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 bg-white/5 border border-white/10 rounded-full relative transition-colors focus:outline-none hover:bg-white/10 backdrop-blur-md"
          >
            <div 
              className={`absolute top-1 left-1 bg-gradient-to-br from-[#E9D5FF] to-[#A855F7] w-6 h-6 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-transform duration-300 ${isAnnual ? "translate-x-8" : "translate-x-0"}`} 
            />
          </button>
          
          <span className={`text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${isAnnual ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-gray-500"}`}>
            Annually 
            <span className="text-[10px] font-bold text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        
        {/* Basic Tier */}
        <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 group overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-medium text-white/90 mb-3">Basic</h3>
            <p className="text-sm text-gray-400 mb-8 min-h-[40px] font-light leading-relaxed">Perfect for beginners managing a small personal portfolio.</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-heading font-bold text-white tracking-tight">${isAnnual ? "159" : "199"}</span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
            <button 
              disabled={loadingPlan === "Basic"}
              onClick={() => handleCheckout("Basic")}
              className="w-full py-4 px-6 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-10 flex justify-center items-center backdrop-blur-md group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] disabled:opacity-50"
            >
              {loadingPlan === "Basic" ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Get Started"}
            </button>
            <div className="space-y-5">
              {[
                "Up to 10 Slave Accounts",
                "Standard Execution Speed",
                "Email Support",
                "Basic Analytics"
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 text-sm text-gray-300 items-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white/70" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro Tier (Highlighted) */}
        <div className="relative rounded-[2rem] p-[1px] transform md:-translate-y-6 z-10 group">
          {/* Glowing animated border effect */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#A855F7] via-[#EC4899] to-[#3B82F6] opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#A855F7] via-[#EC4899] to-[#3B82F6]" />
          
          {/* Inner Card */}
          <div className="relative bg-[#0A0515] backdrop-blur-3xl rounded-[calc(2rem-1px)] p-8 h-full flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] p-[1px] rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <span className="block bg-[#0A0515] text-white text-[10px] font-bold px-5 py-1.5 rounded-full tracking-[0.2em] uppercase">
                  Most Popular
                </span>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#A855F7]/10 to-transparent rounded-t-[calc(2rem-1px)] pointer-events-none" />

            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-heading font-medium text-white mb-3">Pro</h3>
              <p className="text-sm text-gray-300 mb-8 min-h-[40px] font-light leading-relaxed">The sweet spot for serious traders and prop firm managers.</p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-6xl font-heading font-bold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">${isAnnual ? "799" : "999"}</span>
                <span className="text-gray-400 font-medium">/mo</span>
              </div>
              <button 
                disabled={loadingPlan === "Pro"}
                onClick={() => handleCheckout("Pro")}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white font-bold transition-all duration-300 mb-10 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-[1.02] flex justify-center items-center group-hover:from-[#A855F7] group-hover:to-[#F472B6] disabled:opacity-50"
              >
                {loadingPlan === "Pro" ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Upgrade to Pro"}
              </button>
              <div className="space-y-5">
                {[
                  "Up to 50 Slave Accounts",
                  "Dedicated IP Routing",
                  "Advanced Risk Controls",
                  "Full API Access",
                  "Priority 24/7 Support"
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 text-sm text-white items-center">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flex Tier */}
        <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 group overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-medium text-white/90 mb-3">Flex</h3>
            <p className="text-sm text-gray-400 mb-8 min-h-[40px] font-light leading-relaxed">For institutions requiring maximum scale and white-labeling.</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-heading font-bold text-white tracking-tight">${isAnnual ? "1919" : "2399"}</span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
            <button 
              disabled={loadingPlan === "Flex"}
              onClick={() => handleCheckout("Flex")}
              className="w-full py-4 px-6 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-10 flex justify-center items-center backdrop-blur-md group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] disabled:opacity-50"
            >
              {loadingPlan === "Flex" ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Upgrade to Flex"}
            </button>
            <div className="space-y-5">
              {[
                "Up to 120 Slave Accounts",
                "Custom White-labeling",
                "Ultra-low Latency Nodes",
                "Dedicated Account Manager",
                "Custom Integrations"
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 text-sm text-gray-300 items-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white/70" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
