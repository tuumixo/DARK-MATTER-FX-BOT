import React, { useState } from "react";
import { Check, ShieldCheck, CreditCard, Lock, ArrowLeft, Star } from "lucide-react";

interface SubscriptionViewProps {
  currentLicense: string;
  onUpdateLicense: (level: "Free Trial" | "Android Premium" | "All-Access Master") => void;
}

const PLANS = [
  {
    id: "free",
    name: "Free Trial",
    price: "$0",
    period: "7 Days",
    features: ["Access basic USD setups", "Standard 1.00 Lot Size capped", "Daily calendar brief", "Manual signal syncs"],
    badge: "Cadet Link",
    level: "Free Trial" as const,
    color: "border-slate-800"
  },
  {
    id: "android",
    name: "Android License",
    price: "$49",
    period: "Monthly",
    features: ["Full MT5 Cloud link integration", "Unlimited Lot Calibration", "Real-time AI screenshot recon", "Push notification alert feed", "London & NY sessions activated"],
    badge: "Tactical Pilot",
    level: "Android Premium" as const,
    color: "border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.05)]",
    popular: true
  },
  {
    id: "pc",
    name: "PC License",
    price: "$99",
    period: "One-time",
    features: ["Dual PC & Mobile cloud syncs", "Ultra low-latency order router", "Advanced risk parameter triggers", "Custom VPS container hosting", "Dedicated VIP Priority Co-pilot support"],
    badge: "All-Access Master",
    level: "All-Access Master" as const,
    color: "border-purple-500/30"
  }
];

export default function SubscriptionView({ currentLicense, onUpdateLicense }: SubscriptionViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleChoosePlan = (plan: typeof PLANS[0]) => {
    setFeedbackMsg("");
    if (plan.id === "free") {
      onUpdateLicense("Free Trial");
      setFeedbackMsg("Free Trial activated. Safe flights!");
      return;
    }
    setSelectedPlan(plan);
    setPaymentSuccess(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg("");
    if (!cardNo || !expiry || !cvc) {
      setFeedbackMsg("Please fill in all security fields.");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      onUpdateLicense(selectedPlan!.level);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 p-4 overflow-y-auto font-sans grid-overlay">
      
      {feedbackMsg && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex justify-between items-center animate-pulse">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg("")} className="text-cyan-400 font-bold hover:text-white px-2 cursor-pointer">×</button>
        </div>
      )}
      
      {selectedPlan ? (
        // Checkout panel view
        <div className="space-y-4">
          <button
            onClick={() => setSelectedPlan(null)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft size={13} /> BACK TO LICENSES
          </button>

          <div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              SECURE CRYPTOGRAPHIC ENDPOINT
            </span>
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5">
              Secure Checkout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upgrading to <span className="text-cyan-400 font-bold">{selectedPlan.name}</span> ({selectedPlan.price} {selectedPlan.period === "Monthly" ? "/ Mo" : "Lifetime"}).
            </p>
          </div>

          {paymentSuccess ? (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 text-center space-y-3.5 bg-emerald-950/20">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide">
                  LICENSE ACTIVATED SUCCESSFULLY
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your MT5 server credentials have been upgraded. High-performance flight vectors are online!
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 px-5 rounded-xl transition-all font-display uppercase tracking-wider"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-3 font-mono">
                <span className="text-slate-400 uppercase">Upgrade License:</span>
                <span className="text-white font-bold">{selectedPlan.name}</span>
              </div>

              {/* Card number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  Credit Card Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <CreditCard size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNo}
                    onChange={(e) => setCardNo(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Exp and CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    Security CVC
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono text-center"
                  />
                </div>
              </div>

              {/* Payment trigger */}
              <button
                type="submit"
                disabled={isPaying}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPaying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AUTHORIZING VAULT TRANSACTION...
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    PAY {selectedPlan.price} SECURELY
                  </>
                )}
              </button>

              <div className="text-[9px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
                <ShieldCheck size={11} className="text-cyan-500/40" />
                SSL ENCRYPTED CO-PILOT BILLING PROTOCOL ACTIVE
              </div>
            </form>
          )}

        </div>
      ) : (
        // Plan listing view
        <div className="space-y-4">
          
          {/* Header */}
          <div className="mb-2 mt-1">
            <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">
              DARK MATTER SUBSCRIPTION VAULT
            </span>
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5">
              Choose Your Commission
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select the proper altitude level for your MT5 automated bot and co-pilot nodes.
            </p>
          </div>

          {/* Current Level Status badge */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Your Current Level:</span>
            <span className="text-cyan-400 font-extrabold font-display uppercase tracking-widest bg-cyan-950/30 border border-cyan-500/30 px-2.5 py-0.5 rounded">
              {currentLicense}
            </span>
          </div>

          {/* Plan items loop */}
          <div className="space-y-4">
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`glass-panel p-4 rounded-2xl border ${plan.color} relative overflow-hidden flex flex-col justify-between`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-slate-950 text-[8.5px] font-mono font-black px-3 py-1 uppercase rounded-bl tracking-wider flex items-center gap-1">
                    <Star size={9} fill="currentColor" /> MOST POPULAR
                  </div>
                )}

                {/* Plan meta block */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <span className="text-sm font-extrabold font-display text-white tracking-wide uppercase">
                        {plan.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase mt-0.5">
                        {plan.badge}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-cyan-400 font-display">
                        {plan.price}
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-500 block">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Feature items */}
                  <div className="space-y-2 mt-4 mb-5 text-[11px] text-slate-300">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <Check size={11} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger */}
                <button
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full py-2 rounded-xl text-xs font-bold font-display tracking-widest uppercase transition-all cursor-pointer ${plan.level === currentLicense ? "bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed" : plan.popular ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 neon-glow-cyan" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                  disabled={plan.level === currentLicense}
                >
                  {plan.level === currentLicense ? "ACTIVE LEVEL" : "COMMISSION NODE"}
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
