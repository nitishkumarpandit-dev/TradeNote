// components/settings/SettingsToggle.tsx

import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SettingsToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const TRACK_W = 50;
const TRACK_H = 28;
const THUMB_SIZE = 22;
const THUMB_TRAVEL = TRACK_W - THUMB_SIZE - 6;

export function SettingsToggle({
  value,
  onChange,
  disabled = false,
  style,
}: SettingsToggleProps) {
  const translateX = useRef(
    new Animated.Value(value ? THUMB_TRAVEL : 2),
  ).current;
  const trackColor = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? THUMB_TRAVEL : 2,
        useNativeDriver: true,
        friction: 7,
        tension: 100,
      }),
      Animated.timing(trackColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bgColor = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#31353c", "#4d8eff"],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={[styles.wrapper, disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, { backgroundColor: bgColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              opacity: disabled ? 0.4 : 1,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.45,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
