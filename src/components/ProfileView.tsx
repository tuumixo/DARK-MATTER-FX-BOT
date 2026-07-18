import React, { useState } from "react";
import { BotState, UserProfile } from "../types";
import { User, ShieldAlert, Key, HelpCircle, FileLock, LogOut, Check, ToggleLeft, ToggleRight, Settings, Globe, BellRing, Fingerprint } from "lucide-react";

interface ProfileViewProps {
  botState: BotState;
  onUpdateState: (updates: Partial<BotState>) => void;
  userName: string;
  userEmail: string;
  onUpdateUser: (name: string, email: string) => void;
  onLogout: () => void;
}

const FAQ_ITEMS = [
  { q: "How do I connect DARK MATTER FX to my MetaTrader 5 account?", a: "Go to Profile Settings > Broker Connection inside this app. Provide your MT5 broker server name, login, and investor password to activate direct telemetry. Ensure your local VPS runs the Dark Matter EA terminal." },
  { q: "Does this algorithm guarantee dynamic trading profits?", a: "No. DARK MATTER FX is designed as a structural and algorithmic companion. Forex and CFD products involve massive leverage risks. All trades are executed client-side via your authorized endpoints. Past metrics are backtest estimates." },
  { q: "What is the 'High-Impact News Shield' parameter?", a: "This automatic guard monitors our Economic Calendar feed. It dynamically places your running algorithm in pause mode 30 minutes before and after high-impact events like CPI, NFP, and FOMC." }
];

