import { useAuth } from "@clerk/expo";
import { fetchWithAuth } from "../services/api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Strategy, StrategyFormData } from "../types/strategy";

import { PaginatedApiResponse } from "../types/api";

const PAGE_SIZE = 3;

export function useStrategies() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-fetch list of strategies
  const { data: response, isLoading, isFetching, isError } = useQuery<PaginatedApiResponse<Strategy[]>>({
    queryKey: ["strategies", currentPage],
    queryFn: () => fetchWithAuth(`/strategies?page=${currentPage}&limit=${PAGE_SIZE}`, getToken),
    placeholderData: keepPreviousData,
  });

  const strategies = useMemo(() => {
    if (!response?.data) return [];
    return response.data.map((item) => ({
      ...item,
      id: item.id || (item as any)._id,
      winRate: item.winRate ? Number(Number(item.winRate).toFixed(2)) : 0
    }));
  }, [response]);

  const addMutation = useMutation({
    mutationFn: (form: StrategyFormData) =>
      fetchWithAuth("/strategies", getToken, {
        method: "POST",
        body: JSON.stringify(form)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] })
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) =>
      fetchWithAuth(`/strategies/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify({ isActive })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/strategies/${id}`, getToken, {
        method: "DELETE"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] })
  });

  const editMutation = useMutation({
    mutationFn: ({ id, form }: { id: string, form: StrategyFormData }) =>
      fetchWithAuth(`/strategies/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify(form)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] })
  });

  const addStrategy = useCallback((form: StrategyFormData) => {
    addMutation.mutate(form);
  }, [addMutation]);

  const editStrategy = useCallback((id: string, form: StrategyFormData) => {
    editMutation.mutate({ id, form });
  }, [editMutation]);

  const toggleStrategy = useCallback((id: string) => {
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) return;
    toggleMutation.mutate({ id, isActive: !strategy.isActive });
  }, [strategies, toggleMutation]);

  const deleteStrategy = useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation]);

  // ── Pagination ───────────────────────────────────────────────────────────────
  const totalCount = response?.pagination?.total || 0;
  const totalPages = Math.max(1, response?.pagination?.pages || 1);

  const pagedStrategies = strategies;

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  // Top performers = positive PnL, sorted descending
  const topPerformers = useMemo(() =>
    [...strategies].filter((s) => s.netPnl > 0).sort((a, b) => b.netPnl - a.netPnl),
    [strategies]
  );

  // Active strategies for the list section
  const activeStrategies = useMemo(() =>
    strategies.filter((s) => s.isActive),
    [strategies]
  );

  return {
    strategies,
    pagedStrategies,
    currentPage,
    totalPages,
    totalCount,
    pageSize: PAGE_SIZE,
    topPerformers,
    activeStrategies,
    addStrategy,
    editStrategy,
    toggleStrategy,
    deleteStrategy,
    goToPage,
    isLoading,
    isFetching,
    isError,
  };
}
