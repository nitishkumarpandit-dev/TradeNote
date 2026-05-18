// app/(tabs)/history.tsx
// Navigate here from Dashboard "View All" buttons via:
//   router.push('/history')

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pagination } from "../../components/common/Pagination";
import { FilterChipsBar } from "../../components/history/FilterChipsBar";
import { TradeHistoryCard } from "../../components/history/TradeHistoryCard";
import { useHistory } from "../../hooks/useHistory";
import { SortOption, MarketFilter } from "../../types/history";
import { COLORS } from "../../constants/theme";

import { TradeHistorySkeleton } from "@/components/common/Skeleton";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sort?: SortOption; market?: MarketFilter }>();

  const {
    trades,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    allStrategies,
    isLoading,
    isFetching,
    refetch,
    deleteTrade,
    syncTrades,
    isSyncing
  } = useHistory();

  // Apply initial routing parameters safely avoiding state collisions
  useEffect(() => {
    if (params.sort) {
      updateFilter("sort", params.sort);
    }
    if (params.market && params.market !== "All") {
      // Must use "market" to match the HistoryFilters interface key natively!
      updateFilter("market", params.market);
    }
  }, [params.sort, params.market, updateFilter]);

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
          <Text style={styles.headerTitle}>History</Text>
        </View>

        {/* Sync + Import */}
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerActionBtn, isSyncing && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={syncTrades}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#4d8eff" />
            ) : (
              <MaterialCommunityIcons name="sync" size={15} color="#4d8eff" />
            )}
            <Text style={styles.headerActionText}>
              {isSyncing ? "Syncing..." : "Sync"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn} activeOpacity={0.8}>
            <MaterialIcons name="upload" size={15} color="#dfe2eb" />
            <Text style={[styles.headerActionText, { color: "#dfe2eb" }]}>
              Import
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Filter chips bar (sticky below header) ── */}
      <View style={styles.filterWrap}>
        <FilterChipsBar
          filters={filters}
          allStrategies={allStrategies}
          onUpdate={updateFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </View>

      {/* ── Trade list ── */}
      <FlatList
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
        data={trades}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.primaryContainer}
            colors={[COLORS.primaryContainer]}
            progressBackgroundColor={COLORS.surfaceContainer}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={{ gap: 12 }}>
              <TradeHistorySkeleton />
              <TradeHistorySkeleton />
              <TradeHistorySkeleton />
              <TradeHistorySkeleton />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="history" size={48} color={COLORS.surfaceContainerHighest} />
              <Text style={styles.emptyTitle}>No trades found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or add your first trade
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={resetFilters}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        getItemLayout={(data, index) => ({
          length: 192,
          offset: 192 * index,
          index,
        })}
        renderItem={useCallback(({ item: trade }: any) => (
          <TradeHistoryCard
            trade={trade}
            onEdit={() => {
              router.push({
                pathname: "/add-trade",
                params: { tradeId: trade.id }
              });
            }}
            onDelete={(id) => {
              Alert.alert(
                "Delete Trade",
                "Are you sure you want to delete this trade? This cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => deleteTrade(id) }
                ]
              );
            }}
          />
        ), [deleteTrade])}
        ListFooterComponent={
          totalCount > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPrev={() => goToPage(currentPage - 1)}
              onNext={() => goToPage(currentPage + 1)}
              onGoTo={goToPage}
              label="TRADES"
            />
          ) : null
        }
        removeClippedSubviews={true}
        windowSize={10}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
        onPress={() => router.push("/add-trade")}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#00285d" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
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
  headerRight: { flexDirection: "row", gap: 8 },
  headerActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1c2026",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  headerActionText: { color: "#4d8eff", fontSize: 12, fontWeight: "700" },

  // ── Filter bar ──
  filterWrap: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    color: "#dfe2eb",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "#8c909f",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
  },
  clearBtn: {
    marginTop: 8,
    backgroundColor: "rgba(255,84,81,0.1)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,84,81,0.3)",
  },
  clearBtnText: { color: "#ff5451", fontSize: 13, fontWeight: "700" },

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
