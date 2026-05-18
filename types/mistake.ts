// types/mistake.ts

export type MistakeCategory =
  | "Psychology"
  | "Entry"
  | "Exit"
  | "Risk"
  | "Strategy"
  | "Other";

export type MistakeSeverity = "HIGH" | "MEDIUM" | "LOW" | "NONE";
export type MistakeImpact = "CRITICAL" | "MODERATE" | "GOOD";

export interface Mistake {
  id: string;
  name: string;
  category: MistakeCategory;
  severity: MistakeSeverity;
  impact: MistakeImpact;
  occurrences: number;
  pnlImpact: number; // negative = loss
  createdAt: string;
}

export interface MistakeFormData {
  name: string;
  category: MistakeCategory | "";
}

export const INITIAL_MISTAKE_FORM: MistakeFormData = {
  name: "",
  category: "",
};

export const MISTAKE_CATEGORIES: MistakeCategory[] = [
  "Psychology",
  "Entry",
  "Exit",
  "Risk",
  "Strategy",
  "Other",
];

// ── Severity ──────────────────────────────────────────────────────────────────
export const SEVERITY_CONFIG: Record<
  MistakeSeverity,
  { label: string; color: string; bg: string; dot: string }
> = {
  HIGH: {
    label: "HIGH SEVERITY",
    color: "#ff5451",
    bg: "rgba(255,84,81,0.12)",
    dot: "#ff5451",
  },
  MEDIUM: {
    label: "MEDIUM SEVERITY",
    color: "#f9c449",
    bg: "rgba(249,196,73,0.12)",
    dot: "#f9c449",
  },
  LOW: {
    label: "LOW SEVERITY",
    color: "#adc6ff",
    bg: "rgba(173,198,255,0.12)",
    dot: "#adc6ff",
  },
  NONE: {
    label: "NONE SEVERITY",
    color: "#43e5b1",
    bg: "rgba(67,229,177,0.12)",
    dot: "#43e5b1",
  },
};

// ── Impact ────────────────────────────────────────────────────────────────────
export const IMPACT_CONFIG: Record<
  MistakeImpact,
  { label: string; color: string; bg: string }
> = {
  CRITICAL: {
    label: "CRITICAL IMPACT",
    color: "#ff5451",
    bg: "rgba(255,84,81,0.12)",
  },
  MODERATE: {
    label: "MODERATE IMPACT",
    color: "#4d8eff",
    bg: "rgba(77,142,255,0.12)",
  },
  GOOD: { label: "GOOD IMPACT", color: "#43e5b1", bg: "rgba(67,229,177,0.12)" },
};

// ── Left border accent per severity ──────────────────────────────────────────
export const SEVERITY_BORDER: Record<MistakeSeverity, string> = {
  HIGH: "#ff5451",
  MEDIUM: "#f9c449",
  LOW: "#adc6ff",
  NONE: "#43e5b1",
};

// ── Bar chart category colors ─────────────────────────────────────────────────
export const CATEGORY_BAR_COLOR: Record<MistakeCategory, string> = {
  Risk: "#ff5451",
  Psychology: "#f9c449",
  Entry: "#4d8eff",
  Exit: "#43e5b1",
  Strategy: "#adc6ff",
  Other: "#8c909f",
};

// ── Mock data ──────────────────────────────────────────────────────────────────
export const MOCK_MISTAKES: Mistake[] = [
  {
    id: "1",
    name: "Risked Too Much",
    category: "Risk",
    severity: "HIGH",
    impact: "CRITICAL",
    occurrences: 3,
    pnlImpact: -4200,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "FOMO Entry",
    category: "Psychology",
    severity: "MEDIUM",
    impact: "MODERATE",
    occurrences: 2,
    pnlImpact: -1800,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Overtrading",
    category: "Strategy",
    severity: "NONE",
    impact: "GOOD",
    occurrences: 1,
    pnlImpact: 400,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Early Exit",
    category: "Exit",
    severity: "MEDIUM",
    impact: "MODERATE",
    occurrences: 4,
    pnlImpact: -2300,
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    name: "No Stop Loss",
    category: "Risk",
    severity: "HIGH",
    impact: "CRITICAL",
    occurrences: 2,
    pnlImpact: -3500,
    createdAt: "2024-02-05",
  },
  {
    id: "6",
    name: "Chasing Breakout",
    category: "Entry",
    severity: "LOW",
    impact: "MODERATE",
    occurrences: 3,
    pnlImpact: -900,
    createdAt: "2024-02-10",
  },
  {
    id: "7",
    name: "Revenge Trading",
    category: "Psychology",
    severity: "HIGH",
    impact: "CRITICAL",
    occurrences: 1,
    pnlImpact: -5100,
    createdAt: "2024-02-15",
  },
  {
    id: "8",
    name: "News Trade",
    category: "Strategy",
    severity: "MEDIUM",
    impact: "MODERATE",
    occurrences: 2,
    pnlImpact: -600,
    createdAt: "2024-02-20",
  },
  {
    id: "9",
    name: "Moved Stop Loss",
    category: "Risk",
    severity: "HIGH",
    impact: "CRITICAL",
    occurrences: 5,
    pnlImpact: -2800,
    createdAt: "2024-03-01",
  },
  {
    id: "10",
    name: "Ignored Setup Rules",
    category: "Strategy",
    severity: "MEDIUM",
    impact: "MODERATE",
    occurrences: 3,
    pnlImpact: -1200,
    createdAt: "2024-03-05",
  },
  {
    id: "11",
    name: "Overleveraged",
    category: "Risk",
    severity: "HIGH",
    impact: "CRITICAL",
    occurrences: 2,
    pnlImpact: -6400,
    createdAt: "2024-03-10",
  },
  {
    id: "12",
    name: "Panic Exit",
    category: "Psychology",
    severity: "MEDIUM",
    impact: "MODERATE",
    occurrences: 2,
    pnlImpact: -1500,
    createdAt: "2024-03-15",
  },
];
