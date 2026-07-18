import React from "react";
import { BotState } from "../types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from "recharts";
import { BarChart3, TrendingUp, ShieldAlert, Award, Star, ArrowUpRight } from "lucide-react";

interface AnalyticsViewProps {
  botState: BotState;
}

// Monthly balance growth simulated history
const GROWTH_DATA = [
  { name: "Jan", balance: 5000, profit: 0 },
  { name: "Feb", balance: 5400, profit: 400 },
  { name: "Mar", balance: 6200, profit: 1200 },
  { name: "Apr", balance: 7100, profit: 2100 },
  { name: "May", balance: 8300, profit: 3300 },
  { name: "Jun", balance: 9500, profit: 4500 },
  { name: "Jul", balance: 10482, profit: 5482 },
];

export default function AnalyticsView({ botState }: AnalyticsViewProps) {
  const { brokerConnection } = botState;
  
  // Wins vs Losses pie chart parameters
  const pieData = [
    { name: "Winning Trades", value: brokerConnection.winningTrades, color: "#22d3ee" },
    { name: "Losing Trades", value: brokerConnection.losingTrades, color: "#a855f7" }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {/* Header */}
      <div className="mb-4 mt-1">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
          PERFORMANCE AUDIT
        </span>
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
          <BarChart3 size={15} className="text-cyan-400" />
          Quantum Analytics
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Calibrated metrics mapping algorithm win metrics and balance trajectory history.
        </p>
      </div>

      {/* Hero Stats Bento Block */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        
        {/* Win Rate Meter */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-cyan-400/30">
            <Award size={13} />
          </div>
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Win Ratio</span>
          <span className="text-xl font-black font-display text-cyan-400 block mt-1 text-shadow-cyan">
            {brokerConnection.winRate}%
          </span>
          <span className="text-[9.5px] font-mono text-slate-400 block mt-1">
            {brokerConnection.winningTrades}W / {brokerConnection.losingTrades}L
          </span>
        </div>

        {/* Profit Factor */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-purple-400/30">
            <Star size={13} />
          </div>
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Profit Factor</span>
          <span className="text-xl font-black font-display text-purple-400 block mt-1 text-shadow-purple">
            {brokerConnection.profitFactor}
          </span>
          <span className="text-[9.5px] font-mono text-emerald-400 block mt-1 flex items-center justify-center gap-0.5">
            OPTIMIZED <ArrowUpRight size={10} />
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Chart (Account Growth) */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 mb-5 relative">
        <span className="text-[9.5px] font-mono text-slate-500 block uppercase tracking-widest mb-3">
          Cumulative Capital Growth Trajectory (USD)
        </span>
        
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={9} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#475569" 
                fontSize={9} 
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#030712", 
                  borderColor: "rgba(34, 211, 238, 0.2)",
                  borderRadius: "12px",
                  fontSize: "10px",
                  color: "#e2e8f0" 
                }}
                formatter={(value: any) => [formatCurrency(value), "Equity"]}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#22d3ee" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#cyanGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of secondary statistics */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        
        {/* Drawdown */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Max Drawdown</span>
          <span className="text-base font-bold font-display text-emerald-400 mt-1 block">
            {brokerConnection.drawdown}%
          </span>
          <span className="text-[8.5px] font-mono text-slate-500 block mt-1 uppercase">
            Limit Margin Guard Safe
          </span>
        </div>

        {/* Total trades */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Completed Trades</span>
          <span className="text-base font-bold font-display text-white mt-1 block">
            {brokerConnection.totalTrades} Setup Cycles
          </span>
          <span className="text-[8.5px] font-mono text-slate-500 block mt-1 uppercase">
            No dynamic duplicates
          </span>
        </div>

      </div>

      {/* Winning vs Losing Trades PieChart Representation */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
        
        {/* Legends on Left */}
        <div className="space-y-3">
          <span className="text-[9.5px] font-mono text-slate-500 block uppercase tracking-widest">
            Outcome Distributions
          </span>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <div className="text-xs">
              <span className="text-slate-300 font-semibold block">Wins</span>
              <span className="text-[10px] text-slate-500">{brokerConnection.winningTrades} orders hit TP bounds</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <div className="text-xs">
              <span className="text-slate-300 font-semibold block">Losses</span>
              <span className="text-[10px] text-slate-500">{brokerConnection.losingTrades} orders triggered SL limits</span>
            </div>
          </div>
        </div>

        {/* Recharts PieChart */}
        <div className="w-24 h-24 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={38}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central Win-rate Overlay */}
          <span className="absolute text-[10px] font-bold font-mono text-cyan-400">
            {brokerConnection.winRate}%
          </span>
        </div>

      </div>

      {/* Safety Notice */}
      <div className="mt-5 mb-2 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex gap-2 items-start text-[9.5px] font-sans text-purple-300/80 leading-relaxed">
        <ShieldAlert size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-purple-300 block uppercase tracking-wider mb-0.5">Historical Simulation Disclaimer</span>
          Past metrics completed inside backtesting sandboxes do not represent ironclad guarantees of future trade performance under dynamic market conditions. Always monitor active drawdowns.
        </div>
      </div>

    </div>
  );
}
