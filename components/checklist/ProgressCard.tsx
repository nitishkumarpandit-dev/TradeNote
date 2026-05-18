// components/checklist/ProgressCard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressCardProps {
  type: "PRE-MARKET" | "POST-MARKET";
  percent: number;
  done: number;
  total: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

export function ProgressCard({ type, percent, done, total, icon, iconColor }: ProgressCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.typeLabel, { color: iconColor }]}>{type}</Text>
        <MaterialIcons name={icon} size={14} color={iconColor} />
      </View>

      <Text style={styles.percentText}>{percent}%</Text>
      <Text style={styles.countText}>{done}/{total} Done</Text>

      <View style={styles.progressBarBg}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percent}%`, backgroundColor: iconColor }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  percentText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 2,
  },
  countText: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
