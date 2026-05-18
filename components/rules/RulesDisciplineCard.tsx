// components/rules/RulesDisciplineCard.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface RulesDisciplineCardProps {
  disciplineData: number[];
}

export function RulesDisciplineCard({ disciplineData }: RulesDisciplineCardProps) {
  const maxVal = Math.max(...disciplineData.filter((v) => v > 0), 1);
  const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rules Discipline</Text>

      {/* Bar chart */}
      <View style={styles.chart}>
        {disciplineData.map((val, i) => {
          const isToday = i === currentDayIndex;
          const hasData = val > 0;
          const height = hasData ? Math.max((val / maxVal) * 80, 8) : 8;
          const color =
            val >= 80
              ? "#43e5b1"
              : val >= 50
                ? "#f9c449"
                : val > 0
                  ? "#ff5451"
                  : "#262a31";

          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: color,
                      opacity: hasData ? 1 : 0.3,
                    },
                    isToday && styles.barToday,
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                {DAYS[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 20,
  },
  title: {
    color: "#dfe2eb",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 110,
    paddingBottom: 24,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    justifyContent: "flex-end",
    height: "100%",
  },
  barWrap: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: 18,
    borderRadius: 4,
    minHeight: 8,
  },
  barToday: {
    shadowColor: "#43e5b1",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  dayLabel: {
    color: "#424754",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    position: "absolute",
    bottom: -20,
  },
  dayLabelActive: {
    color: "#adc6ff",
  },
});
