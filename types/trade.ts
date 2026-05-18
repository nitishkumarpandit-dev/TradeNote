// types/trade.ts

export type TradeDirection = "LONG" | "SHORT";
export type TradeDuration = "INTRADAY" | "SWING";
export type TradeOutcome = "PROFITABLE" | "BREAK_EVEN" | "LOSS" | null;
export type ActiveTab = "GENERAL" | "PSYCHOLOGY";

export interface TradeFormData {
  id?: string;
  // General
  duration: TradeDuration;
  marketType: string;
  symbol: string;
  entryDate: string;
  exitDate: string;
  entryTime: string;
  exitTime: string;
  entryPrice: string;
  quantity: string;
  exitPrice: string;
  leverage: number;
  direction: TradeDirection;
  stopLoss: string;
  target: string;
  strategy: string;
  outcome: TradeOutcome;
  analysis: string;
  rules: string[];
  manualCharges: string;
  // Psychology
  confidence: number;
  satisfaction: number;
  emotionalState: string;
  mistakes: string[];
  lessonsLearned: string;
}

export const INITIAL_FORM: TradeFormData = {
  duration: "INTRADAY",
  marketType: "Crypto",
  symbol: "",
  entryDate: "",
  exitDate: "",
  entryTime: "",
  exitTime: "",
  entryPrice: "",
  quantity: "",
  exitPrice: "",
  leverage: 1,
  direction: "LONG",
  stopLoss: "",
  target: "",
  strategy: "",
  outcome: null,
  analysis: "",
  rules: [],
  confidence: 8,
  satisfaction: 7,
  emotionalState: "Calm & Focused",
  mistakes: [],
  lessonsLearned: "",
  manualCharges: "",
};

export const MARKET_TYPES = ["Indian", "Crypto", "Forex"];

export const EMOTIONAL_STATES = [
  "Calm & Focused",
  "Anxious",
  "Excited / Greedy",
  "Frustrated",
  "Bored",
  "Confident",
  "Fearful",
];

export const MISTAKES_LIST = [
  "Overtrading",
  "FOMO Entry",
  "Revenge Trade",
  "Held Too Long",
  "Early Exit",
  "Ignored Rules",
];
