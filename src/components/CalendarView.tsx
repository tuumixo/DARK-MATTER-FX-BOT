import React, { useEffect, useState } from "react";
import { EconomicEvent } from "../types";
import { Calendar, AlertCircle, Clock, CheckCircle, HelpCircle } from "lucide-react";

export default function CalendarView() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/economic-calendar")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        // Fallback mockup
        setEvents([
          { event: "CPI m/m (Consumer Price Index)", country: "USD", impact: "HIGH", forecast: "0.2%", previous: "0.1%", actual: "0.2%", status: "RELEASED", date: "Today" },
          { event: "Core Retail Sales m/m", country: "USD", impact: "HIGH", forecast: "0.3%", previous: "0.2%", actual: "0.4%", status: "RELEASED", date: "Today" },
          { event: "NFP (Non-Farm Employment Change)", country: "USD", impact: "HIGH", forecast: "185K", previous: "206K", actual: "", status: "PENDING", date: "Tomorrow, 13:30" },
          { event: "Unemployment Rate", country: "USD", impact: "HIGH", forecast: "4.1%", previous: "4.0%", actual: "", status: "PENDING", date: "Tomorrow, 13:30" },
        ]);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {/* Header */}
      <div className="mb-4 mt-1">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
          RADAR INTELLIGENCE
        </span>
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
          <Calendar size={15} className="text-cyan-400" />
          Macroeconomic Calendar
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Monitoring high-impact global macroeconomic indicators linked to USD, EUR & GBP pairs.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 flex-grow">
          <div className="w-8 h-8 border-2 border-dashed border-cyan-500 rounded-full animate-spin mr-3" />
          <span className="text-xs font-mono text-cyan-400">Loading Radar Feed...</span>
        </div>
      ) : (
        <div className="space-y-4 flex-grow">
          
          {events.map((ev, index) => (
            <div 
              key={index} 
              className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${ev.status === "PENDING" ? "border-purple-500/15" : "border-slate-800/80"}`}
            >
              {/* Event Metadata Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-slate-950 border border-slate-900 text-slate-300 mr-2">
                    {ev.country}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${ev.impact === "HIGH" ? "bg-red-950/40 text-red-400 border border-red-500/10 animate-pulse" : "bg-amber-950/40 text-amber-400"}`}>
                    {ev.impact} IMPACT
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-500">
                  {ev.status === "RELEASED" ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle size={10} /> RELEASED
                    </span>
                  ) : (
                    <span className="text-purple-400 flex items-center gap-1">
                      <Clock size={10} className="animate-spin" style={{ animationDuration: "12s" }} /> {ev.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-white font-display uppercase tracking-wide leading-snug">
                {ev.event}
              </h4>

              {/* Forecast Grid */}
              <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-900 font-mono text-center text-[10px]">
                <div className="bg-[#03060c] py-1 rounded">
                  <span className="text-slate-500 block text-[8px] uppercase">Forecast</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{ev.forecast || "--"}</span>
                </div>
                <div className="bg-[#03060c] py-1 rounded">
                  <span className="text-slate-500 block text-[8px] uppercase">Previous</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{ev.previous || "--"}</span>
                </div>
                <div className="bg-[#03060c] py-1 rounded">
                  <span className="text-slate-500 block text-[8px] uppercase">Actual</span>
                  <span className={`font-bold block mt-0.5 ${ev.actual ? "text-cyan-400" : "text-slate-500"}`}>
                    {ev.actual || "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Warning info */}
      <div className="mt-4 p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex gap-2 items-start text-[9.5px] font-sans text-red-200/80 leading-relaxed">
        <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-red-400 block uppercase tracking-wider mb-0.5">High Impact Warning</span>
          CPI, NFP, and FOMC meetings cause major dynamic slippage risks inside MT5 accounts. Check that your Bot Control "News Shield" is engaged prior to these dates.
        </div>
      </div>

    </div>
  );
}
