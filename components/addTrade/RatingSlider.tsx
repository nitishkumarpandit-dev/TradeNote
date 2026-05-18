// components/addTrade/RatingSlider.tsx

import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RatingSliderProps {
  label: string;
  required?: boolean;
  value: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  midLabel: string;
  valueColor?: string;
}

export function RatingSlider({
  label,
  required,
  value,
  onChange,
  leftLabel,
  rightLabel,
  midLabel,
  valueColor = "#adc6ff",
}: RatingSliderProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>
          {label}{required && <Text style={{ color: "#ff5451" }}> *</Text>}
        </Text>
        <Text style={[styles.value, { color: valueColor }]}>
          {value}
          <Text style={styles.valueDenom}>/10</Text>
        </Text>
      </View>

      {/* Track + gradient overlay */}
      <View style={styles.trackWrap}>
        <View style={styles.trackBg} />
        <View
          style={[styles.trackFill, { width: `${((value - 1) / 9) * 100}%` }]}
        />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#adc6ff"
        />
      </View>

      {/* Scale labels */}
      <View style={styles.scaleRow}>
        <Text style={styles.scaleLabel}>{leftLabel}</Text>
        <Text style={styles.scaleLabel}>{midLabel}</Text>
        <Text style={styles.scaleLabel}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#c2c6d6",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 26,
  },
  valueDenom: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8c909f",
  },
  trackWrap: {
    height: 8,
    position: "relative",
    justifyContent: "center",
    marginVertical: 4,
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#262a31",
    borderRadius: 4,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 8,
    borderRadius: 4,
    // gradient from red → yellow → green
    backgroundColor: "#43e5b1",
  },
  slider: {
    position: "absolute",
    left: -10,
    right: -10,
    height: 30,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    fontSize: 10,
    color: "#8c909f",
    fontWeight: "500",
  },
});
