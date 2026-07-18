import React, { useEffect, useState } from "react";
import { BotState } from "../types";
import { Play, Square, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight, Globe, DollarSign, Wallet, RefreshCw } from "lucide-react";

interface DashboardViewProps {
  botState: BotState;
  onToggleBot: () => void;
  userName: string;
}

export default function DashboardView({ botState, onToggleBot, userName }: DashboardViewProps) {
  const { brokerConnection, botStatus } = botState;
  
  // Create simulated real-time tick values for immersive floating P/L!
  const [floatingPl, setFloatingPl] = useState(brokerConnection.floatingPl);
  const [equity, setEquity] = useState(brokerConnection.equity);

  useEffect(() => {
    if (botStatus === "RUNNING") {
      const interval = setInterval(() => {
        // Dynamic tick updates
        setFloatingPl((prev) => {
          const delta = (Math.random() - 0.48) * 4.5; // Slightly upwards bias
          const next = parseFloat((prev + delta).toFixed(2));
          // Keep floating within reasonable ranges
          if (next > 450) return 400;
          if (next < -200) return -100;
          return next;
        });
      }, 2500);
      return () => clearInterval(interval);
    } else {
      // decays slowly or remains static when bot stops
      setFloatingPl(0.00);
    }
  }, [botStatus]);

  // Adjust equity relative to floating profit/loss
  useEffect(() => {
    setEquity(parseFloat((brokerConnection.balance + floatingPl).toFixed(2)));
  }, [floatingPl, brokerConnection.balance]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-5 mt-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            SECURE PILOT TELEMETRY
          </span>
          <h2 className="text-lg font-bold font-display text-white mt-0.5">
            Welcome, {userName || "Aviator Pilot"}
          </h2>
        </div>
        
        {/* Connection status badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-full text-[10px] font-semibold text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            MT5 TERMINAL LINKED
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
            Ping: 12ms (Secure Tunnel)
          </span>
        </div>
      </div>

      {/* Main Bot Status Control Card */}
      <div className={`p-4 rounded-2xl border mb-5 transition-all duration-300 ${botStatus === "RUNNING" ? "glass-panel-cyan" : "glass-panel border-slate-800"}`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${botStatus === "RUNNING" ? "glow-indicator-cyan animate-pulse" : "bg-red-500 shadow-md shadow-red-500/20"}`} />
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wide font-display">
                ALGORITHM ENGINE STATUS
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {botStatus === "RUNNING" ? "Automated trade sweeps active on XAU/US/NQ" : "Trading core placed in standby mode"}
              </p>
            </div>
          </div>
          
          {/* Main Action Trigger */}
          <button
            onClick={onToggleBot}
            className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all shadow-md ${botStatus === "RUNNING" ? "bg-red-650 hover:bg-red-500 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 neon-glow-cyan"}`}
          >
            {botStatus === "RUNNING" ? (
              <>
                <Square size={11} fill="currentColor" /> STANDBY
              </>
            ) : (
              <>
                <Play size={11} fill="currentColor" /> ENGAGE
              </>
            )}
          </button>
        </div>

        {/* Dynamic Telemetry Specs */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/40 text-center text-[10px] font-mono">
          <div>
            <span className="text-slate-500 block uppercase">Lot Size</span>
            <span className="text-cyan-400 font-bold mt-0.5 block">{botState.lotSize} Lots</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">Risk Profile</span>
            <span className="text-purple-400 font-bold mt-0.5 block">{botState.riskPercentage}% / Trade</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">News Shield</span>
            <span className={`font-bold mt-0.5 block ${botState.newsFilter ? "text-emerald-400" : "text-amber-400"}`}>
              {botState.newsFilter ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      {/* Account Balance & Equity Overview Bento Grid */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        
        {/* Equity Card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-cyan-400">
            <Activity size={13} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
            Live Equity (Altitude)
          </span>
          <span className="text-lg font-bold font-display text-white mt-1 block tracking-tight">
            {formatCurrency(equity)}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[9px] font-mono">
            <span className="text-slate-500 uppercase">Balance:</span>
            <span className="text-slate-300 font-semibold">{formatCurrency(brokerConnection.balance)}</span>
          </div>
        </div>

        {/* Floating P&L Card */}
        <div className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${floatingPl >= 0 ? "border-emerald-950/50" : "border-red-950/50"}`}>
          <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
            Floating Profit/Loss
          </span>
          <span className={`text-lg font-bold font-display mt-1 block tracking-tight ${floatingPl >= 0 ? "text-emerald-400 text-shadow-cyan" : "text-red-400"}`}>
            {floatingPl >= 0 ? "+" : ""}{formatCurrency(floatingPl)}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[9px] font-mono">
            {floatingPl >= 0 ? (
              <>
                <ArrowUpRight size={10} className="text-emerald-400" />
                <span className="text-emerald-400 uppercase font-semibold">Ascending Flight</span>
              </>
            ) : (
              <>
                <ArrowDownRight size={10} className="text-red-400" />
                <span className="text-red-400 uppercase font-semibold">Draft Resistance</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Account Metadata Panel */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-5 text-xs space-y-2.5">
        <h4 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase pb-1.5 border-b border-slate-800/60 flex items-center justify-between">
          <span>MT5 LINK CALIBRATION</span>
          <span className="text-cyan-400 font-semibold uppercase">{brokerConnection.status}</span>
        </h4>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Globe size={11} className="text-cyan-500/60" /> Connected Broker:
          </span>
          <span className="text-white font-medium">{brokerConnection.brokerName}</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Wallet size={11} className="text-cyan-500/60" /> Account Number:
          </span>
          <span className="text-white font-mono font-medium">{brokerConnection.accountNumber}</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <DollarSign size={11} className="text-cyan-500/60" /> Maintenance Margin:
          </span>
          <span className="text-white font-mono">{formatCurrency(brokerConnection.margin)}</span>
        </div>
      </div>

      {/* Profit Targets / Period Metrics */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3 block">
          TEMPORAL FLIGHT HARVESTS
        </h3>
        <div className="grid grid-cols-3 gap-2.5 text-center">
          
          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Daily Yield</span>
            <span className="text-sm font-bold font-display text-emerald-400 mt-1 block">
              +{formatCurrency(brokerConnection.dailyProfit)}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Weekly Yield</span>
            <span className="text-sm font-bold font-display text-emerald-400 mt-1 block">
              +{formatCurrency(brokerConnection.weeklyProfit)}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Monthly Yield</span>
            <span className="text-sm font-bold font-display text-emerald-400 mt-1 block">
              +{formatCurrency(brokerConnection.monthlyProfit)}
            </span>
          </div>

        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-6 mb-2 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex gap-2 items-start text-[9.5px] font-sans text-cyan-300/80 leading-relaxed">
        <ShieldCheck size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-cyan-300 block uppercase tracking-wider mb-0.5">Tactical Information Protocol</span>
          DARK MATTER FX does not manage custody funds directly. All actual trade setups run via authorized MT5 client endpoints on your remote server coordinates.
        </div>
      </div>

    </div>
  );
}
