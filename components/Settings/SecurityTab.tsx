import { Shield, Key, Smartphone, Eye, EyeOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function SecurityTab() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const [totpStep, setTotpStep] = useState<"idle" | "enrolling" | "verifying" | "success">("idle");
  const [totpUri, setTotpUri] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpMessage, setTotpMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    
    setIsUpdating(true);
    setMessage("");

    try {
      if (user.passwordEnabled) {
        await user.updatePassword({
          currentPassword,
          newPassword,
        });
      } else {
        await user.updatePassword({
          newPassword,
        });
      }
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user) return;
    setTotpStep("enrolling");
    setTotpMessage("");
    try {
      const totp = await user.createTOTP();
      setTotpUri(totp.uri || "");
      setTotpSecret(totp.secret || "");
      setTotpStep("verifying");
    } catch (err: any) {
      setTotpMessage(err.errors?.[0]?.longMessage || "Failed to initiate 2FA.");
      setTotpStep("idle");
    }
  };

  const handleVerifyTOTP = async () => {
    if (!user) return;
    setTotpMessage("");
    try {
      const totp = await user.verifyTOTP({ code: totpCode });
      const backup = await user.createBackupCode();
      setBackupCodes(backup.codes || []);
      setTotpStep("success");
    } catch (err: any) {
      setTotpMessage(err.errors?.[0]?.longMessage || "Invalid verification code.");
    }
  };

  const handleDisable2FA = async () => {
    if (!user) return;
    try {
      await user.disableTOTP();
      setTotpStep("idle");
    } catch (err: any) {
      setTotpMessage(err.errors?.[0]?.longMessage || "Failed to disable 2FA.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-3xl font-black text-white tracking-tight">Security</h2>
        <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase mt-2">Manage your account security, passwords, and 2FA.</p>
      </div>

      <div className="space-y-6">
      
        {/* Change Password */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[11px] font-bold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
              <Key className="w-4 h-4 text-purple-400" />
              Change Password
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {message && (
              <div className={`p-3 rounded-md text-sm font-medium ${message.includes("success") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {message}
              </div>
            )}
            {user?.passwordEnabled && (
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-3">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password" 
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 pr-12 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#888888]" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-3">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password" 
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 pr-12 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#888888]" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest mb-3">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 pr-12 text-xs font-bold font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#888888]" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/5 relative z-10">
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdating}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 flex flex-col items-start gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex w-full justify-between items-start md:items-center flex-col md:flex-row gap-6 relative z-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                  {user?.totpEnabled 
                    ? "Your account is currently protected with Two-Factor Authentication." 
                    : "Add an extra layer of security to your account. We highly recommend using an authenticator app like Google Authenticator or Authy."}
                </p>
              </div>
            </div>
            {user?.totpEnabled ? (
              <button onClick={handleDisable2FA} className="shrink-0 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-colors">
                Disable 2FA
              </button>
            ) : (
              totpStep === "idle" && (
                <button onClick={handleEnable2FA} className="shrink-0 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  Enable 2FA
                </button>
              )
            )}
          </div>

          {totpMessage && (
            <div className={`w-full p-3 rounded-md text-sm font-medium ${totpMessage.includes("Invalid") || totpMessage.includes("Failed") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
              {totpMessage}
            </div>
          )}

          {totpStep === "verifying" && (
            <div className="w-full bg-[#111113] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-8 relative z-10">
              <div className="space-y-3">
                <h4 className="text-white font-black text-lg">Scan QR Code</h4>
                <p className="text-[11px] font-bold font-mono text-[#888888] max-w-sm mx-auto tracking-widest uppercase">Open your authenticator app and scan the QR code below, or manually enter the secret key.</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={totpUri} size={160} />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold">Secret Key</span>
                <p className="text-sm font-mono text-purple-400 tracking-wider bg-[#111113] border border-[#2C2C2E] px-4 py-2 rounded-md">{totpSecret}</p>
              </div>

              <div className="w-full max-w-sm space-y-4 pt-6 border-t border-white/5">
                <label className="block text-[10px] font-bold text-[#888888] font-mono uppercase tracking-widest text-left">Verification Code</label>
                <input 
                  type="text" 
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="Enter 6-digit code" 
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-center tracking-[1em] font-mono font-black text-2xl" 
                  maxLength={6}
                />
                <div className="flex gap-4">
                  <button onClick={() => setTotpStep("idle")} className="flex-1 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase transition-all">Cancel</button>
                  <button onClick={handleVerifyTOTP} className="flex-1 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">Verify</button>
                </div>
              </div>
            </div>
          )}

          {totpStep === "success" && backupCodes.length > 0 && (
            <div className="w-full bg-[#111113] border border-white/10 rounded-2xl p-8 space-y-6 relative z-10">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Shield className="w-6 h-6" />
                <h4 className="font-black text-xl">2FA Enabled Successfully!</h4>
              </div>
              <p className="text-[11px] font-bold text-[#888888] font-mono tracking-widest uppercase">Please save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {backupCodes.map((code, i) => (
                  <div key={i} className="bg-[#111113] border border-[#2C2C2E] p-2 rounded text-center text-sm font-mono text-white tracking-widest">
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-6 border-t border-white/5 mt-4">
                <button onClick={() => setTotpStep("idle")} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase transition-all">
                  I've saved my backup codes
                </button>
              </div>
            </div>
          )}
        </div>



      </div>
    </div>
  );
}
