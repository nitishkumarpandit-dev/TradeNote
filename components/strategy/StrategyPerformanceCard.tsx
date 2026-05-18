// components/strategy/StrategyPerformanceCard.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Strategy } from "../../types/strategy";
import { WinRateBar } from "./WinRateBar";

const CARD_WIDTH = Dimensions.get("window").width * 0.84;

interface StrategyPerformanceCardProps {
  strategy: Strategy;
  onViewDetails?: (id: string) => void;
}

export function StrategyPerformanceCard({
  strategy,
  onViewDetails,
}: StrategyPerformanceCardProps) {
  const isProfit = strategy.netPnl >= 0;
  const pnlColor = isProfit ? "#43e5b1" : "#ff5451";
  const pnlBg = isProfit ? "rgba(1,200,150,0.08)" : "rgba(255,84,81,0.08)";
  const pnlLabel = isProfit ? "Net Profit" : "Net Loss";
  const winBadgeColor = strategy.winRate >= 60 ? "#43e5b1" : "#f9c449";

  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      {/* Win rate badge */}
      <View style={styles.badgeWrap}>
        <View style={[styles.badge, { backgroundColor: winBadgeColor + "22" }]}>
          <Text style={[styles.badgeText, { color: winBadgeColor }]}>
            {strategy.winRate}% WIN
          </Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.performanceLabel}>PERFORMANCE</Text>
        <Text style={styles.strategyName}>{strategy.name}</Text>
      </View>

      {/* PnL row */}
      <View style={[styles.pnlRow, { backgroundColor: pnlBg }]}>
        <View style={styles.pnlLeft}>
          <MaterialCommunityIcons
            name={isProfit ? "trending-up" : "trending-down"}
            size={20}
            color={pnlColor}
          />
          <Text style={[styles.pnlAmount, { color: pnlColor }]}>
            {isProfit ? "" : "-"}₹
            {Math.abs(strategy.netPnl).toLocaleString("en-IN")}
          </Text>
        </View>
        <Text style={[styles.pnlLabel, { color: pnlColor }]}>{pnlLabel}</Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>PROFIT FACTOR</Text>
          <Text style={styles.statValue}>
            {strategy.profitFactor.toFixed(1)}
          </Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>RISK/TRADE</Text>
          <Text style={styles.statValue}>{strategy.riskPerTrade}%</Text>
        </View>
      </View>

      {/* Win rate bar */}
      <WinRateBar winRate={strategy.winRate} height={5} />

      {/* View details */}
      <TouchableOpacity
        style={styles.detailsBtn}
        onPress={() => onViewDetails?.(strategy.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.detailsBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#262a31",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 14,
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    // rim light
    overflow: "hidden",
  },
  badgeWrap: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  header: { gap: 2, paddingRight: 80 },
  performanceLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#8c909f",
    textTransform: "uppercase",
  },
  strategyName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  pnlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pnlLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  pnlAmount: { fontSize: 18, fontWeight: "800" },
  pnlLabel: { fontSize: 11, fontWeight: "700" },
  statsGrid: { flexDirection: "row", gap: 10 },
  statCell: {
    flex: 1,
    backgroundColor: "#0a0e14",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#8c909f",
    textTransform: "uppercase",
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#dfe2eb" },
  detailsBtn: { paddingTop: 4 },
  detailsBtnText: {
    color: "#4d8eff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
