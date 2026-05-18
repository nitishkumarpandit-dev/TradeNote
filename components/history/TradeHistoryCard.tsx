// components/history/TradeHistoryCard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HistoryTrade, OUTCOME_COLORS } from "../../types/history";

interface TradeHistoryCardProps {
  trade: HistoryTrade;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  hideActions?: boolean;
}

export const TradeHistoryCard = React.memo(function TradeHistoryCard({
  trade,
  onEdit,
  onDelete,
  hideActions = false,
}: TradeHistoryCardProps) {
  const netPnl = (trade.pnl || 0) - (trade.charges || 0);
  const isProfit = netPnl >= 0.0001;
  const isLoss = netPnl <= -0.0001;
  
  const pnlColor = isProfit ? "#43e5b1" : isLoss ? "#ff5451" : "#adc6ff";
  const pnlSign = isProfit ? "+" : "";
  
  const defaultOutcomeCfg = { text: "#adc6ff", bg: "rgba(173,198,255,0.12)", border: "#adc6ff" };
  const outcomeCfg = OUTCOME_COLORS[trade.outcome] || defaultOutcomeCfg;
  const borderColor = outcomeCfg.border;

  const directionBg =
    trade.direction === "LONG"
      ? "rgba(67,229,177,0.15)"
      : "rgba(255,84,81,0.15)";
  const directionColor = trade.direction === "LONG" ? "#43e5b1" : "#ff5451";

  const formatAmount = (val: number) => {
    const abs = Math.abs(val);
    if (abs === 0) return "0.00";
    if (abs < 0.1) return val.toFixed(4);
    if (abs < 1) return val.toFixed(3);
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPrice = (p: number | undefined | null) => {
    if (p === undefined || p === null) return "0.00";
    if (p >= 1000)
      return p.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    if (p < 1) return p.toFixed(4);
    return p.toFixed(2);
  };

  const margin = trade.margin || (trade.entryPrice || 0) * (trade.quantity || 0);
  const netPnlPercent = margin > 0 ? (netPnl / margin) * 100 : 0;

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      {/* ── Row 1: date + PnL ── */}
      <View style={styles.row1}>
        <Text style={styles.dateTime}>
          {trade.date} • {trade.time}
        </Text>
        <View style={styles.pnlCol}>
          <Text style={[styles.pnlAmount, { color: pnlColor }]}>
            {pnlSign}${formatAmount(netPnl)}
          </Text>
          <Text style={[styles.pnlPercent, { color: pnlColor }]}>
            {pnlSign}
            {Math.abs(netPnlPercent).toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* ── Row 2: symbol + direction ── */}
      <View style={styles.row2}>
        <Text style={styles.symbol}>{trade.symbol}</Text>
        <View style={[styles.dirBadge, { backgroundColor: directionBg }]}>
          <Text style={[styles.dirText, { color: directionColor }]}>
            {trade.direction}
          </Text>
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Row 3: Execution + Strategy & R:R ── */}
      <View style={styles.row3}>
        <View style={styles.executionCol}>
          <Text style={styles.metaLabel}>EXECUTION</Text>
          <Text style={styles.executionPrices}>
            {formatPrice(trade.entryPrice)} → {formatPrice(trade.exitPrice)}
          </Text>
        </View>
        <View style={styles.strategyCol}>
          <Text style={styles.metaLabel}>STRATEGY & R:R</Text>
          <View style={styles.strategyRow}>
            <Text style={styles.strategyName}>{trade.strategy}</Text>
            <View style={styles.rrBadge}>
              <Text style={styles.rrText}>{trade.rrRatio}</Text>
            </View>
          </View>
        </View>
      </View>


      {/* ── Row 4: outcome + actions ── */}
      <View style={styles.row4}>
        <View style={[styles.outcomeBadge, { backgroundColor: outcomeCfg.bg }]}>
          <Text style={[styles.outcomeText, { color: outcomeCfg.text }]}>
            {trade.outcome}
          </Text>
        </View>
        {!hideActions && (
          <View style={styles.actionBtns}>
            <TouchableOpacity
              onPress={() => onEdit?.(trade.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="edit" size={18} color="#8c909f" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete?.(trade.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="delete" size={18} color="#8c909f" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderLeftWidth: 3,
    gap: 10,
  },

  // Row 1
  row1: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  dateTime: {
    color: "#8c909f",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  pnlCol: { alignItems: "flex-end" },
  pnlAmount: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  pnlPercent: { fontSize: 11, fontWeight: "600", marginTop: 1 },

  // Row 2
  row2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -2,
  },
  symbol: {
    color: "#dfe2eb",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  dirBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  dirText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 2,
  },

  // Row 3
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  executionCol: { flex: 1, gap: 4 },
  metaLabel: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  executionPrices: {
    color: "#c2c6d6",
    fontSize: 13,
    fontWeight: "500",
  },
  strategyCol: { flex: 1, alignItems: "flex-end", gap: 4 },
  strategyRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  strategyName: {
    color: "#dfe2eb",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  rrBadge: {
    backgroundColor: "#262a31",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  rrText: { color: "#8c909f", fontSize: 10, fontWeight: "700" },


  // Row 4
  row4: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  outcomeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  outcomeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  actionBtns: { flexDirection: "row", gap: 16, alignItems: "center" },
});
