export type Page =
  | "SPLASH"
  | "LOGIN"
  | "REGISTER"
  | "DASHBOARD"
  | "SIGNALS"
  | "BOT_CONTROL"
  | "ECONOMIC_CALENDAR"
  | "PERFORMANCE_ANALYTICS"
  | "NOTIFICATIONS"
  | "SUBSCRIPTION_PLANS"
  | "PROFILE"
  | "SETTINGS";

export interface BrokerConnection {
  status: "CONNECTED" | "DISCONNECTED";
  brokerName: string;
  accountNumber: string;
  balance: number;
  equity: number;
  margin: number;
  floatingPl: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number;
  drawdown: number;
}

export interface BotState {
  botStatus: "RUNNING" | "STOPPED";
  autoTrading: boolean;
  riskPercentage: number;
  lotSize: number;
  maxDailyTrades: number;
  newsFilter: boolean;
  sessions: {
    London: boolean;
    NewYork: boolean;
    Asian: boolean;
  };
  brokerConnection: BrokerConnection;
}

export interface Signal {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  timeGenerated: string;
  rationale?: string;
}

export interface EconomicEvent {
  event: string;
  country: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  forecast: string;
  previous: string;
  actual: string;
  status: "RELEASED" | "PENDING";
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "TRADE" | "NEWS" | "BOT" | "ALERT";
}

export interface UserProfile {
  name: string;
  email: string;
  licenseLevel: "Free Trial" | "Android Premium" | "All-Access Master";
  avatar: string;
  brokerName: string;
  mt5Account: string;
}
