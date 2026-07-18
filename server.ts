import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 10mb limit for base64 screenshots
app.use(express.json({ limit: "10mb" }));

// Live simulator database state in-memory
let botState = {
  botStatus: "RUNNING", // "RUNNING" | "STOPPED"
  autoTrading: true,
  riskPercentage: 1.0,
  lotSize: 0.1,
  maxDailyTrades: 5,
  newsFilter: true,
  sessions: {
    London: true,
    NewYork: true,
    Asian: false,
  },
  brokerConnection: {
    status: "CONNECTED",
    brokerName: "Dark Matter Capital Ltd",
    accountNumber: "MT5-901048",
    balance: 10482.50,
    equity: 10512.20,
    margin: 210.00,
    floatingPl: 29.70,
    dailyProfit: 342.10,
    weeklyProfit: 1250.40,
    monthlyProfit: 4180.00,
    winRate: 74.5,
    totalTrades: 124,
    winningTrades: 92,
    losingTrades: 32,
    profitFactor: 2.14,
    drawdown: 3.8,
  }
};

// In-memory trade logs for simulated notifications
let simulatedNotifications = [
  { id: "1", title: "Trade Opened", body: "BOT: BUY XAUUSD @ 2415.30 opened successfully.", time: "10 mins ago", type: "TRADE" },
  { id: "2", title: "Take Profit Hit", body: "BOT: NAS100 SELL hit TP @ 19210.50 (+120 pips).", time: "1 hour ago", type: "TRADE" },
  { id: "3", title: "News Warning", body: "RADER INTEL: High Impact FOMC Economic Release in 30 minutes.", time: "2 hours ago", type: "NEWS" },
  { id: "4", title: "System Update", body: "Algorithm core upgraded to DARK MATTER FX v4.1.", time: "1 day ago", type: "BOT" },
];

// Lazy initializer for Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// ---------------- API ENDPOINTS ----------------

// Get status
app.get("/api/bot-state", (req: Request, res: Response) => {
  res.json(botState);
});

// Update status
app.post("/api/bot-state/update", (req: Request, res: Response) => {
  const updates = req.body;
  if (updates) {
    botState = { ...botState, ...updates };
    if (updates.brokerConnection) {
      botState.brokerConnection = { ...botState.brokerConnection, ...updates.brokerConnection };
    }
    // Return the updated state
    res.json({ success: true, botState });
  } else {
    res.status(400).json({ error: "Invalid updates provided" });
  }
});

// Fetch simulated notifications
app.get("/api/notifications", (req: Request, res: Response) => {
  res.json(simulatedNotifications);
});

// Post a new simulated notification
app.post("/api/notifications", (req: Request, res: Response) => {
  const { title, body, type } = req.body;
  const newNotif = {
    id: Date.now().toString(),
    title: title || "Alert",
    body: body || "Details",
    time: "Just now",
    type: type || "BOT",
  };
  simulatedNotifications.unshift(newNotif);
  res.json({ success: true, notification: newNotif });
});

// Economic calendar mockup list (High impact list)
app.get("/api/economic-calendar", (req: Request, res: Response) => {
  res.json([
    { event: "CPI m/m (Consumer Price Index)", country: "USD", impact: "HIGH", forecast: "0.2%", previous: "0.1%", actual: "0.2%", status: "RELEASED", date: "Today" },
    { event: "Core Retail Sales m/m", country: "USD", impact: "HIGH", forecast: "0.3%", previous: "0.2%", actual: "0.4%", status: "RELEASED", date: "Today" },
    { event: "NFP (Non-Farm Employment Change)", country: "USD", impact: "HIGH", forecast: "185K", previous: "206K", actual: "", status: "PENDING", date: "Tomorrow, 13:30" },
    { event: "Unemployment Rate", country: "USD", impact: "HIGH", forecast: "4.1%", previous: "4.0%", actual: "", status: "PENDING", date: "Tomorrow, 13:30" },
    { event: "FOMC Interest Rate Decision", country: "USD", impact: "HIGH", forecast: "5.25%", previous: "5.25%", actual: "", status: "PENDING", date: "Next Week" },
    { event: "GDP q/q Advanced", country: "USD", impact: "HIGH", forecast: "2.5%", previous: "2.1%", actual: "", status: "PENDING", date: "In 5 Days" },
  ]);
});

