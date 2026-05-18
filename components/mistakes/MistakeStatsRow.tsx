// components/mistakes/MistakeStatsRow.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Mistake } from "../../types/mistake";

interface MistakeStatsRowProps {
  totalMistakes: number;
  mostCommon: Mistake | null;
}

export function MistakeStatsRow({
  totalMistakes,
  mostCommon,
}: MistakeStatsRowProps) {
  return (
    <View style={styles.row}>
      {/* Total Mistakes */}
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>TOTAL MISTAKES</Text>
        </View>
        <Text style={styles.bigNumber}>{totalMistakes}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: "60%" }]} />
        </View>
      </View>

      {/* Most Common */}
      <View style={styles.card}>
        <Text style={styles.label}>MOST COMMON</Text>
        <Text style={styles.commonName} numberOfLines={2}>
          {mostCommon?.name ?? "—"}
        </Text>
        {mostCommon && (
          <View style={styles.occurrenceBadge}>
            <Text style={styles.occurrenceText}>
              {mostCommon.occurrences} OCCURRENCES
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 8,
    minHeight: 110,
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  changeBadge: {
    backgroundColor: "rgba(255,84,81,0.15)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  changeText: { color: "#ff5451", fontSize: 9, fontWeight: "800" },
  bigNumber: {
    color: "#dfe2eb",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
  },
  barTrack: {
    height: 3,
    backgroundColor: "#262a31",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: 3,
    backgroundColor: "#ff5451",
    borderRadius: 2,
  },
  commonName: {
    color: "#dfe2eb",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 22,
    flex: 1,
  },
  occurrenceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(249,196,73,0.12)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  occurrenceText: {
    color: "#f9c449",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
