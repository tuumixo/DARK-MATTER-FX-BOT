import React, { useEffect, useState } from "react";
import { Battery, Wifi, Signal, RefreshCw, Smartphone, Monitor } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  currentPage: string;
  onNavigate: (page: any) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function PhoneFrame({
  children,
  isMobileFrame,
  onToggleFrame,
  currentPage,
  onNavigate,
  isLoggedIn,
  onLogout
}: PhoneFrameProps) {
  const [time, setTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(98);

  // Dynamic time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated battery drainage
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => (prev > 10 ? prev - 1 : 98));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper list for active bottom navigation icons inside the Android UI
  const navItems = [
    { page: "DASHBOARD", label: "Dashboard", icon: "📊" },
    { page: "SIGNALS", label: "Signals", icon: "📡" },
    { page: "BOT_CONTROL", label: "Bot Controls", icon: "⚙️" },
    { page: "ECONOMIC_CALENDAR", label: "Calendar", icon: "📅" },
    { page: "PROFILE", label: "Profile", icon: "👤" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020205] text-slate-100 font-sans relative overflow-x-hidden p-2 md:p-6 grid-overlay">
      {/* Decorative ambient glowing lines background - Frosted Glass design template specs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Dev Control Toolbar */}
      <div className="mb-4 z-50 flex items-center gap-3.5 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-slate-300">DARK MATTER FX PILOT SHELL</span>
        </div>
        
        <div className="w-px h-4 bg-white/10" />
        
        {/* Toggle Mode Button */}
        <button
          onClick={onToggleFrame}
          className="cursor-pointer bg-white/5 hover:bg-white/15 text-cyan-400 border border-white/10 px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5"
        >
          {isMobileFrame ? (
            <>
              <Monitor size={12} /> FULL WEB LAYOUT
            </>
          ) : (
            <>
              <Smartphone size={12} /> ANDROID PHONE SHELL
            </>
          )}
        </button>
      </div>

      {isMobileFrame ? (
        /* ANDROID SMARTPHONE MOCKUP FRAME */
        <div className="relative w-full max-w-[370px] h-[780px] bg-black/60 rounded-[48px] border-[11px] border-white/10 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(34,211,238,0.15)] flex flex-col overflow-hidden relative">
          
          {/* Side physical buttons simulated */}
          <div className="absolute -left-[14px] top-32 w-[3px] h-12 bg-white/10 rounded-l" />
          <div className="absolute -left-[14px] top-48 w-[3px] h-12 bg-white/10 rounded-l" />
          <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-white/10 rounded-r" />

          {/* Android Notch / Front Facing Camera Pinhole */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-pulse" />
            </div>
            <div className="w-10 h-1 bg-slate-900 rounded-full" />
          </div>

          {/* Android Status Bar */}
          <div className="h-10 bg-black/40 text-slate-400 text-[10.5px] font-mono flex justify-between items-end px-6 pb-1.5 select-none z-40 relative">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
              <Signal size={12} className="text-cyan-400" />
              <Wifi size={12} className="text-cyan-400" />
              <div className="flex items-center gap-1">
                <span className="text-[9.5px]">{batteryLevel}%</span>
                <Battery size={13} className="text-cyan-400 rotate-0" />
              </div>
            </div>
          </div>

          {/* Central Main Display Container */}
          <div className="flex-grow bg-[#020205] overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Interactive Android Bottom Navigation Bar */}
          {isLoggedIn && currentPage !== "SPLASH" && currentPage !== "LOGIN" && currentPage !== "REGISTER" && (
            <div className="h-14 bg-white/5 border-t border-white/10 backdrop-blur-xl flex justify-around items-center px-2 z-40 relative select-none">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer group"
                  >
                    <span className={`text-base transition-transform group-hover:scale-110 duration-200 ${isActive ? "grayscale-0 text-shadow-cyan filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "grayscale opacity-50"}`}>
                      {item.icon}
                    </span>
                    <span className={`text-[8.5px] font-display uppercase tracking-wider mt-1 transition-colors ${isActive ? "text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-400"}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Android Gesture Navigation Home Bar */}
          <div className="h-4 bg-black flex items-center justify-center pb-1 z-40 relative select-none">
            <div className="w-24 h-1 bg-slate-600 rounded-full hover:bg-slate-500 transition-colors cursor-pointer" onClick={() => onNavigate("DASHBOARD")} />
          </div>

        </div>
      ) : (
        /* FULL-SCREEN RESPONSIVE WEB FRAME */
        <div className="w-full max-w-5xl h-[800px] bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl flex overflow-hidden relative">
          
          {/* Left persistent high-tech dashboard navigation deck */}
          {isLoggedIn && currentPage !== "SPLASH" && currentPage !== "LOGIN" && currentPage !== "REGISTER" && (
            <div className="w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-4 relative select-none">
              <div className="space-y-6">
                {/* Brand Banner */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-display font-black text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    DMF
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold font-display tracking-widest text-white uppercase">DARK MATTER</h3>
                    <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest">ALGORITHM CORE</span>
                  </div>
                </div>

                {/* Nav Links List */}
                <div className="space-y-1.5 pt-4">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                      <button
                        key={item.page}
                        onClick={() => onNavigate(item.page)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold font-display uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${isActive ? "bg-white/10 border border-white/20 text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status bar & system parameters footer */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>TELEMETRY: SECURE</span>
                  <span className="text-cyan-400 font-bold">{time}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>PING RATE:</span>
                  <span className="text-emerald-400 font-bold">12ms</span>
                </div>
                
                {/* Action logout */}
                <button
                  onClick={onLogout}
                  className="w-full bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono font-bold text-center cursor-pointer uppercase tracking-wider transition-colors"
                >
                  DISENGAGE LINK
                </button>
              </div>
            </div>
          )}

          {/* Right main display block */}
          <div className="flex-grow overflow-hidden relative flex flex-col bg-[#020205]">
            {children}
          </div>

        </div>
      )}

      {/* Safety Legal Warning Disclaimer Footer bar outside */}
      <div className="mt-4 text-center max-w-md font-sans text-[10.5px] text-slate-600 leading-relaxed z-10 px-4">
        <strong>Dynamic Risk Disclaimer:</strong> Leverage trading in foreign exchange carries extreme capital volatility risks. DARK MATTER FX coordinates structural patterns as a co-pilot manual. No automated profits are guaranteed.
      </div>
    </div>
  );
}
