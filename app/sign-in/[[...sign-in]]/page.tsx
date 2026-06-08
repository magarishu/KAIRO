"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function SigninPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth();
  
  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const router = useRouter();

  // Detect if Clerk is hanging (usually because of local network IP without HTTPS)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setLoadTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if ((!isLoaded || !isAuthLoaded) && !isGoogleLoading) {
    if (loadTimeout) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#000000] text-[#A1A1AA] text-sm p-8 text-center max-w-md mx-auto">
          <div className="text-red-400 font-bold mb-4">Authentication Failed to Load</div>
          <p className="mb-4">
            If you are accessing this app via a local network IP (e.g. 192.168.x.x) instead of localhost, Clerk Authentication blocks the connection for security reasons (it requires HTTPS or localhost).
          </p>
          <p className="text-white font-medium">
            To test on your mobile device or network, please use a secure tunnel like <code className="bg-[#262626] px-1 rounded text-purple-400">ngrok http 3000</code> or test directly on localhost.
          </p>
        </div>
      );
    }
    return <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#52525B] text-sm relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]"></div>
      <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4 relative z-10"></div>
      <span className="relative z-10 text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">Loading authentication...</span>
    </div>;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");

    try {
      if (isSignedIn) {
        await signOut();
      }

      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("More steps are required. Please check your email or contact support.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    
    setIsGoogleLoading(true);
    
    if (isSignedIn) {
      await signOut();
    }
    
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!identifier) {
      setError("Please enter your email address first.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier,
      });
      setResetCodeSent(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("More steps are required.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]"></div>
      
      <div className="relative z-10" id="clerk-captcha"></div>
      
      <div className="mb-10 flex flex-col items-center text-center relative z-10">
        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">KAIRO</h1>
        <div className="h-[1px] w-12 bg-purple-500/50 mt-2"></div>
      </div>

      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 w-full max-w-[420px] shadow-2xl relative z-10 overflow-hidden group hover:border-white/10 transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h2 className="text-2xl font-black text-white text-center mb-8 tracking-tight">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="mb-6 block bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          {/* Forgot Password Flow */}
          {isForgotPassword ? (
            resetCodeSent ? (
              // Step 2: Enter code and new password
              <>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                    Reset Code
                  </label>
                  <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 px-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                    placeholder="Enter code from email" 
                  />
                </div>

                <div className="flex flex-col mt-4">
                  <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                    New Password
                  </label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 px-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                    placeholder="••••••••" 
                  />
                </div>

                <button 
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full bg-purple-500 text-white font-bold rounded-lg py-3 hover:bg-purple-400 transition-all text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 mt-6 disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  {isLoading ? "Resetting..." : "Set New Password"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setResetCodeSent(false); }}
                  className="w-full text-[#888888] text-[10px] font-bold font-mono tracking-widest uppercase hover:text-white transition-colors mt-4"
                >
                  Back to Sign In
                </button>
              </>
            ) : (
              // Step 1: Request code
              <>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-[#888888]" />
                    </div>
                    <input 
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                      placeholder="Enter your email" 
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="w-full bg-purple-500 text-white font-bold rounded-lg py-3 hover:bg-purple-400 transition-all text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 mt-6 disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-[#888888] text-[10px] font-bold font-mono tracking-widest uppercase hover:text-white transition-colors mt-4"
                >
                  Back to Sign In
                </button>
              </>
            )
          ) : (
            // Standard Login Form
            <>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-[#888888]" />
                  </div>
                  <input 
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                    placeholder="Enter your credentials" 
                  />
                </div>
              </div>

              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(""); }}
                    className="text-purple-400 text-[9px] font-bold font-mono tracking-widest uppercase hover:text-purple-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#888888]" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 pl-10 pr-10 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                    placeholder="••••••••" 
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#888888] hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#888888] hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4 mb-6">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-[#111113] text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                <label htmlFor="remember" className="ml-2 block text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-0.5">
                  Remember this device
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-500 text-white font-bold rounded-lg py-3 hover:bg-purple-400 transition-all text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                {isLoading ? "Signing In..." : (
                  <>Sign In <LogIn className="w-4 h-4" /></>
                )}
              </button>
            </>
          )}
        </form>

        <div className="my-6 flex items-center relative z-10">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="px-4 text-[#888888] text-[9px] font-bold uppercase tracking-[0.2em] font-mono">Or continue with</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all text-[10px] font-bold font-mono tracking-widest uppercase disabled:opacity-50 relative z-10"
        >
          {isGoogleLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {isGoogleLoading ? "Connecting..." : "Google"}
        </button>
      </div>

      <p className="mt-8 text-[#888888] text-[10px] font-bold font-mono tracking-widest uppercase relative z-10">
        New to Kairo? <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">Create an account</Link>
      </p>

      <div className="mt-16 flex items-center justify-center gap-6 text-[9px] font-bold font-mono tracking-[0.2em] uppercase text-[#52525B] relative z-10">
        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-white transition-colors">Security</Link>
      </div>
    </div>
  );
}
