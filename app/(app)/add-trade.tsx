// app/(tabs)/add-trade.tsx  (or wherever you route it from the FAB)
// Can also be used as a modal: app/add-trade.tsx with presentation: 'modal'

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TradeSuccessSheet } from "@/components/addTrade/TradeSuccessSheet";
import { useTradeForm } from "@/hooks/useTradeForm";
import { useStrategies } from "@/hooks/useStrategies";
import { useRules } from "@/hooks/useRules";
import { useMistakes } from "@/hooks/useMistakes";
import { useSettings } from "@/hooks/useSettings";
import { fetchWithAuth } from "@/services/api";
import { useAuth } from "@clerk/expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { GeneralTab } from "../../components/addTrade/GeneralTab";
import { PsychologyTab } from "../../components/addTrade/PsychologyTab";
import { TabToggle } from "../../components/addTrade/TabToggle";
import { ActiveTab } from "../../types/trade";

export default function AddTradeScreen() {
  const insets = useSafeAreaInsets();
  const { getToken } = useAuth();
  const successSheetRef = useRef<BottomSheetModal>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("GENERAL");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, boolean>>>({});
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKbHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKbHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const { trade: tradeJson, tradeId } = useLocalSearchParams<{ trade?: string; tradeId?: string }>();

  const { data: fetchedTrade } = useQuery({
    queryKey: ["trade", tradeId],
    queryFn: () => fetchWithAuth(`/trades/${tradeId}`, getToken),
    enabled: !!tradeId,
  });

  const initialTrade = useMemo(() => {
    const source = tradeJson ? JSON.parse(tradeJson as string) : fetchedTrade;
    if (!source) return undefined;
    try {
      const parsed = source;
      return {
        id: parsed.id || parsed._id,
        duration: parsed.duration || "INTRADAY",
        marketType: ["Perpetual Futures", "Futures", "Call Option", "Put Option", "Move Option", "Interest Rate Swap"].includes(parsed.marketType) 
          ? "Crypto" 
          : (parsed.marketType || "Crypto"),
        symbol: parsed.symbol || "",
        entryDate: parsed.entryDate ? new Date(parsed.entryDate).toISOString().split("T")[0] : "",
        exitDate: parsed.exitDate ? new Date(parsed.exitDate).toISOString().split("T")[0] : "",
        entryTime: parsed.entryTime || "",
        exitTime: parsed.exitTime || "",
        entryPrice: parsed.entryPrice?.toString() || "",
        quantity: parsed.quantity?.toString() || "",
        exitPrice: parsed.exitPrice?.toString() || "",
        leverage: parsed.leverage || 10,
        direction: parsed.direction || "LONG",
        stopLoss: parsed.stopLoss?.toString() || "",
        target: parsed.target?.toString() || "",
        strategy: parsed.strategy?.name || parsed.strategy || "",
        outcome: parsed.outcome,
        analysis: parsed.analysis || "",
        rules: parsed.rules ? parsed.rules.map((r: any) => r.name || r) : [],
        // Psych
        confidence: parsed.confidence || 8,
        satisfaction: parsed.satisfaction || 7,
        emotionalState: parsed.emotionalState || "Calm & Focused",
        mistakes: parsed.mistakes ? parsed.mistakes.map((m: any) => m.name || m) : [],
        lessonsLearned: parsed.lessonsLearned || ""
      };
    } catch (e) {
      console.error("Failed to parse trade JSON for editing", e);
      return undefined;
    }
  }, [tradeJson, fetchedTrade]);

  const {
    form,
    update,
    reset,
    computed,
    saveTradeMutation,
    addRule,
    removeRule,
    toggleMistake,
    clearMistakes,
  } = useTradeForm(initialTrade);

  const isEditing = !!form.id;

  const { strategies } = useStrategies();
  const { rules } = useRules();
  const { mistakes } = useMistakes();
  const { settings } = useSettings();

  const handleAddRule = useCallback(
    (rule: string) => {
      addRule(rule);
      if (errors.rules) {
        setErrors((prev) => ({ ...prev, rules: false }));
      }
    },
    [addRule, errors.rules],
  );

  const handleRemoveRule = useCallback(
    (index: number) => {
      removeRule(index);
    },
    [removeRule],
  );

  const handleUpdate = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      update(key, value);
      if (errors[key as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [key]: false }));
      }
    },
    [update, errors],
  );

  const handleSave = () => {
    const newErrors: typeof errors = {};
    const requiredFields: (keyof typeof form)[] = [
      "symbol",
      "entryPrice",
      "exitPrice",
      "quantity",
      "entryDate",
      "strategy",
      "emotionalState",
      "confidence",
      "satisfaction",
      "leverage",
    ];

    if (form.duration === "SWING") {
      requiredFields.push("exitDate");
    }

    if (settings.tradeTimeInput) {
      requiredFields.push("entryTime");
      requiredFields.push("exitTime");
    }

    requiredFields.forEach((field) => {
      const value = form[field];
      if (typeof value === "string") {
        if (!value.trim()) newErrors[field] = true;
      } else if (value === undefined || value === null) {
        newErrors[field] = true;
      }
    });

    if (form.rules.length === 0) {
      newErrors.rules = true;
    }

    // Validate numeric values
    if (
      form.entryPrice &&
      (isNaN(parseFloat(form.entryPrice)) || parseFloat(form.entryPrice) <= 0)
    ) {
      newErrors.entryPrice = true;
    }
    if (
      form.exitPrice &&
      (isNaN(parseFloat(form.exitPrice)) || parseFloat(form.exitPrice) <= 0)
    ) {
      newErrors.exitPrice = true;
    }
    if (
      form.quantity &&
      (isNaN(parseFloat(form.quantity)) || parseFloat(form.quantity) <= 0)
    ) {
      newErrors.quantity = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Smart tab switching: if there are General errors, go there; otherwise go to Psychology
      const psychFields: (keyof typeof form)[] = ["confidence", "satisfaction", "emotionalState", "lessonsLearned", "mistakes"];
      const hasGeneralErrors = Object.keys(newErrors).some(field => !psychFields.includes(field as any));
      
      setActiveTab(hasGeneralErrors ? "GENERAL" : "PSYCHOLOGY");

      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all mandatory fields before saving.",
      });
      return;
    }

    setErrors({});
    Keyboard.dismiss();
    setIsSavingLocal(true);

    setTimeout(async () => {
      try {
        const payload: any = { ...form };
        
        // Helper to safely create related entities without blowing up the whole save
        const safeCreate = async (endpoint: string, body: any) => {
          try {
            const res = await fetchWithAuth(endpoint, getToken, { method: "POST", body: JSON.stringify(body) });
            return res.id || res._id;
          } catch (e) {
            console.warn(`Failed to create ${endpoint}:`, e);
            return null; // Skip if creation fails
          }
        };

        if (form.strategy) {
           let strategyId = strategies.find((s: any) => s.name === form.strategy)?.id;
           if (!strategyId) {
               strategyId = await safeCreate("/strategies", { name: form.strategy, description: "Default strategy", isActive: true });
           }
           if (strategyId) payload.strategy = strategyId;
        }
        
        let processedRules: string[] = [];
        for (const rName of form.rules) {
           let ruleId = rules.find((r: any) => r.name === rName)?.id;
           if (!ruleId) {
               ruleId = await safeCreate("/rules", { name: rName, category: "Execution", isActive: true });
           }
           if (ruleId) processedRules.push(ruleId);
        }
        payload.rules = processedRules;

        let processedMistakes: string[] = [];
        for (const mName of form.mistakes) {
           let mistakeId = mistakes.find((m: any) => m.name === mName)?.id;
           if (!mistakeId) {
               mistakeId = await safeCreate("/mistakes", { name: mName, category: "Other", severity: "MEDIUM", isActive: true });
           }
           if (mistakeId) processedMistakes.push(mistakeId);
        }
        payload.mistakes = processedMistakes;

        // Calculate and add numeric Pnl metrics
        payload.pnl = parseFloat(computed.pnlAmount) || 0;
        payload.pnlPercent = parseFloat(computed.pnlPercent) || 0;

        await saveTradeMutation.mutateAsync(payload);
        
        if (successSheetRef.current) {
          successSheetRef.current.present();
        }
      } catch (e: any) {
        Toast.show({
          type: "error",
          text1: "Error Saving",
          text2: e?.message || "Could not save trade to the server.",
        });
      } finally {
        setIsSavingLocal(false);
      }
    }, 400);
  };

  const handleKeepJournaling = () => {
    successSheetRef.current?.dismiss();
    reset();
    router.replace("/history");
  };

  const handleReset = () => {
    Alert.alert("Reset Form", "Clear all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          reset();
          setErrors({});
        },
      },
    ]);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.root, Platform.OS === "android" && { paddingBottom: kbHeight }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* ── Top App Bar ── */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={22} color="#4d8eff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{isEditing ? "Edit Trade" : "Add New Trade"}</Text>

          {/* Spacer to center the title */}
          <View style={styles.backBtn} />
        </View>

        {/* ── Scrollable Content ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab switcher */}
          <View style={styles.tabWrap}>
            <TabToggle active={activeTab} onChange={setActiveTab} />
          </View>

          {/* Tab content */}
          {activeTab === "GENERAL" ? (
            <GeneralTab
              form={form}
              computed={computed}
              update={handleUpdate}
              addRule={handleAddRule}
              removeRule={handleRemoveRule}
              errors={errors}
            />
          ) : (
            <PsychologyTab
              form={form}
              update={handleUpdate}
              toggleMistake={toggleMistake}
              clearMistakes={clearMistakes}
              errors={errors}
            />
          )}
        </ScrollView>

        {/* ── Bottom Action Bar ── */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {/* Reset */}
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <MaterialIcons name="restart-alt" size={18} color="#dfe2eb" />
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveWrap}
            onPress={handleSave}
            activeOpacity={0.88}
            disabled={saveTradeMutation.isPending || isSavingLocal}
          >
            <LinearGradient
              colors={["#4d8eff", "#3b82f6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              {saveTradeMutation.isPending || isSavingLocal ? (
                <Text style={styles.saveText}>SAVING...</Text>
              ) : (
                <>
                  <MaterialIcons name="save" size={18} color="#fff" />
                  <Text style={styles.saveText}>SAVE</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── Success Sheet ── */}
      <TradeSuccessSheet
        ref={successSheetRef}
        onKeepJournaling={handleKeepJournaling}
        todayPnl={
          (parseFloat(computed.pnlAmount) || 0) > 0 
            ? `+$${(parseFloat(computed.pnlAmount) || 0).toFixed(2)}`
            : `-$${Math.abs(parseFloat(computed.pnlAmount) || 0).toFixed(2)}`
        }
        yesterdayPnl="0.00"
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#10141a",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#10141a",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  tabWrap: { marginBottom: 4 },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(16,20,26,0.92)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  resetBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  resetText: {
    color: "#dfe2eb",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  saveWrap: {
    flex: 1.5,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  saveGradient: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
