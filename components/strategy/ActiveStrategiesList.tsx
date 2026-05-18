import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActiveStrategyItem } from "./ActiveStrategyItem";
import { Strategy } from "../../types/strategy";

interface ActiveStrategiesListProps {
  activeStrategies: Strategy[];
}

export function ActiveStrategiesList({ activeStrategies }: ActiveStrategiesListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderCol}>
        <Text style={styles.sectionTitle}>Active Strategies</Text>
        <Text style={styles.sectionSubtitle}>
          Performance metrics for currently live systems
        </Text>
      </View>

      {activeStrategies.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name="strategy" size={36} color="#43e5b1" />
          <Text style={styles.emptyTitle}>No Active Strategies</Text>
          <Text style={styles.emptySubtitle}>
            Enable strategies from the list below to track them here
          </Text>
        </View>
      ) : (
        <View style={styles.listGap}>
          {activeStrategies.map((strategy: any) => (
            <ActiveStrategyItem
              key={strategy.id}
              strategy={strategy}
              onPress={(id) => console.log("Detail", id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 14 },
  sectionHeaderCol: { gap: 3 },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    color: "#8c909f",
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderStyle: "dashed",
  },
  emptyTitle: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  emptySubtitle: {
    color: "#8c909f",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
  },
  listGap: { gap: 10 },
});
