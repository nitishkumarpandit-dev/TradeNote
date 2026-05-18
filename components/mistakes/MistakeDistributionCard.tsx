// components/mistakes/MistakeDistributionCard.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CATEGORY_BAR_COLOR, MistakeCategory } from "../../types/mistake";

interface DistributionEntry {
  category: MistakeCategory;
  count: number;
  pct: number;
}

interface MistakeDistributionCardProps {
  data: DistributionEntry[];
  filter: "This Month" | "All";
  onFilterChange: (f: "This Month" | "All") => void;
}

// components/mistakes/MistakeDistributionCard.tsx
const FILTERS = ["This Month", "All"] as const;

export function MistakeDistributionCard({
  data,
  filter,
  onFilterChange,
}: MistakeDistributionCardProps) {
  // Short category labels for x-axis
  const SHORT_LABELS: Record<MistakeCategory, string> = {
    Risk: "Risk",
    Psychology: "FOMO",
    Entry: "Over",
    Exit: "Exit",
    Strategy: "News",
    Other: "Other",
  };

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mistake Distribution</Text>
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, f === filter && styles.filterBtnActive]}
              onPress={() => onFilterChange(f)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  f === filter && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bar chart */}
      <View style={styles.chartArea}>
        {data.map((entry) => {
          const barHeight = Math.max((entry.count / maxCount) * 100, 6);
          const color = CATEGORY_BAR_COLOR[entry.category] ?? "#8c909f";

          return (
            <View key={entry.category} style={styles.barCol}>
              <View style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>
                {SHORT_LABELS[entry.category]}
              </Text>
            </View>
          );
        })}
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
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  filters: { flexDirection: "row", gap: 6 },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#262a31",
  },
  filterBtnActive: { backgroundColor: "#31353c" },
  filterText: { color: "#8c909f", fontSize: 11, fontWeight: "600" },
  filterTextActive: { color: "#dfe2eb" },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 120,
    paddingBottom: 24,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barWrap: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: 22,
    borderRadius: 4,
    minHeight: 6,
  },
  barLabel: {
    color: "#424754",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginTop: 6,
    position: "absolute",
    bottom: -20,
  },
});
