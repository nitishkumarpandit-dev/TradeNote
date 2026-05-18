// components/addTrade/LeverageSlider.tsx

import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LeverageSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export function LeverageSlider({ value, onChange }: LeverageSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.value}>{value}x</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={200}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#4d8eff"
        maximumTrackTintColor="rgba(255,255,255,0.1)"
        thumbTintColor="#ffffff"
      />

      <View style={styles.scale}>
        <Text style={styles.scaleText}>1x</Text>
        <Text style={styles.scaleText}>100x</Text>
        <Text style={styles.scaleText}>200x</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    color: "#4d8eff",
    fontSize: 16,
    fontWeight: "800",
    textShadowColor: "rgba(77,142,255,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  scale: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  scaleText: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "600",
  },
});
