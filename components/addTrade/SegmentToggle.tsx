// components/addTrade/SegmentToggle.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Option {
  label: string;
  value: string;
  icon?: string;
  activeColor?: string;
  activeBg?: string;
}

interface SegmentToggleProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  style?: ViewStyle;
}

export function SegmentToggle({
  options,
  value,
  onChange,
  style,
}: SegmentToggleProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        const activeColor = opt.activeColor ?? "#dfe2eb";
        const activeBg = opt.activeBg ?? "#31353c";

        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.option,
              isActive
                ? { backgroundColor: activeBg, borderColor: activeColor + "40" }
                : styles.optionInactive,
            ]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            {opt.icon && (
              <MaterialIcons
                name={opt.icon as any}
                size={16}
                color={isActive ? activeColor : "#8c909f"}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: isActive ? activeColor : "#8c909f" },
                isActive && styles.labelActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1c2026",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionInactive: {
    borderColor: "transparent",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  labelActive: {
    fontWeight: "700",
  },
});
