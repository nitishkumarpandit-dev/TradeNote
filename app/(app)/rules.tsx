// app/(tabs)/rules.tsx
// Navigate here from Dashboard InsightCard for "Rules"

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pagination } from "@/components/common/Pagination";
import { CreateRuleSheet } from "../../components/rules/CreateRuleSheet";
import { InactiveToggle } from "../../components/rules/InactiveToggle";
import { RuleListItem } from "../../components/rules/RuleListItem";
import { RulesDisciplineCard } from "../../components/rules/RulesDisciplineCard";
import { RulesPerformanceCard } from "../../components/rules/RulesPerformanceCard";
import { useRules } from "../../hooks/useRules";
import { EditRuleSheet } from "../../components/rules/EditRuleSheet";

import { SkeletonCard } from "@/components/common/Skeleton";

export default function RulesScreen() {
  const insets = useSafeAreaInsets();
  const createSheetRef = useRef<BottomSheet>(null);

  const {
    pagedRules,
    showInactive,
    setShowInactive,
    currentPage,
    totalPages,
    totalCount,
    topFollowed,
    leastUsed,
    disciplineData,
    timeFilter,
    setTimeFilter,
    addRule,
    editRule,
    toggleRule,
    deleteRule,
    rules,
    goToPage,
    isLoading,
    isFetching,
  } = useRules();

  const editSheetRef = useRef<BottomSheet>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const editingRule = useMemo(
    () => rules.find((r: any) => r.id === editingRuleId) || null,
    [rules, editingRuleId],
  );

  const handleOpenCreate = () => createSheetRef.current?.expand();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Rule",
      "Are you sure you want to delete this rule? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteRule(id) },
      ],
    );
  };

  return (
    <View style={[styles.root]}>
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
          <Text style={styles.headerTitle}>Trading Rules</Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleOpenCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>+ Create Rule</Text>
        </TouchableOpacity>
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
                {/* ── Rules Performance Analysis ── */}
                <RulesPerformanceCard
                  topFollowed={topFollowed}
                  leastUsed={leastUsed}
                  selectedFilter={timeFilter as any}
                  onFilterChange={(f) => setTimeFilter(f)}
                />

                {/* ── Rules Discipline Chart ── */}
                <RulesDisciplineCard disciplineData={disciplineData} />

                {/* ── Rules List header ── */}
                <View style={styles.listHeader}>
                  <Text style={styles.listLabel}>RULES LIST</Text>
                  <InactiveToggle
                    value={showInactive}
                    onChange={(v) => {
                      setShowInactive(v);
                      goToPage(1);
                    }}
                  />
                </View>
              </>
            )}

            {/* ── Rules list ── */}
            <View
              style={[styles.listGap, totalCount === 0 && { marginTop: 40 }]}
            >
              {pagedRules.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No rules found</Text>
                  <Text style={styles.emptySubtext}>
                    {totalCount === 0
                      ? "Create your first trading rule to get started"
                      : "No active rules found. Toggle 'Inactive' to view."}
                  </Text>
                </View>
              ) : isFetching && !isLoading ? (
                <View style={{ gap: 16 }}>
                  <SkeletonCard />
                  <SkeletonCard />
                </View>
              ) : (
                pagedRules.map((rule: any) => (
                  <RuleListItem
                    key={rule.id}
                    rule={rule}
                    onToggle={toggleRule}
                    onDelete={handleDelete}
                    onEdit={(id) => {
                      setEditingRuleId(id);
                      editSheetRef.current?.expand();
                    }}
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
                pageSize={3}
                onPrev={() => goToPage(currentPage - 1)}
                onNext={() => goToPage(currentPage + 1)}
                onGoTo={goToPage}
                label="RULES"
              />
            )}
          </>
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
        onPress={handleOpenCreate}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#00285d" />
      </TouchableOpacity>

      {/* ── Create Rule Sheet ── */}
      <CreateRuleSheet bottomSheetRef={createSheetRef} onAdd={addRule} />

      {/* ── Edit Rule Sheet ── */}
      <EditRuleSheet
        bottomSheetRef={editSheetRef}
        rule={editingRule}
        onEdit={(id, form) => editRule(id, form)}
      />
    </View>
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
    paddingHorizontal: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10141a",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
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
  createBtnText: {
    color: "#00285d",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 20,
  },

  // ── Rules list header ──
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  listLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  // ── List ──
  listGap: { gap: 10 },

  // ── Empty state ──
  emptyState: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  emptyText: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
  },
  emptySubtext: {
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
