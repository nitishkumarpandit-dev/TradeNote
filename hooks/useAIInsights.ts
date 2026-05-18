import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/api";

export interface AIInsightsData {
  summary: string;
  winRateDelta: string;
  avgRrRatio: string;
  targetRrRatio: string;
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
  actionableAdvice: string;
  confidenceScore: number;
}

const fetchAIInsights = async (
  getToken: () => Promise<string | null>,
  market: string,
  period: string,
  startDate?: string,
  endDate?: string
): Promise<AIInsightsData> => {
  return await fetchWithAuth(`/ai/insights`, getToken, {
    method: "POST",
    body: JSON.stringify({
      targetMarket: market,
      period,
      startDate,
      endDate,
    }),
  });
};

export const useAIInsights = (market: string, period: string, startDate?: string, endDate?: string) => {
  const { getToken } = useAuth();
  
  const query = useQuery({
    queryKey: ["aiInsights", market, period, startDate, endDate],
    queryFn: () => fetchAIInsights(getToken, market, period, startDate, endDate),
    // Only run if we have the params
    enabled: !!market && !!period,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
