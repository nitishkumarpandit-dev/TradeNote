// components/addTrade/TradeInput.tsx

import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface TradeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  badge?: string;
  badgeColor?: string;
  compact?: boolean;
  readOnly?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: boolean;
}

export function TradeInput({
  value,
  onChangeText,
  placeholder = "",
  keyboardType = "default",
  badge,
  badgeColor = "#adc6ff",
  compact = false,
  readOnly = false,
  autoCapitalize = "none",
  error = false,
}: TradeInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.wrapper,
        compact ? styles.compact : styles.normal,
        focused && styles.focused,
        error && styles.error,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(194,198,214,0.35)"
        keyboardType={keyboardType}
        editable={!readOnly}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, badge ? styles.inputWithBadge : null]}
        selectionColor="#4d8eff"
      />
      {badge && (
        <Text style={[styles.badge, { color: badgeColor }]}>{badge}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#1c2026",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  normal: {
    paddingVertical: 12,
  },
  compact: {
    paddingVertical: 8,
  },
  focused: {
    borderColor: "#4d8eff",
  },
  error: {
    borderColor: "#ff5451",
  },
  input: {
    flex: 1,
    color: "#dfe2eb",
    fontSize: 14,
    padding: 0,
  },
  inputWithBadge: {
    paddingRight: 8,
  },
  badge: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
