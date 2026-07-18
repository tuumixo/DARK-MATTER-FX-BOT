import React from "react";
import { BotState } from "../types";
import { Sliders, HelpCircle, Shield, Globe2, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";

interface BotControlViewProps {
  botState: BotState;
  onUpdateState: (updates: Partial<BotState>) => void;
  onToggleBot: () => void;
}

export default function BotControlView({ botState, onUpdateState, onToggleBot }: BotControlViewProps) {
  const { botStatus, autoTrading, riskPercentage, lotSize, maxDailyTrades, newsFilter, sessions } = botState;

  const handleSessionToggle = (sessionKey: keyof typeof sessions) => {
    onUpdateState({
      sessions: {
        ...sessions,
        [sessionKey]: !sessions[sessionKey],
      },
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {/* Page Header */}
      <div className="mb-4 mt-1">
        <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">
          ALGORITHM PARAMETERS
        </span>
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5 flex items-center gap-2">
          <Sliders size={15} className="text-cyan-400" />
          Bot Calibration Deck
        </h3>
      </div>

      {/* Main Trigger Card */}
      <div className={`p-4 rounded-2xl border mb-5 transition-all duration-300 ${botStatus === "RUNNING" ? "glass-panel-cyan" : "glass-panel border-slate-800"}`}>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">CORE STATUS</span>
            <h4 className="text-sm font-bold font-display text-white mt-0.5 uppercase tracking-wide">
              {botStatus === "RUNNING" ? "ENGAGED" : "STANDBY MODE"}
            </h4>
          </div>
          <button
            onClick={onToggleBot}
            className={`cursor-pointer px-5 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${botStatus === "RUNNING" ? "bg-red-650 hover:bg-red-500 text-white" : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white neon-glow-cyan"}`}
          >
            {botStatus === "RUNNING" ? "STOP ALGO ENGINE" : "START ALGO ENGINE"}
          </button>
        </div>
      </div>

      {/* Primary Calibration Settings */}
      <div className="space-y-4">
        
        {/* Risk Allocation Slider */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/85">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold text-slate-200 tracking-wide font-display flex items-center gap-1">
              Tactical Risk Allocation (%)
              <HelpCircle size={11} className="text-slate-500 cursor-help" title="Percentage of account balance at risk per setup." />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">{riskPercentage.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.25"
            value={riskPercentage}
            onChange={(e) => onUpdateState({ riskPercentage: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg outline-none"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>0.5% (Defensive)</span>
            <span>1.25% (Tactical)</span>
            <span>2.0% (Aggressive)</span>
          </div>
        </div>

        {/* Lot Size and Max Trades */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Lot size select */}
          <div className="glass-panel p-3 rounded-2xl border border-slate-800/85 flex flex-col justify-between">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5 block">
              Lot Size
            </label>
            <select
              value={lotSize}
              onChange={(e) => onUpdateState({ lotSize: parseFloat(e.target.value) })}
              className="bg-slate-950/80 border border-slate-800 text-white text-xs py-1.5 px-2 rounded-xl outline-none focus:border-cyan-500/60"
            >
              {[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0].map((v) => (
                <option key={v} value={v}>{v.toFixed(2)} Lots</option>
              ))}
            </select>
          </div>

          {/* Max Daily Trades */}
          <div className="glass-panel p-3 rounded-2xl border border-slate-800/85 flex flex-col justify-between">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5 block">
              Max Daily Trades
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxDailyTrades}
              onChange={(e) => onUpdateState({ maxDailyTrades: parseInt(e.target.value) || 5 })}
              className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs py-1 px-2 rounded-xl outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>
        </div>

        {/* Auto Trading toggle */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/85 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Auto-Trading Core</span>
            <span className="text-[10px] text-slate-500">Enable algorithmic order routing</span>
          </div>
          <button
            onClick={() => onUpdateState({ autoTrading: !autoTrading })}
            className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {autoTrading ? <ToggleRight size={34} /> : <ToggleLeft size={34} className="text-slate-600" />}
          </button>
        </div>

        {/* News Filter Toggle */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/85 flex justify-between items-center">
          <div className="flex items-start gap-2.5">
            <Shield size={16} className="text-purple-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">High-Impact News Shield</span>
              <span className="text-[10px] text-slate-500">Safeguards capital 30 mins before/after news releases</span>
            </div>
          </div>
          <button
            onClick={() => onUpdateState({ newsFilter: !newsFilter })}
            className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {newsFilter ? <ToggleRight size={34} /> : <ToggleLeft size={34} className="text-slate-600" />}
          </button>
        </div>

        {/* Sessions Calibration checkboxes */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/85">
          <div className="flex items-center gap-1.5 mb-3.5 pb-2 border-b border-slate-800/40">
            <Globe2 size={13} className="text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-200 font-display uppercase tracking-wide">
              Active Trade Session Windows
            </span>
          </div>
          
          <div className="space-y-3">
            
            <button
              onClick={() => handleSessionToggle("London")}
              className="w-full flex justify-between items-center cursor-pointer text-left"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">London Airspace</span>
                <span className="text-[9.5px] font-mono text-slate-500">08:00 - 16:30 GMT</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sessions.London ? "bg-cyan-500/15 border-cyan-500" : "bg-slate-950 border-slate-800"}`}>
                {sessions.London && <div className="w-2 h-2 rounded-full glow-indicator-cyan" />}
              </div>
            </button>

            <button
              onClick={() => handleSessionToggle("NewYork")}
              className="w-full flex justify-between items-center cursor-pointer text-left"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">New York Airspace</span>
                <span className="text-[9.5px] font-mono text-slate-500">13:00 - 21:00 GMT</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sessions.NewYork ? "bg-cyan-500/15 border-cyan-500" : "bg-slate-950 border-slate-800"}`}>
                {sessions.NewYork && <div className="w-2 h-2 rounded-full glow-indicator-cyan" />}
              </div>
            </button>

            <button
              onClick={() => handleSessionToggle("Asian")}
              className="w-full flex justify-between items-center cursor-pointer text-left"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Asian Airspace</span>
                <span className="text-[9.5px] font-mono text-slate-500">00:00 - 08:00 GMT</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sessions.Asian ? "bg-cyan-500/15 border-cyan-500" : "bg-slate-950 border-slate-800"}`}>
                {sessions.Asian && <div className="w-2 h-2 rounded-full glow-indicator-cyan" />}
              </div>
            </button>

          </div>
        </div>

      </div>

      {/* Safety Risk Alert */}
      <div className="mt-5 mb-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl flex gap-2 items-start text-[9.5px] font-sans text-amber-200/80 leading-relaxed">
        <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-amber-400 block uppercase tracking-wider mb-0.5">High Velocity Risk Caution</span>
          Increasing the Risk Allocation above 1.00% or Lot Size above 1.00 during overlapping London & New York session periods can amplify dynamic equity volatility. Correct stops are highly recommended.
        </div>
      </div>

    </div>
  );
}
