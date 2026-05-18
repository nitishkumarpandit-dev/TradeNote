// app/(tabs)/ChecklistScreen.tsx

import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AddChecklistSheet,
  ChecklistEditData,
  ChecklistFormData,
} from "../../../components/checklist/AddChecklistSheet";
import { AIInsightCard } from "../../../components/checklist/AIInsightCard";
import { AnalysisStats } from "../../../components/checklist/AnalysisStats";
import { ChecklistHeader } from "../../../components/checklist/ChecklistHeader";
import { ChecklistItem } from "../../../components/checklist/ChecklistItem";
import { LineChartCard } from "../../../components/checklist/LineChartCard";
import { NotesInput } from "../../../components/checklist/NotesInput";
import { ProgressCard } from "../../../components/checklist/ProgressCard";
import { SectionHeader } from "../../../components/checklist/SectionHeader";
import { TabSwitcher } from "../../../components/checklist/TabSwitcher";
import { WeekdayChart } from "../../../components/checklist/WeekdayChart";
import { ChecklistSkeleton } from "../../../components/checklist/ChecklistSkeleton";
import { AnalysisSkeleton } from "../../../components/checklist/AnalysisSkeleton";
import {
  useChecklist,
  useChecklistAnalysis,
} from "../../../hooks/useChecklist";

