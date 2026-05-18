import { useAuth } from "@clerk/expo";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/api";

export interface ReportData {
  performance: {
    wins: number;
    losses: number;
    be: number;
    avgWin: number;
    avgLoss: number;
    winRate: number;
    expectancy: number;
    bestDay: number;
    worstDay: number;
    avgWinDay: number;
    avgLossDay: number;
    totalTrades: number;
    avgCapital: number;
    bestStrategy: string;
    streakW: number;
    streakL: number;
    setupEffectiveness: { name: string; winRate: number }[];
    mostTraded: string;
    mostProfitable: string;
    leastProfitable: string;
    highestWinRate: string;
    avgTradesPerDay: number;
  };
  psychology: {
    emotionFreq: { name: string; percentage: number }[];
    emotionRR: { name: string; avgRR: number }[];
  };
  risk: {
    realizedRR: number;
    avgLoss: number;
    maxDrawdown: number;
    expectancy: number;
  };
  journal: {
    targetAchievedCount: number;
    stoppedBeforeTargetCount: number;
    totalTrades: number;
    fullSuccess: number;
    partialSuccess: number;
    followedPlan: number;
    mistakeCount: number;
    dailyNetPnl: { date: string; value: number }[];
  };
}

const fetchReportData = async (getToken: () => Promise<string | null>, market: string, duration: string): Promise<ReportData> => {
  return await fetchWithAuth(`/reports?marketType=${encodeURIComponent(market)}&duration=${encodeURIComponent(duration)}`, getToken);
};

export const useReportData = (market: string, duration: string) => {
  const { getToken } = useAuth();
  
  const query = useQuery({
    queryKey: ["reportData", market, duration],
    queryFn: () => fetchReportData(getToken, market, duration),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
