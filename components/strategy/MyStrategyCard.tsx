// components/strategy/MyStrategyCard.tsx

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Strategy } from "../../types/strategy";

interface MyStrategyCardProps {
  strategy: Strategy;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLast?: boolean;
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

// ── Main component ─────────────────────────────────────────────────────────────
export function MyStrategyCard({
  strategy,
  onToggle,
  onEdit,
  onDelete,
  isLast = false,
}: MyStrategyCardProps) {
  const iconBg = strategy.isActive ? "rgba(77,142,255,0.12)" : "#353940";
  const iconColor = strategy.isActive ? "#adc6ff" : "#8c909f";

  return (
    <View style={[styles.card, !isLast && styles.cardBorder]}>
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={strategy.icon as any}
          size={22}
          color={iconColor}
        />
      </View>

      {/* Text */}
      <View style={styles.textWrap}>
        <Text style={styles.name}>{strategy.name}</Text>
        <Text style={styles.desc} numberOfLines={1}>
          {strategy.description}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <MiniToggle
          value={strategy.isActive}
          onChange={() => onToggle(strategy.id)}
        />
        <TouchableOpacity
          onPress={() => onEdit?.(strategy.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="edit" size={18} color="#8c909f" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete?.(strategy.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="delete" size={18} color="#ff5451" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1, gap: 3 },
  name: { color: "#dfe2eb", fontSize: 14, fontWeight: "700" },
  desc: { color: "#8c909f", fontSize: 12, lineHeight: 16 },
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