export default function ChecklistScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"Checklist" | "Analysis">(
    "Checklist",
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [sheetSection, setSheetSection] = useState<
    "pre-market" | "post-market"
  >("pre-market");
  const [editData, setEditData] = useState<ChecklistEditData | null>(null);
  const addChecklistRef = useRef<BottomSheet>(null);

  const [kbHeight, setKbHeight] = useState(0);

  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    const showSub = import("react-native").then(({ Keyboard }) => {
       return Keyboard.addListener("keyboardDidShow", (e) => {
        setKbHeight(e.endCoordinates.height);
      });
    });
    const hideSub = import("react-native").then(({ Keyboard }) => {
       return Keyboard.addListener("keyboardDidHide", () => {
        setKbHeight(0);
      });
    });
    return () => {
      showSub.then(sub => sub.remove());
      hideSub.then(sub => sub.remove());
    };
  }, []);

  const {
    preMarketItems,
    postMarketItems,
    notes,
    setNotes,
    toggleItem,
    addItem,
    editItem,
    deleteItem,
    saveChecklist,
    preMarketProgress,
    postMarketProgress,
    isToday,
    isSaving,
    isLoading,
  } = useChecklist(selectedDate);

  const { data: analysisData, isLoading: isAnalysisLoading } =
    useChecklistAnalysis();

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    saveChecklist();
  }, [saveChecklist]);

  // ── Add item (from + button) ──────────────────────────────────────────────
  const handleAddPreMarket = useCallback(() => {
    setSheetMode("add");
    setSheetSection("pre-market");
    setEditData(null);
    addChecklistRef.current?.snapToIndex(0);
  }, []);

  const handleAddPostMarket = useCallback(() => {
    setSheetMode("add");
    setSheetSection("post-market");
    setEditData(null);
    addChecklistRef.current?.snapToIndex(0);
  }, []);

  // ── Add/Edit/Delete from bottom sheet ─────────────────────────────────────
  const handleAddChecklist = useCallback(
    (form: ChecklistFormData) => {
      const type = sheetSection === "pre-market" ? "pre" : "post";
      addItem({ category: form.category, text: form.text, type });
    },
    [sheetSection, addItem],
  );

  const handleEditChecklist = useCallback(
    (id: string, form: ChecklistFormData) => {
      editItem(id, { category: form.category, text: form.text });
    },
    [editItem],
  );

  const handleDeleteChecklist = useCallback(
    (id: string) => {
      deleteItem(id);
    },
    [deleteItem],
  );

  // ── Edit icon pressed on a checklist item ─────────────────────────────────
  const handleEditIconPress = useCallback(
    (templateId: string) => {
      // Find the item in pre or post market
      const item =
        preMarketItems.find((i) => i.templateId === templateId) ||
        postMarketItems.find((i) => i.templateId === templateId);

      if (!item) return;

      setSheetMode("edit");
      setSheetSection(item.type === "pre" ? "pre-market" : "post-market");
      setEditData({
        id: item.templateId,
        category: item.category,
        text: item.title,
      });
      addChecklistRef.current?.snapToIndex(0);
    },
    [preMarketItems, postMarketItems],
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <ChecklistHeader
        onSave={handleSave}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        saveDisabled={!isToday}
        isSaving={isSaving}
      />

      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.flex, Platform.OS === "android" && { paddingBottom: kbHeight }]}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "Checklist" ? (
            isLoading ? (
              <ChecklistSkeleton />
            ) : (
              <View style={styles.tabContent}>
                {/* Progress Summary */}
                <View style={styles.progressRow}>
                  <ProgressCard
                    type="PRE-MARKET"
                    percent={preMarketProgress.percent}
                    done={preMarketProgress.done}
                    total={preMarketProgress.total}
                    icon="wb-sunny"
                    iconColor="#43e5b1"
                  />
                  <ProgressCard
                    type="POST-MARKET"
                    percent={postMarketProgress.percent}
                    done={postMarketProgress.done}
                    total={postMarketProgress.total}
                    icon="nights-stay"
                    iconColor="#ff5451"
                  />
                </View>

                <View style={styles.checklistSections}>
                  {/* Pre-Market Section */}
                  <SectionHeader
                    title="Pre-Market Preparation"
                    emoji="☀️"
                    onAdd={isToday ? handleAddPreMarket : undefined}
                  />
                  {preMarketItems.map((item) => (
                    <ChecklistItem
                      key={item.templateId}
                      id={item.templateId}
                      title={item.title}
                      completed={item.completed}
                      onToggle={isToday ? toggleItem : () => {}}
                      onEdit={isToday ? handleEditIconPress : undefined}
                      disabled={!isToday}
                    />
                  ))}

                  {/* Post-Market Section */}
                  <SectionHeader
                    title="Post-Market Review"
                    emoji="🌙"
                    onAdd={isToday ? handleAddPostMarket : undefined}
                  />
                  {postMarketItems.map((item) => (
                    <ChecklistItem
                      key={item.templateId}
                      id={item.templateId}
                      title={item.title}
                      completed={item.completed}
                      onToggle={isToday ? toggleItem : () => {}}
                      onEdit={isToday ? handleEditIconPress : undefined}
                      disabled={!isToday}
                    />
                  ))}

                  {/* Daily Notes */}
                  <SectionHeader title="Daily Notes" emoji="📝" />
                  <NotesInput
                    value={notes}
                    onChange={setNotes}
                    editable={isToday}
                  />
                </View>
              </View>
            )
          ) : isAnalysisLoading ? (
            <AnalysisSkeleton />
          ) : (
            <View style={styles.tabContent}>
              <AnalysisStats
                currentStreak={analysisData?.stats.streak ?? 0}
                avgCompletion={analysisData?.stats.avgCompletion ?? 0}
                bestDayPercent={analysisData?.stats.bestDay ?? 0}
                totalLogged={analysisData?.stats.totalLogged ?? 0}
              />
              <LineChartCard
                labels={analysisData?.trend.labels ?? []}
                data={analysisData?.trend.data ?? []}
              />
              <WeekdayChart data={analysisData?.weekday ?? []} />
              <AIInsightCard
                insight={analysisData?.insight ?? "No enough data yet."}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add/Edit Checklist Bottom Sheet */}
      <AddChecklistSheet
        bottomSheetRef={addChecklistRef}
        sectionType={sheetSection}
        mode={sheetMode}
        editData={editData}
        onAdd={handleAddChecklist}
        onEdit={handleEditChecklist}
        onDelete={handleDeleteChecklist}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#10141a",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  tabContent: {
    flex: 1,
  },
  progressRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checklistSections: {
    paddingHorizontal: 16,
  },
});
