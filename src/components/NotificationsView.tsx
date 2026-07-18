import React, { useEffect, useState } from "react";
import { NotificationItem } from "../types";
import { Bell, Info, ShieldAlert, CheckCircle, Flame, Trash2, Plus } from "lucide-react";

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifs = () => {
    setIsLoading(true);
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setIsLoading(false);
      })
      .catch(() => {
        setNotifications([
          { id: "1", title: "Trade Opened", body: "BOT: BUY XAUUSD @ 2415.30 opened successfully.", time: "10 mins ago", type: "TRADE" },
          { id: "2", title: "Take Profit Hit", body: "BOT: NAS100 SELL hit TP @ 19210.50 (+120 pips).", time: "1 hour ago", type: "TRADE" },
          { id: "3", title: "News Warning", body: "RADER INTEL: High Impact FOMC Economic Release in 30 minutes.", time: "2 hours ago", type: "NEWS" },
        ]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleClear = () => {
    setNotifications([]);
  };

  // Triggers a simulated active trade notification to show the alert system in real-time
  const handleTriggerMockAlert = () => {
    const alerts = [
      { title: "Scalper Executed", body: "BOT: BUY EURUSD @ 1.0825 triggered via local H1 Order Block.", type: "TRADE" },
      { title: "Risk Buffer Triggered", body: "CORE: ASIAN session ended. Automatic lot sizing recalibrated.", type: "BOT" },
      { title: "Macro Shock warning", body: "RADER: High Impact Unemployment figures pending release.", type: "NEWS" }
    ];
    
    const chosen = alerts[Math.floor(Math.random() * alerts.length)];

    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chosen)
    })
    .then((res) => res.json())
    .then(() => {
      fetchNotifs();
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 mt-1">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            SECURE TELEMETRY ALERT LOG
          </span>
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
            <Bell size={15} className="text-cyan-400" />
            Alert Dashboard
          </h3>
        </div>

        {/* Clear and trigger buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={handleTriggerMockAlert}
            className="cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold px-2 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1"
            title="Inject Mock Alert"
          >
            <Plus size={11} /> MOCK ALERT
          </button>
          
          {notifications.length > 0 && (
            <button
              onClick={handleClear}
              className="cursor-pointer bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-red-400 text-[10px] p-1.5 rounded-lg border border-slate-900 transition-colors"
              title="Clear Console Logs"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 flex-grow">
          <div className="w-8 h-8 border-2 border-dashed border-cyan-500 rounded-full animate-spin mr-3" />
          <span className="text-xs font-mono text-cyan-400">Loading Log Streams...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600 mb-3">
            <Bell size={20} />
          </div>
          <span className="text-xs font-semibold text-slate-400">All Clear: No System Alarms</span>
          <p className="text-[10px] text-slate-600 mt-1 max-w-xs font-mono uppercase">
            No active trades, news breaches, or connection slips identified.
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-grow">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`glass-panel p-3.5 rounded-2xl border flex gap-3 relative items-start transition-all duration-300 ${notif.type === "NEWS" ? "border-amber-500/15" : notif.type === "TRADE" ? "border-cyan-500/15" : "border-slate-800/80"}`}
            >
              {/* Type Indicator Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {notif.type === "TRADE" && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <CheckCircle size={14} />
                  </div>
                )}
                {notif.type === "NEWS" && (
                  <div className="w-7 h-7 rounded-lg bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Flame size={14} />
                  </div>
                )}
                {notif.type === "BOT" && (
                  <div className="w-7 h-7 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Info size={14} />
                  </div>
                )}
                {notif.type === "ALERT" && (
                  <div className="w-7 h-7 rounded-lg bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400">
                    <ShieldAlert size={14} />
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white tracking-wide font-display uppercase">
                    {notif.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {notif.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer warning info */}
      <div className="mt-6 flex items-center gap-1.5 justify-center text-[10px] font-mono text-slate-600">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        SECURE ALARM CONSOLE RUNNING ISOLATED SESSIONS
      </div>

    </div>
  );
}
