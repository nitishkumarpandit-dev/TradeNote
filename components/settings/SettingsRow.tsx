// components/settings/SettingsRow.tsx

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SettingsToggle } from "./SettingsToggle";

interface SettingsRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconType?: "material" | "community";
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  badge?: string; // e.g. "Locked"
  isLast?: boolean;
}

export function SettingsRow({
  title,
  subtitle,
  icon,
  iconType = "material",
  value,
  onChange,
  disabled = false,
  badge,
  isLast = false,
}: SettingsRowProps) {
  return (
    <View
      style={[
        styles.row,
        !isLast && styles.rowBorder,
        disabled && styles.rowDimmed,
      ]}
    >
      {/* Icon */}
      {icon && (
        <View style={styles.iconContainer}>
          {iconType === "material" ? (
            <MaterialIcons
              name={icon as any}
              size={18}
              color={disabled ? "#8c909f" : "#4d8eff"}
            />
          ) : (
            <MaterialCommunityIcons
              name={icon as any}
              size={18}
              color={disabled ? "#8c909f" : "#4d8eff"}
            />
          )}
        </View>
      )}

      {/* Text side */}
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Toggle */}
      <SettingsToggle value={value} onChange={onChange} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowDimmed: {
    opacity: 0.4,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  subtitle: {
    color: "#8c909f",
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "#31353c",
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
