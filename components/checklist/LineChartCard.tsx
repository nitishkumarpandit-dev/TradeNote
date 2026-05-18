// components/checklist/LineChartCard.tsx

import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface LineChartCardProps {
  labels: string[];
  data: number[];
}

export function LineChartCard({ labels, data: chartValues }: LineChartCardProps) {
  const screenWidth = Dimensions.get("window").width;

  const chartData = {
    labels: labels.length > 0 ? labels : ["N/A"],
    datasets: [
      {
        data: chartValues.length > 0 ? chartValues : [0],
        color: (opacity = 1) => `rgba(77, 142, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#1c2026",
    backgroundGradientFrom: "#1c2026",
    backgroundGradientTo: "#1c2026",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(77, 142, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(140, 144, 159, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4d8eff",
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: "600",
    },
    fillShadowGradient: "#4d8eff",
    fillShadowGradientOpacity: 0.15,
    propsForBackgroundLines: {
      stroke: "rgba(255, 255, 255, 0.08)",
      strokeDasharray: "0", // solid lines
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discipline Consistency</Text>
        </View>
        <View style={styles.glowPoint} />
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 20} // Increased width to account for negative margin
        height={260}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withHorizontalLines={true}
        withVerticalLines={false}
        withInnerLines={true}
        withOuterLines={true}
        withHorizontalLabels={true}
        segments={10}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c2026",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12, // Decreased left/right padding
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden", // Prevent grid overflow
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 8, // Shift header text slightly in from the edge
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  glowPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4d8eff",
    shadowColor: "#4d8eff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  chart: {
    marginTop: 8,
    marginLeft: -32, // More negative margin to pull left
  },
});
