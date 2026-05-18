// types/rule.ts

export type RuleCategory =
  | "Psychology"
  | "Risk Management"
  | "Technical Setup"
  | "Execution"
  | "Analysis";

export interface Rule {
  id: string;
  name: string;
  category: RuleCategory;
  description: string;
  isActive: boolean;
  adherenceCount: number; // times followed
  totalTrades: number; // total applicable trades
  createdAt: string;
}

export interface RuleFormData {
  name: string;
  category: RuleCategory | "";
  description: string;
}

export const INITIAL_RULE_FORM: RuleFormData = {
  name: "",
  category: "",
  description: "",
};

export const RULE_CATEGORIES: RuleCategory[] = [
  "Psychology",
  "Risk Management",
  "Technical Setup",
  "Execution",
  "Analysis",
];

export const CATEGORY_COLORS: Record<
  RuleCategory,
  { text: string; bg: string }
> = {
  Psychology: { text: "#ff9a6c", bg: "rgba(255,154,108,0.12)" },
  "Risk Management": { text: "#ff5451", bg: "rgba(255,84,81,0.12)" },
  "Technical Setup": { text: "#adc6ff", bg: "rgba(173,198,255,0.12)" },
  Execution: { text: "#f9c449", bg: "rgba(249,196,73,0.12)" },
  Analysis: { text: "#43e5b1", bg: "rgba(67,229,177,0.12)" },
};

export const CATEGORY_ICONS: Record<RuleCategory, string> = {
  Psychology: "brain",
  "Risk Management": "shield-alert",
  "Technical Setup": "chart-line",
  Execution: "flash",
  Analysis: "swap-horizontal",
};

// ── Mock data ──────────────────────────────────────────────────────────────────
export const MOCK_RULES: Rule[] = [
  {
    id: "1",
    name: "Check ADR Before Entry",
    category: "Analysis",
    description:
      "Always check the Average Daily Range before entering a trade to ensure sufficient volatility.",
    isActive: true,
    adherenceCount: 3,
    totalTrades: 8,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Walk away after 2 losses",
    category: "Psychology",
    description:
      "Stop trading for the day after two consecutive losing trades to prevent revenge trading.",
    isActive: true,
    adherenceCount: 4,
    totalTrades: 7,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Stop at Daily Drawdown",
    category: "Risk Management",
    description:
      "Never exceed 2% daily drawdown. Close all positions and step away from the screen.",
    isActive: true,
    adherenceCount: 10,
    totalTrades: 10,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Max Loss Per Trade",
    category: "Risk Management",
    description:
      "Never risk more than 1.5% of account balance on any single trade.",
    isActive: true,
    adherenceCount: 5,
    totalTrades: 8,
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    name: "Wait for Retest",
    category: "Analysis",
    description:
      "Always wait for a retest of the breakout level before entering a position.",
    isActive: true,
    adherenceCount: 12,
    totalTrades: 12,
    createdAt: "2024-02-10",
  },
  {
    id: "6",
    name: "Morning Routine",
    category: "Psychology",
    description:
      "Complete pre-market analysis and mental preparation before trading session starts.",
    isActive: true,
    adherenceCount: 1,
    totalTrades: 5,
    createdAt: "2024-02-15",
  },
  {
    id: "7",
    name: "Wait for 5m Close",
    category: "Technical Setup",
    description:
      "Always wait for the 5-minute candle to close before entering a high-volume breakout.",
    isActive: false,
    adherenceCount: 2,
    totalTrades: 6,
    createdAt: "2024-03-01",
  },
  {
    id: "8",
    name: "No Trading in First 15m",
    category: "Execution",
    description:
      "Avoid placing trades in the first 15 minutes of market open due to high volatility.",
    isActive: false,
    adherenceCount: 3,
    totalTrades: 9,
    createdAt: "2024-03-05",
  },
];
