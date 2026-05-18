// components/addTrade/TradeSuccessSheet.tsx

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TradeSuccessSheetProps {
  onKeepJournaling: () => void;
  todayPnl: string;
  yesterdayPnl: string;
}

export const TradeSuccessSheet = forwardRef<
  BottomSheetModal,
  TradeSuccessSheetProps
>(({ onKeepJournaling, todayPnl, yesterdayPnl }, ref) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
      />
    ),
    [],
  );

  const diff = parseFloat(todayPnl) - parseFloat(yesterdayPnl);
  const isIncrease = diff >= 0;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <View style={styles.iconCircle}>
            <MaterialIcons name="check-circle" size={64} color="#43e5b1" />
          </View>
        </View>

        {/* Header Text */}
        <View style={styles.headerText}>
          <Text style={styles.title}>Trade Saved Successfully!</Text>
          <Text style={styles.subtitle}>
            The more you write, the more you grow. Stay focused.
          </Text>
        </View>

        {/* Comparison Card */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonLabel}>
            COMPARISON WITH PREVIOUS DAY&apos;S P&L
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TODAY&apos;S P&L</Text>
              <Text style={styles.todayValue}>+{todayPnl}</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxSecondary]}>
              <Text style={styles.statLabel}>YESTERDAY&apos;S P&L</Text>
              <Text style={styles.yesterdayValue}>+{yesterdayPnl}</Text>
            </View>
          </View>

          <View style={styles.comparisonFooter}>
            <View style={styles.trendIconWrap}>
              <MaterialCommunityIcons
                name={isIncrease ? "trending-up" : "trending-down"}
                size={20}
                color="#4d8eff"
              />
            </View>
            <Text style={styles.comparisonText}>
              You saw an {isIncrease ? "increase" : "decrease"} of{" "}
              <Text style={styles.highlightText}>
                {Math.abs(diff).toFixed(2)}
              </Text>{" "}
              in your P&L compared to the last session!
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={onKeepJournaling}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#4d8eff", "#3b82f6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.ctaText}>Keep Journaling</Text>
          </LinearGradient>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TradeSuccessSheet.displayName = "TradeSuccessSheet";

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#10141a",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 48,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  iconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(67, 229, 177, 0.2)",
    borderRadius: 999,
    transform: [{ scale: 1.5 }],
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#10141a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#10141a",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  headerText: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#c2c6d6",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 20,
  },
  comparisonCard: {
    width: "100%",
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4d8eff",
    marginBottom: 32,
  },
  comparisonLabel: {
    color: "#dfe2eb",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#262a31",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statBoxSecondary: {
    backgroundColor: "rgba(10, 14, 20, 0.5)",
  },
  statLabel: {
    color: "#8c909f",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 4,
  },
  todayValue: {
    color: "#43e5b1",
    fontSize: 18,
    fontWeight: "800",
  },
  yesterdayValue: {
    color: "rgba(67, 229, 177, 0.6)",
    fontSize: 18,
    fontWeight: "800",
  },
  comparisonFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trendIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(77, 142, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonText: {
    flex: 1,
    color: "#dfe2eb",
    fontSize: 12,
    lineHeight: 16,
  },
  highlightText: {
    color: "#4d8eff",
    fontWeight: "800",
  },
  ctaBtn: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#4d8eff",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
