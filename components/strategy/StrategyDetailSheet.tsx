// components/strategy/StrategyDetailSheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Strategy } from "../../types/strategy";
import { useHistory } from "../../hooks/useHistory";
import { TradeHistoryCard } from "../history/TradeHistoryCard";
import { Skeleton, TradeHistorySkeleton } from "../common/Skeleton";

interface StrategyDetailSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  strategy: Strategy | null;
}

// ── Stat card ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
  sub?: React.ReactNode;
}

function StatCard({
  label,
  value,
  valueColor = "#dfe2eb",
  sub,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      {sub}
    </View>
  );
}

// ── Stat card skeleton ─────────────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <View style={[styles.statCard, { gap: 10 }]}>
      <Skeleton width="60%" height={10} borderRadius={4} />
      <Skeleton width="80%" height={28} borderRadius={6} />
    </View>
  );
}

// ── Win rate mini bar ──────────────────────────────────────────────────────────
function WinRateMiniBar({ winRate }: { winRate: number }) {
  const color =
    winRate >= 60 ? "#43e5b1" : winRate >= 45 ? "#f9c449" : "#ff5451";
  return (
    <View style={styles.miniBarTrack}>
      <View
        style={[
          styles.miniBarFill,
          { width: `${winRate}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

// ── Empty trades state ─────────────────────────────────────────────────────────
function NoTrades() {
  return (
    <View style={styles.noTradesWrap}>
      <Text style={styles.noTradesText}>No trades found</Text>
    </View>
  );
}

// ── Sheet skeleton content ─────────────────────────────────────────────────────
function DetailSheetSkeleton({ insetBottom }: { insetBottom: number }) {
  return (
    <>
      {/* Sticky header skeleton */}
      <View style={styles.stickyHeader}>
        <View style={{ gap: 8, flex: 1 }}>
          <Skeleton width="55%" height={22} borderRadius={6} />
          <Skeleton width="35%" height={14} borderRadius={4} />
        </View>
        <Skeleton width={36} height={36} borderRadius={18} />
      </View>

      {/* Scrollable body skeleton */}
      <BottomSheetScrollView
        contentContainerStyle={[styles.scrollBody, { paddingBottom: insetBottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.statsGrid}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
        <View style={styles.tradesSection}>
          <Skeleton width="40%" height={10} borderRadius={4} />
          <TradeHistorySkeleton />
          <TradeHistorySkeleton />
        </View>
      </BottomSheetScrollView>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function StrategyDetailSheet({
  bottomSheetRef,
  strategy,
}: StrategyDetailSheetProps) {
  const insets = useSafeAreaInsets();
  const { trades, isLoading: tradesLoading, deleteTrade } = useHistory();

  const recentTrades = useMemo(() => {
    if (!strategy || !trades) return [];
    return trades.filter((t: any) => t.strategy === strategy.name).slice(0, 3);
  }, [trades, strategy]);

  const snapPoints = useMemo(() => ["75%"], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.65}
        pressBehavior="close"
      />
    ),
    [],
  );

  const isProfit = (strategy?.netPnl ?? 0) >= 0;
  const pnlColor = isProfit ? "#43e5b1" : "#ff5451";
  const pnlPrefix = isProfit ? "+" : "-";
  const profitFactorDisplay =
    (strategy?.profitFactor ?? 0) > 0
      ? (strategy!.profitFactor).toFixed(1)
      : "–";
  const riskDisplay =
    (strategy?.riskPerTrade ?? 0) > 0 ? `${strategy!.riskPerTrade}%` : "N/A";

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
      handleStyle={styles.handleWrap}
    >
      {!strategy ? (
        // Sheet is open but strategy hasn't been set yet — show skeleton
        <DetailSheetSkeleton insetBottom={insets.bottom} />
      ) : (
        <>
          {/* ── Sticky Header (outside scroll) ── */}
          <View style={styles.stickyHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.headerText}>
                <Text style={styles.strategyName}>{strategy.name}</Text>
                <Text style={styles.strategyType}>
                  {strategy.duration ?? "Swing Trading"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <MaterialIcons name="close" size={20} color="#8c909f" />
            </TouchableOpacity>
          </View>

          {/* ── Scrollable body ── */}
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.scrollBody,
              { paddingBottom: insets.bottom + 32 },
            ]}
            showsVerticalScrollIndicator
            indicatorStyle="white"
            keyboardShouldPersistTaps="handled"
          >
            {/* 2×2 Stats grid */}
            <View style={styles.statsGrid}>
              <StatCard
                label="WIN RATE"
                value={`${strategy.winRate.toFixed(2)}%`}
                sub={<WinRateMiniBar winRate={strategy.winRate} />}
              />
              <StatCard label="PROFIT FACTOR" value={profitFactorDisplay} />
              <StatCard label="RISK/TRADE" value={riskDisplay} />
              <StatCard
                label="TOTAL PROFIT"
                value={`${pnlPrefix}$${Math.abs(strategy.netPnl).toLocaleString("en-IN")}`}
                valueColor={pnlColor}
              />
            </View>

            {/* Description */}
            {strategy.description ? (
              <View style={styles.descSection}>
                <Text style={styles.descLabel}>DESCRIPTION</Text>
                <Text style={styles.descText}>{strategy.description}</Text>
              </View>
            ) : null}

            {/* Recent Trades */}
            <View style={styles.tradesSection}>
              <Text style={styles.descLabel}>RECENT TRADES</Text>
              {tradesLoading ? (
                <View style={{ gap: 10 }}>
                  <TradeHistorySkeleton />
                  <TradeHistorySkeleton />
                </View>
              ) : recentTrades.length === 0 ? (
                <NoTrades />
              ) : (
                <View style={{ gap: 10 }}>
                  {recentTrades.map((trade: any) => (
                    <TradeHistoryCard
                      key={trade.id}
                      trade={trade}
                      onDelete={deleteTrade}
                    />
                  ))}
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#1c2026",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleWrap: { paddingTop: 10, paddingBottom: 0 },
  handle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 40,
    height: 4,
  },

  // ── Sticky header (outside scroll) ──
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  // ── Scrollable body ──
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(77,142,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(173,198,255,0.15)",
  },
  headerText: { gap: 3 },
  strategyName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  strategyType: {
    color: "#8c909f",
    fontSize: 13,
    fontWeight: "500",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Stats grid ──
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "47.5%",
    backgroundColor: "#262a31",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  statLabel: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // ── Win rate mini bar ──
  miniBarTrack: {
    height: 4,
    backgroundColor: "#31353c",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  miniBarFill: {
    height: 4,
    borderRadius: 2,
  },

  // ── Description ──
  descSection: { gap: 10 },
  descLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  descText: {
    color: "#c2c6d6",
    fontSize: 14,
    lineHeight: 22,
  },

  // ── Recent Trades ──
  tradesSection: { gap: 12 },
  noTradesWrap: {
    backgroundColor: "#262a31",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  noTradesText: {
    color: "#8c909f",
    fontSize: 14,
    fontWeight: "500",
  },
});

