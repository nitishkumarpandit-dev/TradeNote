// app/(tabs)/strategies.tsx
// Route: navigate here from Dashboard via router.push('/(tabs)/strategies')
// or router.push('/strategies') depending on your tab setup

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AddStrategySheet } from "../../components/strategy/AddStrategySheet";
import { EditStrategySheet } from "../../components/strategy/EditStrategySheet";
import { MyStrategyCard } from "../../components/strategy/MyStrategyCard";
import { StrategyDetailSheet } from "../../components/strategy/StrategyDetailSheet";
import { useStrategies } from "../../hooks/useStrategies";
import { Strategy } from "../../types/strategy";
import { Pagination } from "@/components/common/Pagination";
import { SkeletonCard } from "@/components/common/Skeleton";
import { TopPerformersCarousel } from "../../components/strategy/TopPerformersCarousel";
import { ActiveStrategiesList } from "../../components/strategy/ActiveStrategiesList";

export default function StrategiesScreen() {
  const insets = useSafeAreaInsets();
  const addSheetRef = useRef<BottomSheet>(null);
  const detailSheetRef = useRef<BottomSheet>(null);
  const editSheetRef = useRef<BottomSheet>(null);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null,
  );
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  const {
    strategies,
    pagedStrategies,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    topPerformers,
    activeStrategies,
    addStrategy,
    editStrategy,
    toggleStrategy,
    deleteStrategy,
    goToPage,
    isLoading,
    isFetching,
  } = useStrategies();

  const handleOpenAdd = () => addSheetRef.current?.expand();

  const handleViewDetails = (id: string) => {
    // Expand sheet immediately so animation starts without waiting for state
    detailSheetRef.current?.expand();
    const strategy = strategies.find((s: any) => s.id === id) ?? null;
    setSelectedStrategy(strategy);
  };

  const handleEdit = (id: string) => {
    const strategy = strategies.find((s: any) => s.id === id) ?? null;
    setEditingStrategy(strategy);
    editSheetRef.current?.expand();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Strategy",
      "Are you sure you want to delete this strategy? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteStrategy(id),
        },
      ],
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: "#10141a" }]}>
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
          <Text style={styles.headerTitle}>Strategies</Text>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={handleOpenAdd}
          activeOpacity={0.85}
        >
          <Text style={styles.newBtnText}>+ New Strategy</Text>
        </TouchableOpacity>
      </View>

      {/* ── Main scroll ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
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
                <TopPerformersCarousel
                  topPerformers={topPerformers}
                  onViewDetails={handleViewDetails}
                />

                <ActiveStrategiesList activeStrategies={activeStrategies} />
              </>
            )}

            {/* ── MY STRATEGIES ── */}
            <View style={styles.section}>
              {totalCount > 0 && (
                <Text style={styles.sectionTitle}>
                  <Text>🎯 </Text>My Strategies
                </Text>
              )}

              {totalCount === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 40,
                  }}
                >
                  <TouchableOpacity
                    style={styles.emptyCardAction}
                    onPress={handleOpenAdd}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={40}
                      color="#4d8eff"
                    />
                    <Text style={styles.emptyTitle}>
                      Create Your First Strategy
                    </Text>
                    <Text style={styles.emptySubtitle}>
                      Tap here to add a trading strategy and start tracking
                      performance
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.myStrategiesCard}>
                    {isFetching && !isLoading ? (
                      <View style={{ gap: 16 }}>
                        <SkeletonCard />
                        <SkeletonCard />
                      </View>
                    ) : (
                      pagedStrategies.map((strategy: any, index: any) => (
                        <MyStrategyCard
                          key={strategy.id}
                          strategy={strategy}
                          onToggle={toggleStrategy}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isLast={index === pagedStrategies.length - 1}
                        />
                      ))
                    )}
                  </View>

                  {/* ── Pagination ── */}
                  {totalCount > 0 && (
                    <View style={{ marginTop: 16 }}>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPrev={() => goToPage(currentPage - 1)}
                        onNext={() => goToPage(currentPage + 1)}
                        onGoTo={goToPage}
                        label="STRATEGIES"
                      />
                    </View>
                  )}
                </>
              )}
            </View>
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

      {/* ── Add Strategy Sheet ── */}
      <AddStrategySheet bottomSheetRef={addSheetRef} onAdd={addStrategy} />

      {/* ── Edit Strategy Sheet ── */}
      <EditStrategySheet
        bottomSheetRef={editSheetRef}
        strategy={editingStrategy}
        onEdit={editStrategy}
      />

      {/* ── Strategy Detail Sheet ── */}
      <StrategyDetailSheet
        bottomSheetRef={detailSheetRef}
        strategy={selectedStrategy}
      />
      {/* MODALS */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

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
  newBtn: {
    backgroundColor: "#4d8eff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newBtnText: {
    color: "#00285d",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 28,
  },

  // ── Sections ──
  section: { gap: 14 },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    color: "#8c909f",
    fontSize: 12,
  },

  // ── My Strategies card ──
  myStrategiesCard: {
    backgroundColor: "#262a31",
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  // ── Empty states ──
  emptyCard: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderStyle: "dashed",
  },
  emptyCardAction: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(77,142,255,0.25)",
    borderStyle: "dashed",
  },
  emptyTitle: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  emptySubtitle: {
    color: "#8c909f",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
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
