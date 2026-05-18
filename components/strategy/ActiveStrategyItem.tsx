// components/strategy/ActiveStrategyItem.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Strategy } from "../../types/strategy";
import { WinRateBar } from "./WinRateBar";

interface ActiveStrategyItemProps {
  strategy: Strategy;
  onPress?: (id: string) => void;
}

export function ActiveStrategyItem({
  strategy,
  onPress,
}: ActiveStrategyItemProps) {
  const isProfit = strategy.netPnl >= 0;
  const pnlColor = isProfit ? "#43e5b1" : "#ff5451";
  const pnlPrefix = isProfit ? "+" : "-";

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.nameCol}>
          <Text style={styles.name}>{strategy.name}</Text>
          <Text style={styles.trades}>
            {strategy.tradesExecuted} Trades Executed
          </Text>
        </View>
        <View style={styles.pnlCol}>
          <Text style={[styles.pnl, { color: pnlColor }]}>
            {pnlPrefix}₹{Math.abs(strategy.netPnl).toLocaleString("en-IN")}
          </Text>
          <View style={styles.rrBadge}>
            <Text style={styles.rrText}>R:R {strategy.rrRatio}</Text>
          </View>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.barWrap}>
          <WinRateBar winRate={strategy.winRate} height={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameCol: { flex: 1, gap: 3 },
  name: { color: "#dfe2eb", fontSize: 15, fontWeight: "700" },
  trades: { color: "#8c909f", fontSize: 10, fontWeight: "500" },
  pnlCol: { alignItems: "flex-end", gap: 4 },
  pnl: { fontSize: 15, fontWeight: "800" },
  rrBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rrText: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  barWrap: { flex: 1 },
  divider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.06)" },
  chevronBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#353940",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
