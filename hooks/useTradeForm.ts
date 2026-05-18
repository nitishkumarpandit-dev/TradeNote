import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useEffect } from "react";
import { fetchWithAuth } from "../services/api";
import { INITIAL_FORM, TradeFormData } from "../types/trade";
import { calculateTradeMetrics } from "../utils/tradeCalculations";
import { useSettings } from "./useSettings";

export function useTradeForm(initialData?: Partial<TradeFormData>) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TradeFormData>({ ...INITIAL_FORM, ...initialData });
  const { settings } = useSettings();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm(prev => ({ ...INITIAL_FORM, ...initialData }));
    }
  }, [initialData]);

  // Sync default leverage for new trades when settings load or change
  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) {
      setForm(prev => {
        if (prev.leverage !== settings.defaultLeverage) {
          return { ...prev, leverage: settings.defaultLeverage || 1 };
        }
        return prev;
      });
    }
  }, [settings.defaultLeverage, initialData]);

  const update = useCallback(
    <K extends keyof TradeFormData>(key: K, value: TradeFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setForm(INITIAL_FORM), []);

  const saveTradeMutation = useMutation({
    mutationFn: (tradeData: TradeFormData) => {
      const isEdit = !!tradeData.id;
      const url = isEdit ? `/trades/${tradeData.id}` : "/trades";
      const method = isEdit ? "PATCH" : "POST";
      
      // Remove id from payload if we're creating new, optionally if editing depending on backend
      // Just passing it is fine, but best practice is pulling it out if needed
      return fetchWithAuth(url, getToken, {
        method,
        body: JSON.stringify(tradeData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      reset();
    }
  });

  // ── Computed values ──────────────────────────────────────────────────────────
  const computed = useMemo(() => {
    const entry = parseFloat(form.entryPrice) || 0;
    const exit = parseFloat(form.exitPrice) || 0;
    const qty = parseFloat(form.quantity) || 0;
    const leverage = settings.tradeMargin ? form.leverage || 1 : 1;

    let charges = 0;
    if (settings.brokerageEnabled) {
      if (settings.selectedBroker === "Enter Manually") {
        charges = parseFloat(form.manualCharges) || 0;
      } else {
        const turnover = (entry + exit) * qty;
        charges = turnover * 0.0005; // 0.05% Mock estimate
      }
    }

    const metrics = calculateTradeMetrics({
      entryPrice: entry,
      exitPrice: exit,
      quantity: qty,
      leverage: leverage,
      direction: form.direction,
      charges: charges,
    });

    return {
      totalAmount: metrics.margin.toFixed(2),
      pnlAmount: metrics.netPnl.toFixed(2),
      pnlPercent: metrics.pnlPercent.toFixed(2),
      isPnlPositive: metrics.netPnl >= 0,
      charges: charges.toFixed(2),
    };
  }, [
    form.entryPrice,
    form.exitPrice,
    form.quantity,
    form.direction,
    form.leverage,
    form.manualCharges,
    settings.tradeMargin,
    settings.brokerageEnabled,
    settings.selectedBroker,
  ]);

  // ── Auto-Outcome Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    // Only auto-update if we have essential values to avoid flickering/incorrect states
    const hasValues = form.entryPrice && form.exitPrice && form.quantity;
    if (!hasValues) {
      if (form.outcome !== null) {
        update("outcome", null);
      }
      return;
    }

    const pnl = parseFloat(computed.pnlAmount);
    let newOutcome: TradeFormData["outcome"] = null;

    if (pnl > 0) newOutcome = "PROFITABLE";
    else if (pnl < 0) newOutcome = "LOSS";
    else newOutcome = "BREAK_EVEN";

    if (form.outcome !== newOutcome) {
      update("outcome", newOutcome);
    }
  }, [computed.pnlAmount, form.entryPrice, form.exitPrice, form.quantity, update, form.outcome]);

  // ── Rules helpers ─────────────────────────────────────────────────────────────
  const addRule = useCallback((rule: string) => {
    if (!rule.trim()) return;
    setForm((prev) => ({
      ...prev,
      rules: [...prev.rules, rule.trim()],
    }));
  }, []);

  const removeRule = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  }, []);

  // ── Mistakes helpers ──────────────────────────────────────────────────────────
  const toggleMistake = useCallback((mistake: string) => {
    setForm((prev) => ({
      ...prev,
      mistakes: prev.mistakes.includes(mistake)
        ? prev.mistakes.filter((m) => m !== mistake)
        : [...prev.mistakes, mistake],
    }));
  }, []);

  const clearMistakes = useCallback(() => {
    setForm((prev) => ({ ...prev, mistakes: [] }));
  }, []);

  return {
    form,
    update,
    reset,
    computed,
    saveTradeMutation,
    addRule,
    removeRule,
    toggleMistake,
    clearMistakes,
  };
}
