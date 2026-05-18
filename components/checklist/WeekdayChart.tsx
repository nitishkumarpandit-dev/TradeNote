import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface WeekdayChartProps {
  data: number[];
}

export function WeekdayChart({ data: barValues }: WeekdayChartProps) {
  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: barValues.length > 0 ? barValues : [0, 0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#1c2026",
    backgroundGradientFrom: "#1c2026",
    backgroundGradientTo: "#1c2026",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 84, 81, ${opacity})`, // Reddish bars
    labelColor: (opacity = 1) => `rgba(140, 144, 159, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: "600",
    },
    propsForBackgroundLines: {
      stroke: "rgba(255, 255, 255, 0.08)",
      strokeDasharray: "0", // solid lines
    },
    fillShadowGradient: "#ff5451",
    fillShadowGradientOpacity: 1,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekday Performance</Text>

      <BarChart
        data={data}
        width={screenWidth - 20} // Increased width to account for negative margin
        height={260}
        chartConfig={chartConfig}
        style={styles.chart}
        segments={10}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
        showBarTops={false}
        flatColor={true}
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
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 24,
    paddingHorizontal: 8, // Shift title slightly in from the edge
  },
  chart: {
    marginTop: 8,
    marginLeft: -32, // More negative margin to pull left
  },
});
