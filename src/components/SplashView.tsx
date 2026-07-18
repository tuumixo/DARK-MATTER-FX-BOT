import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Cpu, Terminal, ShieldCheck } from "lucide-react";

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Cybernetic Engine...");

  useEffect(() => {
    const statuses = [
      "Initializing Cybernetic Engine...",
      "Connecting to MT5 Quantum Core...",
      "Mapping Airspace Frequencies...",
      "Synchronizing Radar Feed...",
      "Dark Matter FX Operational.",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        
        // Update status text based on progress
        const index = Math.min(
          Math.floor((next / 100) * statuses.length),
          statuses.length - 1
        );
        setStatusText(statuses[index]);
        
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-[#020205] text-white p-6 relative overflow-hidden circuit-bg font-display">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px]" />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30" />

      {/* Header telemetry info */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono text-cyan-400/50 mt-6 px-4">
        <span className="flex items-center gap-1">
          <Terminal size={10} /> SYS.ALT_3000
        </span>
        <span>SYS_STATUS: ONLINE</span>
      </div>

      {/* Center 3D Logo with AI Circuitry */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Animated outer ring */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: "15s" }} />
          <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
          
          {/* Glowing central cube/hexagon */}
          <div className="absolute w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#0c051a] to-[#04121b] border-2 border-cyan-400/40 flex items-center justify-center neon-glow-cyan">
            {/* AI Chip Core */}
            <div className="relative flex items-center justify-center">
              <Cpu className="text-cyan-400 w-12 h-12" />
              {/* Circuit pulse dots */}
              <span className="absolute -top-3 -left-3 w-1.5 h-1.5 rounded-full glow-indicator-cyan" />
              <span className="absolute -bottom-3 -right-3 w-1.5 h-1.5 rounded-full glow-indicator-purple" />
              <span className="absolute -top-3 -right-3 w-1.5 h-1.5 rounded-full glow-indicator-cyan" />
              <span className="absolute -bottom-3 -left-3 w-1.5 h-1.5 rounded-full glow-indicator-purple" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 text-shadow-cyan uppercase">
            Dark Matter FX
          </h1>
          <p className="text-[11px] font-mono tracking-[0.3em] text-cyan-400/70 mt-1 uppercase">
            Forex Algorithmic Core
          </p>
        </div>
      </div>

      {/* Loading bar footer */}
      <div className="w-full max-w-xs mb-8 flex flex-col items-center">
        <span className="text-[10px] font-mono text-cyan-400 mb-2 tracking-wide uppercase h-4">
          {statusText}
        </span>
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full border border-slate-800 p-[1px] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage status */}
        <span className="text-[10px] font-mono text-slate-500 mt-1.5">
          {progress}% SECURE LINKING
        </span>
      </div>

      {/* Security notice */}
      <div className="mb-4 flex items-center gap-1.5 text-[9px] font-mono text-slate-600">
        <ShieldCheck size={11} className="text-cyan-500/40" />
        SECURE END-TO-END CRYPTOGRAPHIC LINK (MT5 BRIDGE)
      </div>
    </div>
  );
}
