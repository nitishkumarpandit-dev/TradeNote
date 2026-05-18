// components/mistakes/MistakeListItem.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  IMPACT_CONFIG,
  Mistake,
  SEVERITY_BORDER,
  SEVERITY_CONFIG,
} from "../../types/mistake";

interface MistakeListItemProps {
  mistake: Mistake;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MistakeListItem({
  mistake,
  onEdit,
  onDelete,
}: MistakeListItemProps) {
  const severityCfg = SEVERITY_CONFIG[mistake.severity];
  const impactCfg = IMPACT_CONFIG[mistake.impact];
  const borderColor = SEVERITY_BORDER[mistake.severity];

  const isProfit = mistake.pnlImpact >= 0;
  const pnlColor = isProfit ? "#43e5b1" : "#ff5451";
  const pnlText = isProfit
    ? `+$${mistake.pnlImpact}`
    : `-$${Math.abs(mistake.pnlImpact).toLocaleString()}`;

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.nameCol}>
          <Text style={styles.name}>{mistake.name}</Text>
          <Text style={styles.category}>{mistake.category}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit?.(mistake.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="edit" size={16} color="#8c909f" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete?.(mistake.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="delete" size={16} color="#ff5451" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges + count row */}
      <View style={styles.bottomRow}>
        <View style={styles.badges}>
          {/* Severity badge */}
          <View style={[styles.badge, { backgroundColor: severityCfg.bg }]}>
            <View style={[styles.dot, { backgroundColor: severityCfg.dot }]} />
            <Text style={[styles.badgeText, { color: severityCfg.color }]}>
              {severityCfg.label}
            </Text>
          </View>

          {/* Impact badge */}
          <View style={[styles.badge, { backgroundColor: impactCfg.bg }]}>
            <Text style={[styles.badgeText, { color: impactCfg.color }]}>
              {impactCfg.label}
            </Text>
          </View>
        </View>

        {/* Occurrence count */}
        <Text style={styles.count}>{mistake.occurrences}x</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    borderLeftWidth: 3,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  nameCol: { flex: 1, gap: 3 },
  name: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  category: { color: "#8c909f", fontSize: 11 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  badges: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  count: {
    color: "#c2c6d6",
    fontSize: 13,
    fontWeight: "800",
    minWidth: 24,
    textAlign: "right",
  },
});