export default function ProfileView({ botState, onUpdateState, userName, userEmail, onUpdateUser, onLogout }: ProfileViewProps) {
  const [activeSection, setActiveSection] = useState<"MAIN" | "EDIT" | "BROKER" | "FAQ" | "PRIVACY">("MAIN");
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editBroker, setEditBroker] = useState(botState.brokerConnection.brokerName);
  const [editAccount, setEditAccount] = useState(botState.brokerConnection.accountNumber);
  
  // Settings values inside state
  const [pushNotifs, setPushNotifs] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editEmail) return;
    onUpdateUser(editName, editEmail);
    setActiveSection("MAIN");
    setFeedbackMsg("Pilot parameters updated.");
  };

  const handleUpdateBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      brokerConnection: {
        ...botState.brokerConnection,
        brokerName: editBroker,
        accountNumber: editAccount,
      }
    });
    setActiveSection("MAIN");
    setFeedbackMsg("MT5 link coordinates updated.");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {feedbackMsg && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex justify-between items-center animate-pulse">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg("")} className="text-cyan-400 font-bold hover:text-white px-2 cursor-pointer">×</button>
        </div>
      )}
      
      {activeSection === "MAIN" && (
        <div className="space-y-5">
          
          {/* Pilot Summary Block */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-900 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-[#02040a] rounded-full flex items-center justify-center font-display font-extrabold text-cyan-400 text-lg uppercase text-shadow-cyan">
                {userName.charAt(0)}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-white tracking-wide uppercase">
                {userName}
              </h4>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Primary Operations List */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest pl-1">
              Command Controls
            </span>

            {/* Edit Profile */}
            <button
              onClick={() => setActiveSection("EDIT")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-900/80 rounded-xl p-3 flex justify-between items-center text-xs text-left cursor-pointer transition-colors"
            >
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <User size={13} className="text-cyan-400" /> Edit Pilot Profile
              </span>
              <span className="text-slate-600 text-[11px] font-mono uppercase">Update</span>
            </button>

            {/* Broker connection settings */}
            <button
              onClick={() => setActiveSection("BROKER")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-900/80 rounded-xl p-3 flex justify-between items-center text-xs text-left cursor-pointer transition-colors"
            >
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Settings size={13} className="text-cyan-400" /> MT5 Broker Integration
              </span>
              <span className="text-slate-600 text-[11px] font-mono uppercase">Configure</span>
            </button>

            {/* FAQ */}
            <button
              onClick={() => setActiveSection("FAQ")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-900/80 rounded-xl p-3 flex justify-between items-center text-xs text-left cursor-pointer transition-colors"
            >
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <HelpCircle size={13} className="text-cyan-400" /> Frequently Asked Questions
              </span>
              <span className="text-slate-600 text-[11px] font-mono uppercase">Info</span>
            </button>

            {/* Privacy Policy */}
            <button
              onClick={() => setActiveSection("PRIVACY")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-900/80 rounded-xl p-3 flex justify-between items-center text-xs text-left cursor-pointer transition-colors"
            >
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <FileLock size={13} className="text-cyan-400" /> Algorithmic Disclosure & Privacy
              </span>
              <span className="text-slate-600 text-[11px] font-mono uppercase">Read</span>
            </button>
          </div>

          {/* Integrated Settings block as requested in specifications */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-4">
            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest pb-1 border-b border-slate-800/40">
              CO-PILOT APPLICATION SETTINGS
            </span>

            {/* Push Notifications Setting */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <BellRing size={12} className="text-cyan-400/80" /> Push Signal Alerts
                </span>
                <span className="text-[10px] text-slate-500">Enable instant notification popups</span>
              </div>
              <button
                onClick={() => setPushNotifs(!pushNotifs)}
                className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {pushNotifs ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            {/* Biometrics login setting */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Fingerprint size={12} className="text-cyan-400/80" /> Biometric Access Link
                </span>
                <span className="text-[10px] text-slate-500">Use Android Fingerprint / Face Unlock</span>
              </div>
              <button
                onClick={() => setBiometrics(!biometrics)}
                className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {biometrics ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            {/* Language dropdown */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Globe size={12} className="text-cyan-400/80" /> System Flight Language
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] py-1 px-2.5 rounded-lg outline-none font-mono"
              >
                <option value="EN">EN (English)</option>
                <option value="ES">ES (Spanish)</option>
                <option value="DE">DE (German)</option>
                <option value="JP">JP (Japanese)</option>
              </select>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="w-full bg-slate-950 border border-slate-900 text-red-400 hover:text-red-300 hover:bg-slate-900 rounded-xl p-3 flex justify-center items-center text-xs gap-2 font-display font-semibold transition-colors mt-6 cursor-pointer"
          >
            <LogOut size={13} /> DISENGAGE SECURE LINK (LOGOUT)
          </button>

        </div>
      )}

      {/* Edit Profile Form */}
      {activeSection === "EDIT" && (
        <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
          <div>
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Edit Pilot Profile
            </h3>
            <p className="text-[11px] text-slate-500">Modify your secure application identity coordinates.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Pilot Call Sign (Full Name)
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Encrypted Mail Address
            </label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setActiveSection("MAIN")}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer text-center"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md cursor-pointer text-center"
            >
              SAVE UPDATES
            </button>
          </div>
        </form>
      )}

      {/* Broker configuration panel */}
      {activeSection === "BROKER" && (
        <form onSubmit={handleUpdateBrokerSubmit} className="space-y-4">
          <div>
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              MT5 Link Configurations
            </h3>
            <p className="text-[11px] text-slate-500">Set the API bridge credentials to communicate with your algos.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Liquidity Provider Broker Name
            </label>
            <input
              type="text"
              required
              value={editBroker}
              onChange={(e) => setEditBroker(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              MT5 MetaTrader Login ID
            </label>
            <input
              type="text"
              required
              value={editAccount}
              onChange={(e) => setEditAccount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Investor Safe Access Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none font-mono"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setActiveSection("MAIN")}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer text-center"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md cursor-pointer text-center"
            >
              CALIBRATE PORT
            </button>
          </div>
        </form>
      )}

      {/* Frequently Asked Questions FAQ details */}
      {activeSection === "FAQ" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Support Manual FAQs
              </h3>
              <p className="text-[11px] text-slate-500">Critical answers to assist your co-pilot operations.</p>
            </div>
            <button
              onClick={() => setActiveSection("MAIN")}
              className="text-xs text-cyan-400 hover:underline cursor-pointer font-mono"
            >
              BACK
            </button>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="glass-panel rounded-xl border border-slate-900 overflow-hidden">
                <button
                  onClick={() => setFaqExpanded(faqExpanded === idx ? null : idx)}
                  className="w-full p-3.5 text-left text-xs font-bold font-display text-slate-100 flex justify-between items-center hover:bg-slate-950/40 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-cyan-400 text-xs font-mono">{faqExpanded === idx ? "[-]" : "[+]"}</span>
                </button>
                {faqExpanded === idx && (
                  <p className="p-3.5 bg-slate-950/40 border-t border-slate-950 text-[11px] text-slate-400 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithmic Disclosure & Privacy Policy */}
      {activeSection === "PRIVACY" && (
        <div className="space-y-4 font-sans text-xs text-slate-300 leading-relaxed">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Leverage Risk Disclosure
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">ENCRYPTED CO-PILOT AUDIT PROTOCOL</p>
            </div>
            <button
              onClick={() => setActiveSection("MAIN")}
              className="text-xs text-cyan-400 hover:underline cursor-pointer font-mono"
            >
              BACK
            </button>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-900 bg-[#04060b] space-y-3">
            <p>
              <strong>1. Leveraged Volatility Disclaimer:</strong> Leveraged CFD contracts represent high-velocity volatility risk to personal custody capital. Over-exposure, lack of stop structures, or connection dropouts can damage margins rapidly.
            </p>
            <p>
              <strong>2. Information-Only Mapping:</strong> All signals, visual flight plan recons, and coordinate zones produced via Gemini AI endpoints are provided for informational tracking only. DARK MATTER FX does not guarantee profitability or simulate live client accounts.
            </p>
            <p>
              <strong>3. Cryptographic Isolation:</strong> To safeguard your broker passwords, DARK MATTER FX runs in container-isolated sandboxes utilizing AES-256 local encrypted storage. No broker custody keys are persistent inside remote database fields.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
