// components/checklist/AIInsightCard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AIInsightCardProps {
  insight: string;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.aiIcon}>
          <MaterialIcons name="psychology" size={18} color="#4d8eff" />
        </View>
        <Text style={styles.headerTitle}>AI ANALYST</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Dynamic Insight */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.habitLabel}>ANALYSIS</Text>
            <MaterialIcons name="auto-awesome" size={14} color="#43e5b1" />
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c2026",
    borderRadius: 32,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(77, 142, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  cardContainer: {
    gap: 16,
  },
  insightCard: {
    backgroundColor: "#0a0e14",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weakLabel: {
    color: "#ff5451",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  habitLabel: {
    color: "#43e5b1",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  insightText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  weakHighlight: {
    color: "#ff5451",
    fontWeight: "800",
  },
  habitHighlight: {
    color: "#43e5b1",
    fontWeight: "800",
  },
});
