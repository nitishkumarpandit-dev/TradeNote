// components/strategy/WinRateBar.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WinRateBarProps {
  winRate: number;
  showLabel?: boolean;
  height?: number;
}

export function WinRateBar({
  winRate,
  showLabel = true,
  height = 6,
}: WinRateBarProps) {
  const color =
    winRate >= 60 ? "#43e5b1" : winRate >= 45 ? "#f9c449" : "#ff5451";

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>WIN RATE</Text>
          <Text style={[styles.value, { color }]}>{winRate}%</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${winRate}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#8c909f",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
  },
  track: {
    backgroundColor: "#262a31",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 999,
  },
});
