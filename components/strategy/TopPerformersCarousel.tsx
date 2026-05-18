import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StrategyPerformanceCard } from "./StrategyPerformanceCard";
import { Strategy } from "../../types/strategy";

const CarouselSeparator = () => <View style={{ width: 12 }} />;

interface TopPerformersCarouselProps {
  topPerformers: Strategy[];
  onViewDetails: (id: string) => void;
}

export function TopPerformersCarousel({ topPerformers, onViewDetails }: TopPerformersCarouselProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>TOP PERFORMANCE</Text>
        <Text style={styles.sectionCount}>
          {topPerformers.length} Strategies
        </Text>
      </View>

      {topPerformers.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name="trophy-outline" size={36} color="#4d8eff" />
          <Text style={styles.emptyTitle}>No Top Performers Yet</Text>
          <Text style={styles.emptySubtitle}>
            Strategies with positive PnL will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={topPerformers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          ItemSeparatorComponent={CarouselSeparator}
          renderItem={({ item }) => (
            <StrategyPerformanceCard
              strategy={item}
              onViewDetails={onViewDetails}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 14 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  sectionLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionCount: {
    color: "#4d8eff",
    fontSize: 12,
    fontWeight: "600",
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
  carouselContent: { paddingVertical: 4 },
});
