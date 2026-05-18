// components/AuthCard.tsx

import { COLORS } from "@/constants/auth";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface AuthCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function AuthCard({ children, style }: AuthCardProps) {
  return (
    <View style={[styles.card, style]}>
      {/* Top rim light */}
      <View style={styles.rimLight} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
    overflow: "hidden",
  },
  rimLight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
