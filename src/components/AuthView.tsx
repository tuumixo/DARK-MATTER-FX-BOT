import React, { useState } from "react";
import { Cpu, Mail, Lock, Check, Key, ShieldCheck, User, Globe } from "lucide-react";

interface AuthViewProps {
  onLoginSuccess: (userEmail: string, userName: string) => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [view, setView] = useState<"LOGIN" | "REGISTER" | "FORGOT">("LOGIN");
  const [email, setEmail] = useState("pilot@darkmatter.fx");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (view === "LOGIN") {
      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Default login credentials allow easy entry
        onLoginSuccess(email, "Aviator Commander");
      }, 1000);
    } else if (view === "REGISTER") {
      if (!fullName) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage("System Registration complete! Logging in...");
        setTimeout(() => {
          onLoginSuccess(email, fullName);
        }, 1200);
      }, 1000);
    } else {
      // Forgot password
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage("Secure flight path recovery email dispatched.");
      }, 1000);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("google.user@gmail.com", "Google Aviator");
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-200 p-6 relative overflow-y-auto circuit-bg font-sans">
      {/* Decorative cyber elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />

      {/* Top Brand Block */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#090b14] to-[#041a24] border border-cyan-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <Cpu className="text-cyan-400 w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold tracking-wider font-display text-white uppercase">
          Dark Matter FX
        </h2>
        <p className="text-[10px] text-slate-500 tracking-[0.2em] font-mono uppercase mt-1">
          Forex Algorithm Companion
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl relative z-10">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-cyan-400 font-display uppercase tracking-wider">
            {view === "LOGIN" && "PILOT ACCESS"}
            {view === "REGISTER" && "ALGORITHMIC REGISTRATION"}
            {view === "FORGOT" && "RECOVERY COORDINATES"}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {view === "LOGIN" && "Establish authorization link to MT5 system."}
            {view === "REGISTER" && "Set up secure trade cloud credentials."}
            {view === "FORGOT" && "Reset your encrypted access key."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "REGISTER" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Admiral Maverick"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Flight Mail (Email)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="pilot@darkmatter.fx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          {view !== "FORGOT" && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  Access Code (Password)
                </label>
                {view === "LOGIN" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("FORGOT");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    FORGOT CODE?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {view === "LOGIN" && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? "bg-cyan-500/20 border-cyan-500" : "bg-slate-950 border-slate-800"}`}>
                  {rememberMe && <Check size={10} className="text-cyan-400" />}
                </div>
                Remember this Pilot ID
              </button>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-display text-xs font-semibold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : view === "LOGIN" ? (
              "ESTABLISH ACCESS LINK"
            ) : view === "REGISTER" ? (
              "CREATE CO-PILOT KEY"
            ) : (
              "DISPATCH RECOVERY LINK"
            )}
          </button>
        </form>

        {/* Divider */}
        {view !== "FORGOT" && (
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/80"></div>
            </div>
            <span className="relative bg-[#020205] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              OR SECURE FEDERATION
            </span>
          </div>
        )}

        {/* Google Sign In */}
        {view !== "FORGOT" && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {/* Google Vector Icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google Account
          </button>
        )}
      </div>

      {/* Alternative View triggers */}
      <div className="mt-6 text-center space-y-2 z-10">
        {view === "LOGIN" ? (
          <p className="text-xs text-slate-500">
            Awaiting commission?{" "}
            <button
              onClick={() => {
                setView("REGISTER");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-cyan-400 font-medium hover:underline cursor-pointer"
            >
              Initialize Cadet Key
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Already commissioned?{" "}
            <button
              onClick={() => {
                setView("LOGIN");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-cyan-400 font-medium hover:underline cursor-pointer"
            >
              Sign In to Command Center
            </button>
          </p>
        )}
      </div>

      {/* Security disclaimer */}
      <div className="mt-auto pt-6 flex flex-col items-center justify-center gap-1.5 text-center text-[10px] font-mono text-slate-600">
        <div className="flex items-center gap-1 text-cyan-400/40">
          <ShieldCheck size={11} />
          CRYPTOGRAPHIC HARDENING PROTOCOL ACTIVE
        </div>
        <span>MT5 bridge runs on AES-256 cloud container isolation.</span>
      </div>
    </div>
  );
}
