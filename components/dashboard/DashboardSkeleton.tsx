import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ShimmerPlaceholder = createShimmerPlaceHolder(LinearGradient);
const screenWidth = Dimensions.get("window").width;

const ShimmerBlock = ({
  width,
  height,
  borderRadius = 16,
  style = {},
}: any) => (
  <ShimmerPlaceholder
    shimmerColors={["#1c2026", "#262a31", "#1c2026"]}
    style={[
      {
        width,
        height,
        borderRadius,
        marginBottom: style.marginBottom || 0,
        marginRight: style.marginRight || 0,
      },
      style,
    ]}
  />
);

export const DashboardSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-background px-10"
      style={{ flex: 1, backgroundColor: "#10141a" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: 100,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <View>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <ShimmerBlock width={150} height={30} borderRadius={8} />
          <View className="flex-row items-center">
            <ShimmerBlock
              width={32}
              height={32}
              borderRadius={16}
              style={{ marginRight: 12 }}
            />
            <ShimmerBlock width={32} height={32} borderRadius={16} />
          </View>
        </View>

        {/* Filters */}
        <View className="flex-row mb-6">
          <ShimmerBlock
            width={80}
            height={32}
            borderRadius={16}
            style={{ marginRight: 10 }}
          />
          <ShimmerBlock width={120} height={32} borderRadius={16} />
        </View>

        {/* Stats Cards */}
        <View className="flex-row mb-6">
          <ShimmerBlock width={160} height={100} style={{ marginRight: 12 }} />
          <ShimmerBlock width={160} height={100} />
        </View>

        {/* Confidence Index */}
        <ShimmerBlock width="100%" height={140} style={{ marginBottom: 24 }} />

        {/* Insights Cards */}
        <View className="flex-row justify-between mb-8">
          <ShimmerBlock width={(screenWidth - 48) / 3} height={110} />
          <ShimmerBlock width={(screenWidth - 48) / 3} height={110} />
          <ShimmerBlock width={(screenWidth - 48) / 3} height={110} />
        </View>

        {/* Cumulative P&L */}
        <ShimmerBlock width="100%" height={260} style={{ marginBottom: 24 }} />

        {/* Section Titles */}
        <ShimmerBlock
          width={150}
          height={24}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />

        {/* List items */}
        {[1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={72}
            style={{ marginBottom: 12 }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export const DynamicDataSkeleton = () => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      {/* Stats Cards */}
      <View className="flex-row mb-6">
        <ShimmerBlock width={160} height={100} style={{ marginRight: 12 }} />
        <ShimmerBlock width={160} height={100} />
      </View>

      {/* Confidence Index */}
      <ShimmerBlock width="100%" height={140} style={{ marginBottom: 24 }} />

      {/* Cumulative P&L */}
      <ShimmerBlock width="100%" height={260} style={{ marginBottom: 24 }} />

      {/* Section Titles */}
      <ShimmerBlock
        width={150}
        height={24}
        borderRadius={4}
        style={{ marginBottom: 16 }}
      />

      {/* List items */}
      {[1, 2].map((i) => (
        <ShimmerBlock
          key={i}
          width="100%"
          height={72}
          style={{ marginBottom: 12 }}
        />
      ))}
    </View>
  );
};
