"use client";

import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setLoadTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded || !isAuthLoaded) {
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


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please agree to the Terms and Conditions and Risk Disclosure.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignedIn) {
        await signOut();
      }

      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // Send the email for verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        setError(`Verification requires further steps. Status: ${completeSignUp.status}. Missing: ${completeSignUp.missingFields?.join(', ')}`);
      } else {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      await signOut();
    }

    signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
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

      <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 w-full max-w-[460px] shadow-2xl relative z-10 overflow-hidden group hover:border-white/10 transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h2 className="text-2xl font-black text-white text-center mb-8 tracking-tight">Sign Up</h2>

        {!pendingVerification ? (
          <form onSubmit={handleSignUp} className="space-y-5">
            {error && (
              <div className="mb-6 block bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                Username
              </label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 px-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                placeholder="johndoe123" 
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                Email
              </label>
              <input 
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
                className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 px-4 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                placeholder="name@company.com" 
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#111113] border border-white/10 rounded-lg py-3 px-4 pr-10 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
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

            <div className="flex flex-col mt-4">
              <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full bg-[#111113] border ${confirmPassword.length > 0 && !password.startsWith(confirmPassword) ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500'} rounded-lg py-3 px-4 pr-10 text-xs font-bold font-mono text-white focus:outline-none focus:ring-1 transition-all placeholder:text-[#52525B]`} 
                  placeholder="••••••••" 
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-[#888888] hover:text-white transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#888888] hover:text-white transition-colors" />
                  )}
                </div>
              </div>
              {confirmPassword.length > 0 && !password.startsWith(confirmPassword) && (
                <p className="text-red-400 text-[10px] mt-2 font-mono tracking-widest uppercase">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start mt-6 mb-6">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/10 bg-[#111113] text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer" 
              />
              <label htmlFor="terms" className="ml-3 block text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase leading-relaxed cursor-pointer">
                I agree to the <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms and Conditions</Link> and the <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Risk Disclosure</Link>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-500 text-white font-bold rounded-lg py-3 hover:bg-purple-400 transition-all text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              {isLoading ? "Creating Account..." : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="my-8 flex items-center relative z-10">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="px-4 text-[#888888] text-[9px] font-bold uppercase tracking-[0.2em] font-mono">Secure Gateway Login</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all text-[10px] font-bold font-mono tracking-widest uppercase relative z-10"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 relative z-10">
            <p className="text-[#888888] text-[10px] font-bold font-mono tracking-widest uppercase text-center mb-6">We sent a verification code to your email.</p>
            
            {error && (
              <div className="mb-6 block bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="flex flex-col mt-4">
              <label className="text-[10px] font-bold text-[#888888] font-mono tracking-widest uppercase mb-3">
                Verification Code
              </label>
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full bg-[#111113] border border-white/10 rounded-lg py-4 px-4 text-lg font-black font-mono tracking-[0.5em] text-center text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#52525B]" 
                placeholder="123456" 
                maxLength={6}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-500 text-white font-bold rounded-lg py-3 hover:bg-purple-400 transition-all text-[10px] font-mono tracking-widest uppercase mt-6 disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-[#888888] text-[10px] font-bold font-mono tracking-widest uppercase relative z-10">
        Already have an account? <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">Sign In</Link>
      </p>

      <div className="mt-16 flex items-center justify-center gap-6 text-[9px] font-bold font-mono tracking-[0.2em] uppercase text-[#52525B] relative z-10">
        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-white transition-colors">Security</Link>
      </div>
    </div>
  );
}
