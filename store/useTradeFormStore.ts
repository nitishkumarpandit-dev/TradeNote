import { create } from 'zustand';

export interface TradeFormState {
  // General Tab
  duration: 'Intraday' | 'Swing';
  marketType: string;
  symbol: string;
  entryDate: string;
  entryPrice: string;
  quantity: string;
  exitPrice: string;
  direction: 'Long' | 'Short';
  stopLoss: string;
  target: string;
  strategy: string;
  outcome: 'Profitable' | 'Break Even' | 'Loss' | null;
  analysis: string;
  rules: string[];
  screenshotUri: string | null;

  // Psychology Tab
  confidence: number;
  satisfaction: number;
  emotionalState: string;
  mistakes: string[];
  lessonsLearned: string;

  // Actions
  updateField: (field: keyof Omit<TradeFormState, 'updateField' | 'resetForm'>, value: any) => void;
  resetForm: () => void;
}

const initialState = {
  duration: 'Intraday' as const,
  marketType: 'Indian',
  symbol: '',
  entryDate: new Date().toISOString().split('T')[0],
  entryPrice: '',
  quantity: '',
  exitPrice: '',
  direction: 'Long' as const,
  stopLoss: '',
  target: '',
  strategy: '',
  outcome: null,
  analysis: '',
  rules: [],
  screenshotUri: null,

  confidence: 8,
  satisfaction: 7,
  emotionalState: 'Calm & Focused',
  mistakes: [],
  lessonsLearned: '',
};

export const useTradeFormStore = create<TradeFormState>((set) => ({
  ...initialState,
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  resetForm: () => set(initialState),
}));
