import React, { useEffect } from "react";
import { DimensionValue, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#262a31",
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ── Generic Card Skeleton ──
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <Skeleton width="40%" height={20} />
        <Skeleton width={32} height={20} borderRadius={6} />
      </View>
      <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={14} style={{ marginBottom: 16 }} />
      
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

// ── Trade History Skeleton ──
export function TradeHistorySkeleton() {
  return (
    <View style={styles.tradeCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={24} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Skeleton width={80} height={20} />
        <Skeleton width={40} height={16} borderRadius={4} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <Skeleton width="45%" height={30} />
        <Skeleton width="45%" height={30} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Skeleton width={70} height={20} borderRadius={6} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton width={20} height={20} borderRadius={4} />
          <Skeleton width={20} height={20} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tradeCard: {
    backgroundColor: "#1c2026",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderLeftWidth: 3,
    borderLeftColor: "#262a31",
  }
});
