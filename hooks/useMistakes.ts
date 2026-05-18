import { useAuth } from "@clerk/expo";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { fetchWithAuth } from "../services/api";
import { MistakeFormData } from "../types/mistake";

const PAGE_SIZE = 5;

export function useMistakes() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [distributionFilter, setDistributionFilter] = useState<
    "This Month" | "All"
  >("This Month");

  const {
    data: response,
    isLoading: isRulesLoading,
    isFetching: isRulesFetching,
    isError,
  } = useQuery({
    queryKey: ["mistakes", currentPage],
    queryFn: () =>
      fetchWithAuth(
        `/mistakes?page=${currentPage}&limit=${PAGE_SIZE}`,
        getToken,
      ),
    placeholderData: keepPreviousData,
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["mistakesAnalytics", distributionFilter],
    queryFn: () =>
      fetchWithAuth(
        `/mistakes/analytics?timeframe=${encodeURIComponent(distributionFilter)}`,
        getToken,
      ),
  });

  const mistakes = useMemo(() => {
    if (!response?.data) return [];
    return response.data.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));
  }, [response]);

  const addMutation = useMutation({
    mutationFn: (form: any) =>
      fetchWithAuth("/mistakes", getToken, {
        method: "POST",
        body: JSON.stringify(form),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mistakes"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: any }) =>
      fetchWithAuth(`/mistakes/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify(form),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mistakes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/mistakes/${id}`, getToken, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mistakes"] }),
  });

  // ── Pagination ───────────────────────────────────────────────────────────────
  const totalCount = response?.pagination?.total || 0;
  const totalPages = Math.max(1, response?.pagination?.pages || 1);

  const pagedMistakes = mistakes;

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  // ── Analytics ─────────────────────────────────────────────────────────────────
  const totalMistakes = analyticsData?.totalMistakes || 0;
  const mostCommon = analyticsData?.mostCommon || null;
  const categoryDistribution = analyticsData?.categoryDistribution || [];
  const heatmapData =
    analyticsData?.heatmapData ||
    Array.from({ length: 5 }, () => Array(7).fill(0));

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const addMistake = useCallback(
    (form: MistakeFormData) => {
      if (!form.name.trim()) return;
      const newMistake = {
        name: form.name.trim(),
        category: form.category || "Other",
      };
      addMutation.mutate(newMistake);
      setCurrentPage(1);
    },
    [addMutation],
  );

  const editMistake = useCallback(
    (id: string, form: MistakeFormData) => {
      if (!form.name.trim()) return;
      const updatedMistake = {
        name: form.name.trim(),
        category: form.category || "Other",
      };
      editMutation.mutate({ id, form: updatedMistake });
    },
    [editMutation],
  );

  const deleteMistake = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  return {
    mistakes,
    pagedMistakes,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    distributionFilter,
    setDistributionFilter,
    totalMistakes,
    mostCommon,
    categoryDistribution,
    heatmapData,
    addMistake,
    editMistake,
    deleteMistake,
    isLoading: isRulesLoading || isAnalyticsLoading,
    isFetching: isRulesFetching,
    isError,
  };
}
