// components/mistakes/FrequencyHeatmap.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// intensity 0–4 → color
const INTENSITY_COLORS = [
  "#1c2026", // 0 = no activity
  "rgba(77,142,255,0.2)", // 1
  "rgba(77,142,255,0.4)", // 2
  "rgba(77,142,255,0.65)", // 3
  "#4d8eff", // 4 = max
];

interface FrequencyHeatmapProps {
  data: number[][]; // rows × 7 cols
}

export function FrequencyHeatmap({ data }: FrequencyHeatmapProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Frequency Heatmap</Text>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="info-outline" size={18} color="#8c909f" />
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.dayLabels}>
        {DAYS.map((d, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={styles.dayText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      <View style={styles.grid}>
        {data.map((row, ri) => (
          <View key={ri} style={styles.gridRow}>
            {row.map((intensity, ci) => (
              <View
                key={ci}
                style={[
                  styles.cell,
                  {
                    backgroundColor: INTENSITY_COLORS[Math.min(intensity, 4)],
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {INTENSITY_COLORS.map((color, i) => (
          <View
            key={i}
            style={[styles.legendCell, { backgroundColor: color }]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  dayLabels: {
    flexDirection: "row",
    gap: 6,
  },
  dayCell: { flex: 1, alignItems: "center" },
  dayText: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "700",
  },
  grid: { gap: 6 },
  gridRow: { flexDirection: "row", gap: 6 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
    minHeight: 28,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
    marginTop: 4,
  },
  legendLabel: { color: "#424754", fontSize: 9, fontWeight: "600" },
  legendCell: { width: 12, height: 12, borderRadius: 3 },
});
