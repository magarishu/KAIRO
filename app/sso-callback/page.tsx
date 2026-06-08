"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SSOCallback() {
  const { handleRedirectCallback, client, setActive } = useClerk();
  const hasHandled = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    async function processSSO() {
      try {
        // We tell Clerk to return back to this exact page if there are missing requirements
        // instead of redirecting to the default hosted UI.
        await handleRedirectCallback({
          redirectUrl: "/dashboard",
          redirectUrlComplete: "/dashboard",
          continueSignUpUrl: "/sso-callback?step=missing",
        });
      } catch (err: any) {
        console.error("SSO callback error:", err);
        setError("Failed to complete Google Sign In.");
      }
    }

    processSSO();
  }, [handleRedirectCallback]);

  // Second effect: If handleRedirectCallback sent us here with ?step=missing
  // it means Google authenticated successfully, but Clerk wants a Username.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("step") === "missing" && client?.signUp) {
      const signUp = client.signUp;
      
      if (signUp.status === "missing_requirements") {
        // Automatically generate a username to fulfill the requirement silently
        const randomUsername = "kairo_" + Math.random().toString(36).substring(2, 9);
        
        signUp.update({ username: randomUsername })
          .then((result) => {
            if (result.status === "complete") {
              // Successfully injected username, now log them in!
              setActive({ 
                session: result.createdSessionId, 
                redirectUrl: "/dashboard" 
              });
            } else {
              setError("Further requirements missing: " + result.status);
            }
          })
          .catch((err) => {
            console.error("Auto-fill username error:", err);
            setError(err.errors?.[0]?.longMessage || "Error completing sign up");
          });
      }
    }
  }, [client]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#52525B] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]"></div>
      
      {error ? (
        <div className="relative z-10 text-center">
          <div className="text-red-400 font-bold mb-4 font-mono uppercase tracking-widest text-xs">{error}</div>
          <button 
            onClick={() => window.location.href = '/sign-up'}
            className="text-purple-400 hover:text-purple-300 text-xs font-mono uppercase tracking-widest border border-purple-500/30 px-4 py-2 rounded"
          >
            Return to Sign Up
          </button>
        </div>
      ) : (
        <>
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4 relative z-10"></div>
          <span className="relative z-10 text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">Securing your connection...</span>
        </>
      )}
    </div>
  );
}
