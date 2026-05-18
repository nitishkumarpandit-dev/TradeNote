// hooks/useChecklist.ts

import { useAuth } from "@clerk/expo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../services/api";
import {
  ChecklistItemData,
  ChecklistTemplate,
  DailyChecklistResponse,
  ChecklistAnalysisResponse,
} from "../types/checklist";

/** Format a Date to YYYY-MM-DD string (local timezone). */
const toDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Check if a date matches today (local timezone). */
const checkIsToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const LOCAL_DEFAULTS = [
  // PRE-MARKET
  { title: "Check Global Indices", category: "Market Analysis", type: "pre" as const, order: 0 },
  { title: "Review Key Levels (S/R)", category: "Technical Analysis", type: "pre" as const, order: 1 },
  { title: "Analyze FII/DII Data", category: "Market Analysis", type: "pre" as const, order: 2 },
  { title: "Check Economic Calendar", category: "Fundamental", type: "pre" as const, order: 3 },
  { title: "Define Daily Bias", category: "Strategy", type: "pre" as const, order: 4 },
  // POST-MARKET
  { title: "Journal All Trades", category: "Review", type: "post" as const, order: 0 },
  { title: "Upload Trade Charts", category: "Review", type: "post" as const, order: 1 },
  { title: "Review Rule Adherence", category: "Discipline", type: "post" as const, order: 2 },
  { title: "Calculate Daily P&L", category: "Review", type: "post" as const, order: 3 },
  { title: "Plan Tomorrow's Watchlist", category: "Preparation", type: "post" as const, order: 4 },
];

export function useChecklist(selectedDate: Date) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const dateStr = toDateStr(selectedDate);
  const isToday = checkIsToday(selectedDate);

  // ── Fetch daily data from API ─────────────────────────────────────────────
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery<DailyChecklistResponse>({
    queryKey: ["checklist", "daily", dateStr],
    queryFn: () => fetchWithAuth(`/checklists/daily?date=${dateStr}`, getToken),
  });

  // ── Fetch templates (for building save payload) ───────────────────────────
  const { data: templatesResponse } = useQuery<{ data: ChecklistTemplate[] }>({
    queryKey: ["checklist", "templates"],
    queryFn: () => fetchWithAuth("/checklists/templates", getToken),
  });

  const templates = useMemo(() => {
    const serverTemplates = templatesResponse?.data ?? [];
    if (serverTemplates.length > 0) return serverTemplates;

    // Fallback to local defaults as "templates" for a clean initial state
    return LOCAL_DEFAULTS.map((d, i) => ({
      id: `temp-default-${i}`,
      title: d.title,
      category: d.category,
      type: d.type,
      order: d.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as ChecklistTemplate[];
  }, [templatesResponse]);

  // ── Local state (editable copy of API data) ───────────────────────────────
  const [localItems, setLocalItems] = useState<ChecklistItemData[]>([]);
  const [localNotes, setLocalNotes] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Sync local state when API data arrives or date changes
  useEffect(() => {
    if (apiData) {
      if (apiData.items && apiData.items.length > 0) {
        setLocalItems(apiData.items);
      } else {
        // No saved items — use local defaults if it's today or a day with no data
        setLocalItems(LOCAL_DEFAULTS.map((d, i) => ({
          templateId: `temp-default-${i}`,
          title: d.title,
          category: d.category,
          type: d.type,
          completed: false,
        })));
      }
      setLocalNotes(apiData.notes);
      setIsDirty(false);
    }
  }, [apiData]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const preMarketItems = useMemo(
    () => localItems.filter((item) => item.type === "pre"),
    [localItems]
  );

  const postMarketItems = useMemo(
    () => localItems.filter((item) => item.type === "post"),
    [localItems]
  );

  const calculateProgress = useCallback((itemList: ChecklistItemData[]) => {
    if (itemList.length === 0) return { percent: 0, done: 0, total: 0 };
    const done = itemList.filter((i) => i.completed).length;
    const total = itemList.length;
    return {
      percent: Math.round((done / total) * 100),
      done,
      total,
    };
  }, []);

  const preMarketProgress = useMemo(
    () => calculateProgress(preMarketItems),
    [preMarketItems, calculateProgress]
  );

  const postMarketProgress = useMemo(
    () => calculateProgress(postMarketItems),
    [postMarketItems, calculateProgress]
  );

  // ── Local mutations (no API calls) ────────────────────────────────────────

  const toggleItem = useCallback((templateId: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.templateId === templateId
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    setIsDirty(true);
  }, []);

  const setNotes = useCallback((text: string) => {
    setLocalNotes(text);
    setIsDirty(true);
  }, []);

  const addItem = useCallback(
    (form: { category: string; text: string; type: "pre" | "post" }) => {
      const tempId = `temp-${Date.now()}`;
      const newItem: ChecklistItemData = {
        templateId: tempId,
        title: form.text,
        category: form.category,
        type: form.type,
        completed: false,
      };
      setLocalItems((prev) => [...prev, newItem]);
      setIsDirty(true);
    },
    []
  );

  const editItem = useCallback(
    (templateId: string, form: { category: string; text: string }) => {
      setLocalItems((prev) =>
        prev.map((item) =>
          item.templateId === templateId
            ? { ...item, title: form.text, category: form.category }
            : item
        )
      );
      setIsDirty(true);
    },
    []
  );

  const deleteItem = useCallback((templateId: string) => {
    setLocalItems((prev) => prev.filter((item) => item.templateId !== templateId));
    setIsDirty(true);
  }, []);

  // ── Save mutation (batch PUT) ─────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Build templates payload from local items
      const templatePayload = localItems.map((item, idx) => {
        const isNew = item.templateId.startsWith("temp-");
        return {
          ...(isNew ? {} : { id: item.templateId }),
          title: item.title,
          category: item.category,
          type: item.type,
          order: idx,
        };
      });

      return fetchWithAuth("/checklists/daily", getToken, {
        method: "PUT",
        body: JSON.stringify({
          date: dateStr,
          templates: templatePayload,
          items: localItems,
          notes: localNotes,
        }),
      });
    },
    onSuccess: () => {
      setIsDirty(false);
      // Refetch to get server-generated IDs for new items
      queryClient.invalidateQueries({ queryKey: ["checklist", "daily", dateStr] });
      queryClient.invalidateQueries({ queryKey: ["checklist", "templates"] });
    },
  });

  const saveChecklist = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

  return {
    // Data
    preMarketItems,
    postMarketItems,
    notes: localNotes,
    setNotes,

    // Actions
    toggleItem,
    addItem,
    editItem,
    deleteItem,
    saveChecklist,

    // Progress
    preMarketProgress,
    postMarketProgress,

    // State
    isToday,
    isDirty,
    isLoading,
    isSaving: saveMutation.isPending,
    isError,
    templates,
  };
}

/** Hook to fetch aggregate checklist analytics */
export function useChecklistAnalysis() {
  const { getToken } = useAuth();

  return useQuery<ChecklistAnalysisResponse>({
    queryKey: ["checklist", "analysis"],
    queryFn: () => fetchWithAuth("/checklists/analysis", getToken),
  });
}
