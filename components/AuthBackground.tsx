// components/AuthBackground.tsx

import { COLORS } from "@/constants/auth";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  header?: React.ReactNode;
}

export default function AuthBackground({
  children,
  scrollable = true,
  header,
}: AuthBackgroundProps) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative orbs */}
      <View style={[styles.orb, styles.orbTopRight]} pointerEvents="none" />
      <View style={[styles.orb, styles.orbBottomLeft]} pointerEvents="none" />

      {/* Optional fixed header */}
      {header && <View style={styles.fixedHeader}>{header}</View>}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  flex: {
    flex: 1,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    pointerEvents: "none",
  },
  orbTopRight: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.orbBlue,
    top: -60,
    right: -60,
    // Simulate blur with nested semi-transparent views
    shadowColor: COLORS.primaryBlueDim,
    shadowOpacity: 0.4,
    shadowRadius: 80,
    shadowOffset: { width: 0, height: 0 },
  },
  orbBottomLeft: {
    width: 250,
    height: 250,
    backgroundColor: COLORS.orbRed,
    bottom: -40,
    left: -40,
    shadowColor: COLORS.red,
    shadowOpacity: 0.25,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
  },
});
