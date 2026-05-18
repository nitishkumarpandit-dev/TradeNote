// components/rules/RulesPerformanceCard.tsx

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Rule } from "../../types/rule";
import { CircularProgress } from "./CircularProgress";

const TIME_FILTERS = ["Last 30 Days", "Last 7 Days", "All Time"] as const;

interface RulesPerformanceCardProps {
  topFollowed: Rule[];
  leastUsed: Rule[];
  selectedFilter: "Last 30 Days" | "Last 7 Days" | "All Time";
  onFilterChange: (f: "Last 30 Days" | "Last 7 Days" | "All Time") => void;
}

interface RuleRowProps {
  rule: Rule;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
}

function RuleRow({
  rule,
  badge,
  badgeColor = "#43e5b1",
  badgeBg = "rgba(67,229,177,0.12)",
}: RuleRowProps) {
  const pct =
    rule.totalTrades > 0
      ? Math.round((rule.adherenceCount / rule.totalTrades) * 100)
      : 0;

  return (
    <View style={styles.ruleRow}>
      <CircularProgress percentage={pct} size={44} strokeWidth={4} />
      <View style={styles.ruleInfo}>
        <Text style={styles.ruleName}>{rule.name}</Text>
        <Text style={styles.ruleCategory}>{rule.category}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export function RulesPerformanceCard({
  topFollowed,
  leastUsed,
  selectedFilter,
  onFilterChange,
}: RulesPerformanceCardProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Rules Analysis</Text>
          <Text style={styles.cardSubtitle}>Track your trading discipline</Text>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterOpen((p) => !p)}
          activeOpacity={0.8}
        >
          <Text style={styles.filterText}>{selectedFilter}</Text>
          <MaterialIcons name="expand-more" size={16} color="#8c909f" />
        </TouchableOpacity>
      </View>

      {/* Filter selection Modal */}
      <Modal visible={filterOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterOpen(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Filter</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)}>
                <MaterialIcons name="close" size={20} color="#8c909f" />
              </TouchableOpacity>
            </View>
            {TIME_FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.modalOption,
                  f === selectedFilter && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onFilterChange(f);
                  setFilterOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    f === selectedFilter && styles.modalOptionTextActive,
                  ]}
                >
                  {f}
                </Text>
                {f === selectedFilter && (
                  <MaterialIcons name="check" size={16} color="#4d8eff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      {topFollowed.length === 0 && leastUsed.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rules found for the selected timeframe.</Text>
        </View>
      ) : (
        <>
          {topFollowed.length > 0 && (
            <View style={styles.subSection}>
              <View style={styles.subHeader}>
                <MaterialCommunityIcons
                  name="trophy-outline"
                  size={16}
                  color="#f9c449"
                />
                <Text style={styles.subTitle}>Top 5 Most Followed Rules</Text>
              </View>
              <View style={styles.ruleList}>
                {topFollowed.slice(0, 5).map((rule) => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    badge={`${rule.adherenceCount} uses`}
                    badgeColor="#43e5b1"
                    badgeBg="rgba(67,229,177,0.12)"
                  />
                ))}
              </View>
            </View>
          )}

          {topFollowed.length > 0 && leastUsed.length > 0 && (
            <View style={styles.divider} />
          )}

          {leastUsed.length > 0 && (
            <View style={styles.subSection}>
              <View style={styles.subHeader}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color="#ff5451"
                />
                <Text style={styles.subTitle}>Least Used Rules</Text>
              </View>
              <View style={styles.ruleList}>
                {leastUsed.map((rule) => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    badge={`${rule.adherenceCount} uses`}
                    badgeColor="#ff5451"
                    badgeBg="rgba(255,84,81,0.12)"
                  />
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "#dfe2eb",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  cardSubtitle: {
    color: "#8c909f",
    fontSize: 12,
    marginTop: 3,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#262a31",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  filterText: { color: "#8c909f", fontSize: 11, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  modalTitle: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  modalOptionActive: { backgroundColor: "rgba(77,142,255,0.08)" },
  modalOptionText: { color: "#8c909f", fontSize: 14 },
  modalOptionTextActive: { color: "#4d8eff", fontWeight: "600" },
  subSection: { gap: 12 },
  subHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  subTitle: { color: "#dfe2eb", fontSize: 13, fontWeight: "700" },
  ruleList: { gap: 12 },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ruleInfo: { flex: 1, gap: 2 },
  ruleName: { color: "#dfe2eb", fontSize: 13, fontWeight: "600" },
  ruleCategory: { color: "#8c909f", fontSize: 11 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "800" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#8c909f",
    fontSize: 13,
    textAlign: "center",
  },
});
