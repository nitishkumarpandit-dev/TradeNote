// components/rules/AdherenceBar.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AdherenceBarProps {
  adherenceCount: number;
  totalTrades: number;
  showLabel?: boolean;
  compact?: boolean;
}

export function AdherenceBar({
  adherenceCount,
  totalTrades,
  showLabel = true,
  compact = false,
}: AdherenceBarProps) {
  const pct =
    totalTrades > 0 ? Math.round((adherenceCount / totalTrades) * 100) : 0;
  const color = pct >= 80 ? "#43e5b1" : pct >= 50 ? "#f9c449" : "#ff5451";

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, compact && styles.labelCompact]}>
            {pct}% Adherence
          </Text>
          <Text style={[styles.fraction, compact && styles.labelCompact]}>
            ({adherenceCount}/{totalTrades})
          </Text>
        </View>
      )}
      <View style={[styles.track, compact && styles.trackCompact]}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: color,
              height: compact ? 4 : 6,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 5 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#c2c6d6",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelCompact: { fontSize: 10 },
  fraction: { color: "#8c909f", fontSize: 10 },
  track: {
    height: 6,
    backgroundColor: "#262a31",
    borderRadius: 999,
    overflow: "hidden",
  },
  trackCompact: { height: 4 },
  fill: { borderRadius: 999 },
});
