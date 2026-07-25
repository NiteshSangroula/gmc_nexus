import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import authApi from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Verification States
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await authApi.sendOtp(email.trim());
      toast.success("Verification code resent successfully!");
      setResendCooldown(30);
    } catch (error) {
      console.error("Resend OTP failed:", error);
      const errorMsg = error.response?.data?.message || "Failed to resend code.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!showOtpField) {
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        setError("Please fill out all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      try {
        // Send OTP
        await authApi.sendOtp(email.trim());
        toast.success("Verification code sent to your email!");
        setShowOtpField(true);
        setResendCooldown(30);
      } catch (error) {
        console.error("Failed to send OTP:", error);
        const errorMsg = error.response?.data?.message || "Failed to send verification code.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp.trim()) {
        setError("Please enter the verification code.");
        return;
      }

      setLoading(true);
      try {
        const result = await register(email.trim(), password, username.trim(), otp.trim());
        if (result.success) {
          toast.success("Account created successfully! Welcome aboard.");
          navigate("/dashboard", { replace: true });
        } else {
          setError("Registration failed. Please check your details.");
          toast.error("Registration failed.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        const errorMsg = error.response?.data?.message || "Verification failed. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join GMC Nexus and start generating smart flashcards in seconds"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {!showOtpField ? (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name or Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/80 pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="alex.student@gmc.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/80 pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/80 pl-10 pr-10 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/80 pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/50 p-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-semibold">
                We sent a 6-digit verification code to:
              </p>
              <p className="mt-1 font-bold text-orange-500">{email}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-[0.5em] rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/80 py-3 text-base font-extrabold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Verifying & Registering...</span>
                ) : (
                  <>
                    <span>Verify & Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendOtp}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 py-3 text-xs font-bold text-slate-800 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Verification Code"}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpField(false)}
                className="text-center text-xs font-bold text-slate-500 hover:text-slate-300 py-1"
              >
                Back to Details
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center pt-1">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Includes free study deck exports</span>
        </div>

        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-orange-500 hover:underline">
            Sign in instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
