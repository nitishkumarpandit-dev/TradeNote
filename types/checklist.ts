// types/checklist.ts

export type ChecklistType = "pre" | "post";

export interface ChecklistTemplate {
  id: string;
  title: string;
  category: string;
  type: ChecklistType;
  order: number;
}

export interface ChecklistItemData {
  templateId: string;
  title: string;
  category: string;
  type: ChecklistType;
  completed: boolean;
}

export interface DailyChecklistResponse {
  date: string;
  items: ChecklistItemData[];
  notes: string;
  isSaved: boolean;
}

export interface SaveChecklistPayload {
  date: string;
  templates: (ChecklistTemplate | Omit<ChecklistTemplate, "id">)[];
  items: ChecklistItemData[];
  notes: string;
}

export interface SaveChecklistResponse {
  templates: ChecklistTemplate[];
  daily: DailyChecklistResponse;
}

export interface ChecklistStats {
  currentStreak: number;
  avgCompletion: number;
  bestDayPercent: number;
  totalLogged: number;
}

export interface WeekdayPerformance {
  day: string;
  completion: number;
  isWeakest?: boolean;
}

export interface ChecklistAnalysisResponse {
  stats: {
    streak: number;
    avgCompletion: number;
    bestDay: number;
    totalLogged: number;
  };
  trend: {
    labels: string[];
    data: number[];
  };
  weekday: number[];
  insight: string;
}
