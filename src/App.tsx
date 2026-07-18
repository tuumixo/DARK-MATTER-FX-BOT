import React, { useEffect, useState } from "react";
import SplashView from "./components/SplashView";
import AuthView from "./components/AuthView";
import DashboardView from "./components/DashboardView";
import SignalsView from "./components/SignalsView";
import BotControlView from "./components/BotControlView";
import CalendarView from "./components/CalendarView";
import AnalyticsView from "./components/AnalyticsView";
import NotificationsView from "./components/NotificationsView";
import SubscriptionView from "./components/SubscriptionView";
import ProfileView from "./components/ProfileView";
import PhoneFrame from "./components/PhoneFrame";
import { BotState, Signal, Page } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("SPLASH");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // App signals and bot state
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isSignalsLoading, setIsSignalsLoading] = useState(false);
  const [botState, setBotState] = useState<BotState>({
    botStatus: "RUNNING",
    autoTrading: true,
    riskPercentage: 1.0,
    lotSize: 0.1,
    maxDailyTrades: 5,
    newsFilter: true,
    sessions: { London: true, NewYork: true, Asian: false },
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
    },
  });

  // Fetch initial state from Express Server on load
  useEffect(() => {
    fetch("/api/bot-state")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.brokerConnection) {
          setBotState(data);
        }
      })
      .catch((err) => console.log("Standard API fetch offline fallback. Continuing in client-only mode."));
  }, []);

  // Update State handler and push updates to Backend
  const handleUpdateBotState = (updates: Partial<BotState>) => {
    const newState = { ...botState, ...updates };
    setBotState(newState);

    fetch("/api/bot-state/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((err) => console.log("State push failed. Using local persistence."));
  };

  // Toggle Bot Status Running vs Stopped
  const handleToggleBot = () => {
    const nextStatus = botState.botStatus === "RUNNING" ? "STOPPED" : "RUNNING";
    handleUpdateBotState({ botStatus: nextStatus });

    // Post notification update to backend alert log
    const notifTitle = nextStatus === "RUNNING" ? "Algorithm Engaged" : "Algorithm Capped";
    const notifBody = nextStatus === "RUNNING" 
      ? `SYS: DARK MATTER FX core engine activated on ${botState.brokerConnection.accountNumber}.`
      : `SYS: Bot paused. All active setups placed in safeguard.`;

    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: notifTitle, body: notifBody, type: "BOT" }),
    })
      .then((res) => res.json())
      .catch((err) => console.log("Simulated alert dispatcher offline."));
  };

  // Fetch / Refresh signals from Gemini API backend
  const handleRefreshSignals = () => {
    setIsSignalsLoading(true);
    fetch("/api/signals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSignals(data);
        }
        setIsSignalsLoading(false);
      })
      .catch((err) => {
        console.error("Signals refresh failed:", err);
        setIsSignalsLoading(false);
      });
  };

  // Execute Gemini AI screenshot visual analysis
  const handleAnalyzeScreenshot = async (image: string, pair: string) => {
    const response = await fetch("/api/gemini/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, selectedPair: pair }),
    });
    return await response.json();
  };

  // Login handler
  const handleLoginSuccess = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setIsLoggedIn(true);
    setCurrentPage("DASHBOARD");
  };

  // Update user parameters (e.g. from profile)
  const handleUpdateUser = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");
    setCurrentPage("LOGIN");
  };

  return (
    <PhoneFrame
      isMobileFrame={isMobileFrame}
      onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page)}
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
    >
      {/* Dynamic page routing */}
      {currentPage === "SPLASH" && (
        <SplashView
          onComplete={() => {
            if (isLoggedIn) {
              setCurrentPage("DASHBOARD");
            } else {
              setCurrentPage("LOGIN");
            }
          }}
        />
      )}

      {currentPage === "LOGIN" && (
        <AuthView onLoginSuccess={handleLoginSuccess} />
      )}

      {currentPage === "DASHBOARD" && (
        <DashboardView
          botState={botState}
          onToggleBot={handleToggleBot}
          userName={userName}
        />
      )}

      {currentPage === "SIGNALS" && (
        <SignalsView
          signals={signals}
          isLoading={isSignalsLoading}
          onRefresh={handleRefreshSignals}
          onAnalyzeScreenshot={handleAnalyzeScreenshot}
        />
      )}

      {currentPage === "BOT_CONTROL" && (
        <BotControlView
          botState={botState}
          onUpdateState={handleUpdateBotState}
          onToggleBot={handleToggleBot}
        />
      )}

      {currentPage === "ECONOMIC_CALENDAR" && (
        <CalendarView />
      )}

      {currentPage === "PERFORMANCE_ANALYTICS" && (
        <AnalyticsView botState={botState} />
      )}

      {currentPage === "NOTIFICATIONS" && (
        <NotificationsView />
      )}

      {currentPage === "SUBSCRIPTION_PLANS" && (
        <SubscriptionView
          currentLicense={
            botState.brokerConnection.winRate > 80
              ? "All-Access Master"
              : botState.brokerConnection.winRate > 74
              ? "Android Premium"
              : "Free Trial"
          }
          onUpdateLicense={(level) => {
            // Update license level inside botState metrics to reflect changes!
            let winMultiplier = 74.5;
            if (level === "Android Premium") winMultiplier = 82.4;
            if (level === "All-Access Master") winMultiplier = 91.8;

            handleUpdateBotState({
              brokerConnection: {
                ...botState.brokerConnection,
                winRate: winMultiplier,
              },
            });
          }}
        />
      )}

      {currentPage === "PROFILE" && (
        <ProfileView
          botState={botState}
          onUpdateState={handleUpdateBotState}
          userName={userName}
          userEmail={userEmail}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}
    </PhoneFrame>
  );
}
