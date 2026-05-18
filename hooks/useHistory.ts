import { useAuth } from "@clerk/expo";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { fetchWithAuth } from "../services/api";
import {
  DirectionFilter,
  MarketFilter,
  OutcomeFilter,
  SortOption,
} from "../types/history";

const PAGE_SIZE = 5;

export interface HistoryFilters {
  sort: SortOption;
  market: MarketFilter;
  strategy: string; // '' = all
  direction: DirectionFilter;
  outcome: OutcomeFilter;
}

const DEFAULT_FILTERS: HistoryFilters = {
  sort: "Newest",
  market: "All",
  strategy: "",
  direction: "Both",
  outcome: "All Outcomes", // Maps to 'PROFITABLE'/'LOSS' etc.
};

// Calculate gross PnL locally if missing - REMOVED since backend handles it.

export function useHistory() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const buildQueryStr = useCallback(() => {
    const q = [`page=${currentPage}`, `limit=${PAGE_SIZE}`];
    if (filters.market !== "All") q.push(`marketType=${encodeURIComponent(filters.market)}`);
    if (filters.strategy !== "") q.push(`strategy=${encodeURIComponent(filters.strategy)}`);
    if (filters.direction !== "Both") q.push(`direction=${encodeURIComponent(filters.direction)}`);
    if (filters.outcome !== "All Outcomes") q.push(`outcome=${encodeURIComponent(filters.outcome)}`);
    q.push(`sort=${encodeURIComponent(filters.sort)}`);
    return q.join("&");
  }, [currentPage, filters]);

  // Auto-fetch mapped paginated trades
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["trades", buildQueryStr()],
    queryFn: () => fetchWithAuth(`/trades?${buildQueryStr()}`, getToken),
    placeholderData: keepPreviousData,
  });

  // Fetch strategies explicitly for dropdown
  const { data: stratsRes } = useQuery({
    queryKey: ["strategies", "all"],
    queryFn: () => fetchWithAuth(`/strategies?limit=100`, getToken),
  });

  // Fetch broker status to check if sync is possible
  const { data: brokerStatus } = useQuery({
    queryKey: ["broker", "status"],
    queryFn: () => fetchWithAuth(`/broker/status`, getToken),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuth(`/trades/${id}`, getToken, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
    }
  });

  const allTrades = useMemo(() => {
    return data?.trades || [];
  }, [data]);

  // Extract unique strategies explicitly from the DB lookup, NOT from the local slice
  const allStrategies = useMemo(() => {
    const arr = stratsRes?.data || [];
    return arr.map((s: any) => s.name).filter(Boolean).sort() as string[];
  }, [stratsRes]);

  const updateFilter = useCallback(
    <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const totalCount = data?.pagination?.total || 0;
  const totalPages = Math.max(1, data?.pagination?.pages || 1);

  const paged = allTrades;

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  const hasActiveFilters =
    filters.market !== "All" ||
    filters.strategy !== "" ||
    filters.direction !== "Both" ||
    filters.outcome !== "All Outcomes" ||
    filters.sort !== "Newest";

  const deleteTrade = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const syncMutation = useMutation({
    mutationFn: () => fetchWithAuth(`/broker/sync-trades`, getToken, { method: "POST" }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      Toast.show({
        type: "success",
        text1: "Sync Complete",
        text2: data.message || "Trades synchronized successfully.",
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: "Sync Failed",
        text2: err.message || "Failed to synchronize trades.",
      });
    }
  });

  const syncTrades = useCallback(() => {
    if (!brokerStatus?.isConnected) {
      Alert.alert(
        "Broker Not Connected",
        "Please connect your Delta Exchange account in the Profile tab before syncing trades.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Profile", onPress: () => router.push("/profile") }
        ]
      );
      return;
    }
    syncMutation.mutate();
  }, [syncMutation, brokerStatus]);

  return {
    trades: paged,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    allStrategies,
    isLoading,
    isFetching,
    isError,
    refetch,
    deleteTrade,
    syncTrades,
    isSyncing: syncMutation.isPending
  };
}
