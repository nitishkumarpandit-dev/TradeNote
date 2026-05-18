// components/addTrade/DisplayField.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DisplayFieldProps {
  value: string;
  color?: string;
  compact?: boolean;
}

export function DisplayField({
  value,
  color = "#c2c6d6",
  compact = false,
}: DisplayFieldProps) {
  return (
    <View style={[styles.wrapper, compact ? styles.compact : styles.normal]}>
      <Text style={[styles.text, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#1c2026",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
  },
  normal: { paddingVertical: 10 },
  compact: { paddingVertical: 8 },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
});
