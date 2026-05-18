// app/(tabs)/mistakes.tsx
// Navigate here from Dashboard InsightCard for "Mistakes"

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pagination } from "../../components/common/Pagination";
import { AddMistakeSheet } from "../../components/mistakes/AddMistakeSheet";
import { EditMistakeSheet } from "../../components/mistakes/EditMistakeSheet";
import { FrequencyHeatmap } from "../../components/mistakes/FrequencyHeatmap";
import { MistakeDistributionCard } from "../../components/mistakes/MistakeDistributionCard";
import { MistakeListItem } from "../../components/mistakes/MistakeListItem";
import { MistakeStatsRow } from "../../components/mistakes/MistakeStatsRow";
import { useMistakes } from "../../hooks/useMistakes";

import { SkeletonCard } from "@/components/common/Skeleton";

const PAGE_SIZE = 5;

export default function MistakesScreen() {
  const insets = useSafeAreaInsets();
  const addSheetRef = useRef<BottomSheet>(null);
  const editSheetRef = useRef<BottomSheet>(null);
  const [editingMistakeId, setEditingMistakeId] = useState<string | null>(null);

  const {
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
    isLoading,
    isFetching
  } = useMistakes();

  const handleOpenAdd = () => addSheetRef.current?.expand();

  const handleOpenEdit = (id: string) => {
    setEditingMistakeId(id);
    editSheetRef.current?.expand();
  };

  const currentEditingMistake = mistakes.find((m: any) => m.id === editingMistakeId) || null;

  return (
    <View style={styles.root}>
      {/* ── Top App Bar ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mistake Analysis</Text>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ gap: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <>
            {totalCount > 0 && (
              <>
                {/* ── Stats row ── */}
                <MistakeStatsRow
                  totalMistakes={totalMistakes}
                  mostCommon={mostCommon}
                />

                {/* ── Distribution chart ── */}
                <MistakeDistributionCard
                  data={categoryDistribution}
                  filter={distributionFilter}
                  onFilterChange={setDistributionFilter}
                />

                {/* ── Frequency heatmap ── */}
                <FrequencyHeatmap data={heatmapData} />

                {/* ── Recent Mistakes header ── */}
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Recent Mistakes</Text>
                  <TouchableOpacity
                    style={styles.addCustomBtn}
                    onPress={handleOpenAdd}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.addCustomText}>+ Add Custom Mistake</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ── Mistake list ── */}
            <View style={[styles.listGap, totalCount === 0 && { marginTop: 40 }]}>
              {pagedMistakes.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No mistakes logged yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Track your trading mistakes to improve discipline
                  </Text>
                </View>
              ) : isFetching && !isLoading ? (
                <View style={{ gap: 16 }}>
                  <SkeletonCard />
                  <SkeletonCard />
                </View>
              ) : (
                pagedMistakes.map((m:any) => (
                  <MistakeListItem
                    key={m.id}
                    mistake={m}
                    onEdit={handleOpenEdit}
                    onDelete={deleteMistake}
                  />
                ))
              )}
            </View>

            {/* ── Pagination ── */}
            {totalCount > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                onPrev={() => goToPage(currentPage - 1)}
                onNext={() => goToPage(currentPage + 1)}
                onGoTo={goToPage}
                label="MISTAKES"
              />
            )}
          </>
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
        onPress={handleOpenAdd}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#00285d" />
      </TouchableOpacity>

      {/* ── Add Mistake Sheet ── */}
      <AddMistakeSheet bottomSheetRef={addSheetRef} onAdd={addMistake} />

      {/* ── Edit Mistake Sheet ── */}
      <EditMistakeSheet
        bottomSheetRef={editSheetRef}
        mistake={currentEditingMistake}
        onSave={editMistake}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#10141a" },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10141a",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  createBtn: {
    backgroundColor: "#4d8eff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  createBtnText: { color: "#00285d", fontSize: 13, fontWeight: "700" },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  // ── List header ──
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  listTitle: {
    color: "#dfe2eb",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(77,142,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(77,142,255,0.2)",
  },
  addCustomText: { color: "#4d8eff", fontSize: 12, fontWeight: "700" },

  // ── List ──
  listGap: { gap: 10 },

  // ── Empty ──
  emptyState: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  emptyTitle: { color: "#dfe2eb", fontSize: 15, fontWeight: "700" },
  emptySubtitle: {
    color: "#8c909f",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  // ── FAB ──
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4d8eff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
