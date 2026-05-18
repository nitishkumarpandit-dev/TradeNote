import { useAuth } from "@clerk/expo";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { fetchWithAuth } from "../services/api";
import { Rule, RuleFormData } from "../types/rule";

const PAGE_SIZE = 3;

export function useRules() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState("Last 30 Days");

  // Auto-fetch constraints
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["rules", currentPage],
    queryFn: () =>
      fetchWithAuth(`/rules?page=${currentPage}&limit=${PAGE_SIZE}`, getToken),
    placeholderData: keepPreviousData,
  });

  // Fetch Rules Analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["rulesAnalytics", timeFilter],
    queryFn: () =>
      fetchWithAuth(
        `/rules/analytics?timeframe=${encodeURIComponent(timeFilter)}`,
        getToken,
      ),
  });

  // Map _id to id
  const rules = useMemo(() => {
    if (!response?.data) return [];
    return response.data.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));
  }, [response]);

  const addMutation = useMutation({
    mutationFn: (form: RuleFormData) =>
      fetchWithAuth("/rules", getToken, {
        method: "POST",
        body: JSON.stringify(form),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rules"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      fetchWithAuth(`/rules/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rules"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: RuleFormData }) =>
      fetchWithAuth(`/rules/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify(form),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rules"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/rules/${id}`, getToken, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rules"] }),
  });

  // ── Filtered list ────────────────────────────────────────────────────────────
  const filteredRules = useMemo(
    () => (showInactive ? rules : rules.filter((r: any) => r.isActive)),
    [rules, showInactive],
  );

  const totalCount = response?.pagination?.total || 0;
  const totalPages = Math.max(1, response?.pagination?.pages || 1);

  const pagedRules = filteredRules;

  // ── Analytics ────────────────────────────────────────────────────────────────
  const topFollowed = analyticsData?.topFollowed || [];
  const leastUsed = analyticsData?.leastUsed || [];
  const disciplineData = analyticsData?.disciplineData || [0, 0, 0, 0, 0, 0, 0];

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const addRule = useCallback(
    (form: RuleFormData) => {
      if (!form.name.trim() || !form.category) return;
      addMutation.mutate(form);
      setCurrentPage(1);
    },
    [addMutation],
  );

  const toggleRule = useCallback(
    (id: string) => {
      const rule = rules.find((r: any) => r.id === id);
      if (!rule) return;
      toggleMutation.mutate({ id, isActive: !rule.isActive });
    },
    [rules, toggleMutation],
  );

  const editRule = useCallback(
    (id: string, form: RuleFormData) => {
      if (!form.name.trim() || !form.category) return;
      editMutation.mutate({ id, form });
    },
    [editMutation],
  );

  const deleteRule = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  return {
    rules,
    filteredRules,
    pagedRules,
    showInactive,
    setShowInactive,
    currentPage,
    totalPages,
    totalCount: filteredRules.length,
    goToPage,
    topFollowed,
    leastUsed,
    disciplineData,
    timeFilter,
    setTimeFilter,
    addRule,
    editRule,
    toggleRule,
    deleteRule,
    isLoading,
    isFetching,
    isError,
  };
}
