import React, { useEffect, useState } from "react";
import { Signal } from "../types";
import { RefreshCw, Radio, TrendingUp, TrendingDown, ShieldAlert, Cpu, Eye, Upload, FileText, Sparkles, CheckCircle2 } from "lucide-react";

interface SignalsViewProps {
  signals: Signal[];
  isLoading: boolean;
  onRefresh: () => void;
  onAnalyzeScreenshot: (image: string, pair: string) => Promise<{ flightPlan: string; isMock: boolean }>;
}

// 4 Custom High-Tech Mock MT5 Chart Thumbnails (Base64 or high-fidelity simulated chart grids)
const PRESET_CHARTS = [
  { id: "gold_h4", name: "XAUUSD H4 Breakout", pair: "XAUUSD", color: "from-amber-500/20 to-yellow-500/10" },
  { id: "nas_m15", name: "NAS100 M15 S&D sweep", pair: "NAS100", color: "from-cyan-500/20 to-blue-500/10" },
  { id: "us30_h1", name: "US30 H1 Orderblock", pair: "US30", color: "from-purple-500/20 to-purple-800/10" }
];

export default function SignalsView({ signals, isLoading, onRefresh, onAnalyzeScreenshot }: SignalsViewProps) {
  const [activeTab, setActiveTab] = useState<"SIGNALS" | "RECON">("SIGNALS");
  const [selectedPair, setSelectedPair] = useState("XAUUSD");
  const [reconImage, setReconImage] = useState<string | null>(null);
  const [reconResult, setReconResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccessAnalyzed, setIsSuccessAnalyzed] = useState(false);

  // Auto-refresh signals on load if empty
  useEffect(() => {
    if (signals.length === 0) {
      onRefresh();
    }
  }, []);

  // Handle preset chart selection
  const selectPresetChart = (preset: typeof PRESET_CHARTS[0]) => {
    setSelectedPair(preset.pair);
    // Create a beautifully styled high-tech simulated vector screenshot instead of loading complex static files
    // This allows immediate testing
    const fakeBase64 = "MOCK_BASE64_CHART_" + preset.id;
    setReconImage(fakeBase64);
    setReconResult(null);
    setIsSuccessAnalyzed(false);
  };

  // Handle custom image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReconImage(reader.result as string);
        setReconResult(null);
        setIsSuccessAnalyzed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Co-Pilot screenshot analyzer
  const handleExecuteScan = async () => {
    if (!reconImage) return;
    setIsAnalyzing(true);
    setReconResult(null);
    try {
      const result = await onAnalyzeScreenshot(reconImage, selectedPair);
      setReconResult(result.flightPlan);
      setIsSuccessAnalyzed(true);
    } catch (err) {
      setReconResult("Systems core telemetry failed. Please recheck server connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simple, elegant Markdown visual parser for the aviator report
  const renderFlightPlanReport = (reportText: string) => {
    if (!reportText) return null;
    const lines = reportText.split("\n");
    return (
      <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("###")) {
            return (
              <h4 key={idx} className="text-sm font-bold font-display text-cyan-400 mt-5 border-b border-slate-800/80 pb-1 text-shadow-cyan flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" />
                {trimmed.replace("###", "").trim()}
              </h4>
            );
          }
          if (trimmed.startsWith("**") && trimmed.includes(":")) {
            const split = trimmed.split(":");
            const label = split[0].replace(/\*\*/g, "").trim();
            const rest = split.slice(1).join(":").trim();
            return (
              <p key={idx} className="mt-1">
                <span className="text-cyan-300 font-semibold font-mono uppercase text-[10px] bg-cyan-950/30 border border-cyan-500/10 px-1.5 py-0.5 rounded mr-1">
                  {label}
                </span>{" "}
                {rest}
              </p>
            );
          }
          if (trimmed.startsWith("-")) {
            return (
              <li key={idx} className="list-none pl-4 relative before:content-['✈️'] before:absolute before:left-0 before:text-purple-400 before:text-[9px] mt-1">
                {trimmed.replace(/^-/, "").replace(/\*\*/g, "").trim()}
              </li>
            );
          }
          if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
            return (
              <p key={idx} className="text-amber-400/90 font-mono text-[10px] italic bg-amber-950/20 border border-amber-500/20 p-2 rounded-xl mt-3">
                {trimmed.replace(/\*/g, "").trim()}
              </p>
            );
          }
          return trimmed ? <p key={idx} className="mt-1">{trimmed.replace(/\*\*/g, "")}</p> : <div key={idx} className="h-2" />;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020205] text-slate-100 overflow-hidden font-sans">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 bg-white/5 p-2 gap-2 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab("SIGNALS")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold font-display tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "SIGNALS" ? "bg-white/10 border border-white/20 text-cyan-400 font-bold" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
        >
          <Radio size={13} className={activeTab === "SIGNALS" ? "animate-pulse" : ""} />
          AI LIVE SIGNALS
        </button>
        <button
          onClick={() => setActiveTab("RECON")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold font-display tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "RECON" ? "bg-white/10 border border-white/20 text-purple-400 font-bold" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
        >
          <Eye size={13} />
          VISUAL RECON
        </button>
      </div>

      {/* Primary Contents */}
      <div className="flex-grow overflow-y-auto p-4">
        
        {activeTab === "SIGNALS" ? (
          <div className="space-y-4">
            {/* Header with refresh */}
            <div className="flex justify-between items-center mb-1">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                  ACTIVE AIRSPACE FEED
                </span>
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Tactical Operations
                </h3>
              </div>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="cursor-pointer p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 transition-colors disabled:opacity-50"
                title="Synchronize Feed"
              >
                <RefreshCw size={13} className={isLoading ? "animate-spin text-cyan-400" : "text-cyan-400"} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-dashed border-cyan-500 rounded-full animate-spin mb-4" />
                <span className="text-xs font-mono text-cyan-400/80 animate-pulse uppercase">
                  Fetching Signals via Quantum Bridge...
                </span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {signals.map((sig) => (
                  <div key={sig.id} className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 relative overflow-hidden group">
                    {/* Glowing Accent */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${sig.direction === "BUY" ? "bg-cyan-500" : "bg-purple-500"}`} />

                    {/* Meta Head */}
                    <div className="flex justify-between items-start mb-2.5 pl-2.5">
                      <div>
                        <span className="text-sm font-extrabold font-display text-white tracking-wide uppercase">
                          {sig.pair}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block">
                          GEN: {sig.timeGenerated}
                        </span>
                      </div>

                      {/* Direction Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold ${sig.direction === "BUY" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                          {sig.direction}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-medium ${sig.riskLevel === "LOW" ? "bg-emerald-950/40 text-emerald-400" : sig.riskLevel === "MEDIUM" ? "bg-amber-950/40 text-amber-400" : "bg-red-950/40 text-red-400"}`}>
                          {sig.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* Coordinates Grid */}
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/80 font-mono text-center text-[10.5px]">
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Entry</span>
                        <span className="text-slate-200 font-bold mt-0.5 block">{sig.entryPrice}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Stop Loss</span>
                        <span className="text-red-400 font-bold mt-0.5 block">{sig.stopLoss}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Take Profit</span>
                        <span className="text-cyan-400 font-bold mt-0.5 block">{sig.takeProfit}</span>
                      </div>
                    </div>

                    {/* Confidence Slider */}
                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono pl-2.5">
                      <span className="text-slate-500 uppercase">Core Confidence:</span>
                      <span className="text-cyan-400 font-semibold">{sig.confidence}% Precision</span>
                    </div>
                    <div className="mt-1 h-1 bg-slate-900 rounded-full overflow-hidden ml-2.5">
                      <div 
                        className={`h-full rounded-full ${sig.direction === "BUY" ? "bg-gradient-to-r from-cyan-600 to-cyan-400" : "bg-gradient-to-r from-purple-600 to-purple-400"}`}
                        style={{ width: `${sig.confidence}%` }}
                      />
                    </div>

                    {/* Rationale description */}
                    {sig.rationale && (
                      <p className="mt-2.5 text-[10px] text-slate-400 leading-relaxed pl-2.5 border-l border-slate-800">
                        {sig.rationale}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Visual Recon view */}
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                AI COMPUTER VISION CO-PILOT
              </span>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mt-0.5">
                Chart Reconnaissance Scan
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload your MetaTrader 5 chart screenshot to map trend geometries and output automated tactical flight plans.
              </p>
            </div>

            {/* Target Asset selector */}
            <div className="grid grid-cols-3 gap-2">
              {["XAUUSD", "US30", "NQ100"].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPair(p)}
                  className={`py-1.5 rounded-xl font-display text-xs font-bold border transition-all cursor-pointer ${selectedPair === p ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300"}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Upload block / presets */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
              
              {reconImage ? (
                <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950 aspect-[16/9] flex items-center justify-center">
                  
                  {reconImage.startsWith("MOCK_") ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-2 animate-pulse">
                        <Cpu className="text-cyan-400" size={20} />
                      </div>
                      <span className="text-xs text-cyan-400 font-mono font-bold uppercase">{selectedPair} SCREENSHOT</span>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs font-mono">
                        Simulated vector MT5 screenshot package loaded. Ready for scan execution.
                      </p>
                    </div>
                  ) : (
                    <img src={reconImage} alt="Pilot Screenshot Upload" className="w-full h-full object-cover" />
                  )}

                  {/* Clear selection */}
                  <button
                    onClick={() => {
                      setReconImage(null);
                      setReconResult(null);
                      setIsSuccessAnalyzed(false);
                    }}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-[9px] font-mono px-2 py-1 rounded border border-slate-800 cursor-pointer uppercase"
                  >
                    Clear Image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-6 bg-slate-950/40 text-center relative group hover:border-cyan-500/30 transition-colors">
                  <Upload className="text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" size={24} />
                  <span className="text-xs text-slate-300 font-bold block uppercase tracking-wider">
                    Drag & Drop screenshot
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    MT5 Chart (PNG, JPG, or JPEG)
                  </span>
                  
                  {/* Real file uploader input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}

              {/* Preset selection fast trial */}
              {!reconImage && (
                <div className="mt-4">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest mb-2">
                    Or select high-fidelity telemetry chart
                  </span>
                  <div className="space-y-2">
                    {PRESET_CHARTS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPresetChart(p)}
                        className={`w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left p-2.5 rounded-xl flex justify-between items-center transition-colors cursor-pointer`}
                      >
                        <span className="text-xs text-slate-300 font-semibold">{p.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                          LOAD TELEMETRY <Eye size={11} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scan Action */}
            {reconImage && (
              <button
                onClick={handleExecuteScan}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-display text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    CO-PILOT ALIGNING SENSORS...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    EXECUTE CO-PILOT SCREENSHOT SCAN
                  </>
                )}
              </button>
            )}

            {/* Results Console */}
            {reconResult && (
              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-[#04060b] relative">
                {isSuccessAnalyzed && (
                  <div className="absolute top-2.5 right-2.5 text-emerald-400 flex items-center gap-1 font-mono text-[9px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 size={10} /> SCAN COMPLETE
                  </div>
                )}
                <h4 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase pb-2 border-b border-slate-800/60 flex items-center gap-1.5 mb-3">
                  <FileText size={11} className="text-cyan-500/60" /> Flight Plan Outputs
                </h4>

                {/* Analysis contents parsed */}
                <div className="overflow-x-auto max-h-[350px] pr-1">
                  {renderFlightPlanReport(reconResult)}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
