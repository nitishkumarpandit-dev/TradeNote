// components/settings/SettingsSection.tsx

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SettingsSection({
  label,
  children,
  style,
}: SettingsSectionProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    color: "rgba(194,198,214,0.55)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#262a31",
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
