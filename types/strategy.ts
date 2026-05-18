// types/strategy.ts

export interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string; // MaterialCommunityIcons name
  duration?: string; // e.g. "Swing Trading", "Intraday"
  winRate: number; // 0–100
  profitFactor: number;
  riskPerTrade: number; // percentage
  netPnl: number; // positive = profit, negative = loss
  tradesExecuted: number;
  rrRatio: string; // e.g. "1:2.5"
  createdAt: string;
}

export interface StrategyFormData {
  name: string;
  description: string;
}

export const INITIAL_STRATEGY_FORM: StrategyFormData = {
  name: "",
  description: "",
};

// ── Mock data ──────────────────────────────────────────────────────────────────
export const MOCK_STRATEGIES: Strategy[] = [
  {
    id: "1",
    name: "Mean Reversion",
    description: "Buy oversold, sell overbought using Bollinger Bands",
    isActive: true,
    icon: "chart-bell-curve-cumulative",
    duration: "Intraday",
    winRate: 72,
    profitFactor: 2.4,
    riskPerTrade: 1.5,
    netPnl: 14200,
    tradesExecuted: 58,
    rrRatio: "1:2.4",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Breakout Scalp",
    description: "High-frequency breakout plays on 5m chart",
    isActive: true,
    icon: "lightning-bolt",
    duration: "Intraday",
    winRate: 41,
    profitFactor: 0.8,
    riskPerTrade: 2.0,
    netPnl: -2400,
    tradesExecuted: 34,
    rrRatio: "1:1.5",
    createdAt: "2024-02-05",
  },
  {
    id: "3",
    name: "VWAP Reversion",
    description: "Mean reversion plays around VWAP levels intraday",
    isActive: true,
    icon: "chart-timeline-variant",
    duration: "Intraday",
    winRate: 58,
    profitFactor: 1.8,
    riskPerTrade: 1.0,
    netPnl: 8450,
    tradesExecuted: 42,
    rrRatio: "1:2.5",
    createdAt: "2024-01-22",
  },
  {
    id: "4",
    name: "Trend Following",
    description: "Ride strong momentum trends on hourly chart",
    isActive: true,
    icon: "trending-up",
    duration: "Swing Trading",
    winRate: 33,
    profitFactor: 0.6,
    riskPerTrade: 2.0,
    netPnl: -1200,
    tradesExecuted: 12,
    rrRatio: "1:3.0",
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    name: "Liquidity Sweep",
    description: "Hunting orders at key high/low levels",
    isActive: true,
    icon: "layers",
    duration: "Swing Trading",
    winRate: 65,
    profitFactor: 2.1,
    riskPerTrade: 1.2,
    netPnl: 6800,
    tradesExecuted: 28,
    rrRatio: "1:2.1",
    createdAt: "2024-02-18",
  },
  {
    id: "6",
    name: "Opening Range",
    description: "First 15 min breakout strategy",
    isActive: false,
    icon: "history",
    duration: "Intraday",
    winRate: 48,
    profitFactor: 1.1,
    riskPerTrade: 1.5,
    netPnl: 1200,
    tradesExecuted: 19,
    rrRatio: "1:2.0",
    createdAt: "2024-03-10",
  },
];
