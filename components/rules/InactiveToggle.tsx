// components/rules/InactiveToggle.tsx

import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InactiveToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

const THUMB_TRAVEL = 20;

export function InactiveToggle({ value, onChange }: InactiveToggleProps) {
  const translateX = useRef(
    new Animated.Value(value ? THUMB_TRAVEL : 2),
  ).current;
  const bgColor = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? THUMB_TRAVEL : 2,
        useNativeDriver: true,
        friction: 7,
        tension: 120,
      }),
      Animated.timing(bgColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#31353c", "#4d8eff"],
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Show Inactive Rules</Text>
      <TouchableOpacity onPress={() => onChange(!value)} activeOpacity={0.85}>
        <Animated.View style={[styles.track, { backgroundColor: bg }]}>
          <Animated.View
            style={[styles.thumb, { transform: [{ translateX }] }]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "#c2c6d6",
    fontSize: 13,
    fontWeight: "600",
  },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});