// AI Signal generator (Gemini or Mock fallback)
app.get("/api/signals", async (req: Request, res: Response) => {
  const client = getGeminiClient();

  if (!client) {
    // Return high quality simulation signals if Gemini API Key isn't configured
    console.log("No Gemini API key or standard initialization. Returning robust simulated signals.");
    return res.json(getMockSignals());
  }

  try {
    const prompt = `You are the master algorithmic routing core 'DARK MATTER FX'.
    Generate 6 high-accuracy tactical trade setups for: XAUUSD, EURUSD, GBPUSD, USDJPY, NAS100, and US30.
    For each asset, determine the ideal setup based on typical market structure (either Bullish, Bearish, or range consolidation).
    Return the output STRICTLY as a JSON array where each item has this schema:
    {
      "id": "XAUUSD" | "EURUSD" | "GBPUSD" | "USDJPY" | "NAS100" | "US30",
      "pair": string,
      "direction": "BUY" | "SELL",
      "entryPrice": number (accurate to current exchange rates, e.g., XAUUSD around 2420, NAS100 around 19000, US30 around 40000, EURUSD 1.08),
      "stopLoss": number,
      "takeProfit": number,
      "confidence": number (between 70 and 99),
      "riskLevel": "LOW" | "MEDIUM" | "HIGH",
      "timeGenerated": string (e.g. "Just now" or "5 mins ago"),
      "rationale": string (brief, analytical military/aviation style flight-path rationale, e.g., "Liquidity grab at 2405 completed; ascending altitude channel indicates bullish liftoff.")
    }
    Generate raw JSON format. No markdown, no backticks, no comments.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are the advanced Forex Algorithmic Navigator core DARK MATTER FX. You communicate in tactical, aviation, and pilot terminology.",
      }
    });

    const jsonText = response.text?.trim() || "[]";
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini signals error:", error);
    // Fallback gracefully to simulated setups so the app never breaks
    res.json(getMockSignals());
  }
});

// AI Screenshot analyzer (Gemini or Mock fallback)
app.post("/api/gemini/analyze", async (req: Request, res: Response) => {
  const { image, selectedPair } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing image data" });
  }

  const client = getGeminiClient();
  const pair = selectedPair || "XAUUSD";

  // Format standard base64 for Gemini
  let base64Data = image;
  if (base64Data.includes("base64,")) {
    base64Data = base64Data.split("base64,")[1];
  }

  if (!client) {
    console.log("No Gemini API key available. Running mock image intelligence analysis.");
    // Wait a brief moment to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return res.json({
      success: true,
      flightPlan: getMockFlightPlan(pair),
      isMock: true,
    });
  }

  try {
    const promptInstructions = `
    You are the tactical co-pilot bot 'DARK MATTER FX' (Aviator/Pilot Persona).
    Analyze this MetaTrader 5 (MT5) chart screenshot of ${pair} objectively.
    Provide a professional, technical assessment detailing:
    1. MARKET STRUCTURE & ALTITUDE (Bullish / Bearish / Range-bound with specific price action details)
    2. CO-PILOT RADAR ZONES (Key Visible Support & Resistance zones)
    3. PATTERNS & FLIGHT VECTOR (Indicator behaviors observed, MAs, MACD, or RSI if visible)
    4. TACTICAL FLIGHT PLAN (Potential Entry Zone, defensive Stop Loss placement, and Primary Target altitude levels based on structure).
    
    Maintain a highly professional, cautious, and analytical aviator tone. Do not guarantee results. Acknowledge the high-impact risk of Forex trading. Avoid excessive hype. Present with clear formatting.
    `;

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    };

    const textPart = {
      text: promptInstructions,
    };

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
    });

    res.json({
      success: true,
      flightPlan: response.text,
      isMock: false,
    });

  } catch (error: any) {
    console.error("Gemini screenshot analysis failed:", error);
    res.json({
      success: true,
      flightPlan: `### SYSTEMS OVERHEATED DURING RADAR SCAN\n\n[FALLBACK TELEMETRY FOR ${pair}]\n\nUnable to access deep Gemini cloud nodes. Direct telemetry indicates:\n1. **Market Structure**: Consolidated ascending triangle formation on H4 timeframe.\n2. **Radar Support/Resistance**: Support holding firmly at $2,410.00; resistance capping progress at $2,442.00.\n3. **Indicators**: 50 EMA is currently acting as dynamic altitude support.\n4. **Tactical Path**: Suggesting BUY entry near $2,415.00 with STOP LOSS at $2,402.00, and TARGET at $2,438.00. Maintain high vigilance due to high volatility.`,
      isMock: true,
    });
  }
});

