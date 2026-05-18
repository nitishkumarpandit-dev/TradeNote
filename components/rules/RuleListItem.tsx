// components/rules/RuleListItem.tsx

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CATEGORY_COLORS, CATEGORY_ICONS, Rule } from "../../types/rule";
import { AdherenceBar } from "./AdherenceBar";

interface RuleListItemProps {
  rule: Rule;
  onEdit?: (id: string) => void;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// ── Mini animated toggle ───────────────────────────────────────────────────────
function MiniToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) {
  const translateX = useRef(new Animated.Value(value ? 18 : 2)).current;
  const bgColor = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 18 : 2,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
      Animated.timing(bgColor, {
        toValue: value ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.1)", "rgba(67,229,177,0.25)"],
  });

  return (
    <TouchableOpacity onPress={onChange} activeOpacity={0.8}>
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: value ? "#43e5b1" : "rgba(255,255,255,0.3)",
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function RuleListItem({ rule, onEdit, onToggle, onDelete }: RuleListItemProps) {
  const catColors = CATEGORY_COLORS[rule.category];
  const catIcon = CATEGORY_ICONS[rule.category];

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: catColors.bg }]}>
          <MaterialCommunityIcons
            name={catIcon as any}
            size={20}
            color={catColors.text}
          />
        </View>

        {/* Name */}
        <View style={styles.nameWrap}>
          <Text style={styles.name}>{rule.name}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <MiniToggle
            value={rule.isActive}
            onChange={() => onToggle?.(rule.id)}
          />
          <TouchableOpacity
            onPress={() => onEdit?.(rule.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="edit" size={18} color="#8c909f" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete?.(rule.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="delete" size={18} color="#ff5451" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: catColors.bg }]}>
        <Text style={[styles.categoryText, { color: catColors.text }]}>
          {rule.category.toUpperCase()}
        </Text>
      </View>

      {/* Adherence bar */}
      <AdherenceBar
        adherenceCount={rule.adherenceCount}
        totalTrades={rule.totalTrades}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nameWrap: { flex: 1 },
  name: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  track: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
