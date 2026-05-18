import { useAuth } from "@clerk/expo";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/api";

export interface DashboardData {
  stats: {
    highestPnl: string;
    winRate: string;
    avgRR: string;
    totalTrades: string;
  };
  confidence: {
    index: number;
    label: string;
    description: string;
  };
  insights: {
    strategies: string;
    rules: string;
    mistakes: string;
  };
  topTrades: {
    id: string;
    date: string;
    time: string;
    symbol: string;
    direction: "LONG" | "SHORT";
    pnl: number;
    pnlPercent: number;
    entryPrice: number;
    exitPrice: number;
    strategy: string;
    rrRatio: string;
    outcome: "FULL SUCCESS" | "PARTIAL SUCCESS" | "MISTAKE" | "BREAK EVEN";
    market: "Crypto" | "Indian" | "Forex" | "All";
  }[];
  winLossDist: {
    wins: number;
    losses: number;
    winRate: number;
  };
  commonMistakes: {
    id: string;
    title: string;
    occurrences: number;
    pnl: string;
    severity: "CRITICAL" | "WARNING";
  }[];
  tradeHistory: {
    id: string;
    date: string;
    time: string;
    symbol: string;
    direction: "LONG" | "SHORT";
    pnl: number;
    pnlPercent: number;
    entryPrice: number;
    exitPrice: number;
    strategy: string;
    rrRatio: string;
    outcome: "FULL SUCCESS" | "PARTIAL SUCCESS" | "MISTAKE" | "BREAK EVEN";
    market: "Crypto" | "Indian" | "Forex" | "All";
  }[];
  chartData?: {
    daily: { date: string; value: number }[];
    weekly: { date: string; value: number }[];
    monthly: { date: string; value: number }[];
  };
  strategyPnL?: {
    strategy: string;
    pnl: number;
  }[];
}

const fetchDashboardData = async (getToken: () => Promise<string | null>, market: string, range: string): Promise<DashboardData> => {
  return await fetchWithAuth(`/dashboard?marketType=${encodeURIComponent(market)}&range=${encodeURIComponent(range)}`, getToken);
};

export const useDashboardData = (market: string, range: string) => {
  const { getToken } = useAuth();
  
  const query = useQuery({
    queryKey: ["dashboardData", market, range],
    queryFn: () => fetchDashboardData(getToken, market, range),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