// Helper Mock Signals Creator
function getMockSignals() {
  return [
    {
      id: "XAUUSD",
      pair: "XAUUSD (Gold)",
      direction: "BUY",
      entryPrice: 2415.50,
      stopLoss: 2402.00,
      takeProfit: 2445.00,
      confidence: 89,
      riskLevel: "MEDIUM",
      timeGenerated: "5 mins ago",
      rationale: "Double bottom at local support channel. Ascension vectors aligned for tactical bullish lift-off."
    },
    {
      id: "US30",
      pair: "US30 (Dow Jones)",
      direction: "SELL",
      entryPrice: 40120.00,
      stopLoss: 40280.00,
      takeProfit: 39820.00,
      confidence: 78,
      riskLevel: "HIGH",
      timeGenerated: "12 mins ago",
      rationale: "Bearish engulfing candle on H1 resistance. Major indexes facing headwind pressure. Descending altitude expected."
    },
    {
      id: "NAS100",
      pair: "NAS100 (Nasdaq)",
      direction: "BUY",
      entryPrice: 19140.00,
      stopLoss: 19010.00,
      takeProfit: 19380.00,
      confidence: 82,
      riskLevel: "HIGH",
      timeGenerated: "18 mins ago",
      rationale: "Bouncing from oversold dynamic 200 EMA. Cybernetic structure shows liquidity sweep completed."
    },
    {
      id: "EURUSD",
      pair: "EURUSD",
      direction: "BUY",
      entryPrice: 1.0820,
      stopLoss: 1.0785,
      takeProfit: 1.0895,
      confidence: 74,
      riskLevel: "LOW",
      timeGenerated: "35 mins ago",
      rationale: "Consolidation break out with high-volume support. Clear skies up to next daily resistance cluster."
    },
    {
      id: "GBPUSD",
      pair: "GBPUSD",
      direction: "SELL",
      entryPrice: 1.2850,
      stopLoss: 1.2910,
      takeProfit: 1.2740,
      confidence: 81,
      riskLevel: "MEDIUM",
      timeGenerated: "48 mins ago",
      rationale: "Rejection at weekly supply pool. Downside draft forming under current price altitude."
    },
    {
      id: "USDJPY",
      pair: "USDJPY",
      direction: "SELL",
      entryPrice: 156.40,
      stopLoss: 157.10,
      takeProfit: 154.80,
      confidence: 76,
      riskLevel: "MEDIUM",
      timeGenerated: "1 hour ago",
      rationale: "BoJ intervention risk warning. Market structural momentum shifts bearish on lower timeframes."
    }
  ];
}

// Helper Mock Flight Plan Creator
function getMockFlightPlan(pair: string): string {
  return `### ✈️ DARK MATTER FX — FLIGHT PLAN INTEL (${pair})

**1. MARKET STRUCTURE & ALTITUDE**
- **Vector**: Strong Bullish structural flow identified on the H1/H4 timeframes.
- **Altitude**: Current price action is trading above both the 50-period and 200-period Exponential Moving Averages, demonstrating robust upward velocity.
- **Scan**: Price swept local sell-side liquidity prior to launching this current expansion leg.

**2. CO-PILOT RADAR ZONES (Support & Resistance)**
- **Primary Supply Zone (Resistance)**: Capping local ceiling at **${pair === "XAUUSD" ? "$2,438.00" : pair === "NAS100" ? "19,350" : "40,300"}**. A daily close above this level clears the skies for further climb.
- **Primary Demand Pool (Support)**: Holding dynamic floor at **${pair === "XAUUSD" ? "$2,408.00" : pair === "NAS100" ? "19,020" : "39,850"}**. Institutional order blocks reside in this vicinity.

**3. INDICATORS & FLIGHT VECTOR**
- **RSI (14)**: Oscillating at 61.3. Standard expansion territory; not yet inside overbought redline parameters.
- **Volume Metrics**: Positive delta volume confirms buying pressure is backing the current market vector.

**4. TACTICAL FLIGHT PLAN (Trade Coordinates)**
- **Ideal Launch Zone (Entry)**: Near minor retracement zones around **${pair === "XAUUSD" ? "$2,416.00" : pair === "NAS100" ? "19,150" : "40,050"}**.
- **Defensive Stop Loss**: Positioned securely below the dynamic dynamic order block invalidation level at **${pair === "XAUUSD" ? "$2,402.00" : pair === "NAS100" ? "18,980" : "39,780"}**.
- **Primary Target Altitude (TP1)**: **${pair === "XAUUSD" ? "$2,434.00" : pair === "NAS100" ? "19,300" : "40,280"}** (Risk to Reward ratio 1:2.1).
- **Secondary Target Altitude (TP2)**: **${pair === "XAUUSD" ? "$2,448.00" : pair === "NAS100" ? "19,450" : "40,450"}**.

*⚠️ CO-PILOT RISK ADVISORY: Forex and CFD algos carry high leverage risk. This flight plan is for structural informational mapping only. Ensure your MT5 risk parameters are calibrated prior to takeoff.*`;
}

// Vite integration middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DARK MATTER FX Co-Pilot Server booted on http://localhost:${PORT}`);
  });
}

startServer();
