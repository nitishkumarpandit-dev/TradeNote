// components/checklist/AnalysisStats.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnalysisStatsProps {
  currentStreak: number;
  avgCompletion: number;
  bestDayPercent: number;
  totalLogged: number;
}

export function AnalysisStats({
  currentStreak,
  avgCompletion,
  bestDayPercent,
  totalLogged,
}: AnalysisStatsProps) {
  const stats = [
    { label: "Current Streak", value: currentStreak, unit: "Days", color: "#4d8eff" },
    { label: "Avg Completion", value: avgCompletion, unit: "%", color: "#ffffff" },
    { label: "Best Day %", value: bestDayPercent, unit: "%", color: "#43e5b1" },
    { label: "Total Logged", value: totalLogged, unit: "Entries", color: "#ffffff" },
  ];

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {stats.slice(0, 2).map((stat, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
            <View style={styles.valueRow}>
              <Text style={[styles.value, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.unit, { color: stat.color === "#ffffff" ? "#8c909f" : stat.color }]}>
                {stat.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.row}>
        {stats.slice(2, 4).map((stat, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
            <View style={styles.valueRow}>
              <Text style={[styles.value, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.unit, { color: stat.color === "#ffffff" ? "#8c909f" : stat.color }]}>
                {stat.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  label: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
  },
  unit: {
    fontSize: 10,
    fontWeight: "700",
  },
});
