// components/FormInput.tsx

import { COLORS } from "@/constants/auth";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName: MaterialIconName;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  returnKeyType?: "done" | "next" | "go" | "search" | "send";
  onSubmitEditing?: () => void;
  style?: ViewStyle;
  inputRef?: React.RefObject<TextInput>;
  error?: string | null;
}

export default function FormInput({
  placeholder,
  value,
  onChangeText,
  iconName,
  secureTextEntry = false,
  showToggle = false,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType,
  onSubmitEditing,
  style,
  inputRef,
  error,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.wrapper}>
        {/* Left icon */}
        <View style={styles.iconLeft} pointerEvents="none">
          <MaterialIcons
            name={iconName}
            size={20}
            color={error ? COLORS.primaryBlue : isFocused ? COLORS.primaryBlue : COLORS.textHint}
            style={styles.iconTransition}
          />
        </View>

      {/* Text input */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          showToggle && styles.inputWithToggle,
          !!error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(140, 144, 159, 0.5)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        keyboardType={keyboardType as KeyboardTypeOptions}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={COLORS.primaryBlue}
      />

      {/* Right eye toggle (password only) */}
      {showToggle && (
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => setIsSecure((prev) => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={isSecure ? "visibility" : "visibility-off"}
            size={20}
            color={COLORS.textHint}
          />
        </TouchableOpacity>
      )}
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={14} color="#ff5451" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  wrapper: {
    position: "relative",
    width: "100%",
  },
  iconLeft: {
    position: "absolute",
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  iconRight: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  iconTransition: {
    // Icon color transition is handled via re-render on focus state change
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingLeft: 48,
    paddingRight: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "400",
  },
  inputFocused: {
    borderColor: COLORS.primaryBlue,
    shadowColor: COLORS.primaryBlue,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  inputError: {
    borderColor: "#ff5451",
    backgroundColor: "rgba(255, 84, 81, 0.04)",
  },
  inputWithToggle: {
    paddingRight: 48,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
    gap: 6,
  },
  errorText: {
    color: "#ff5451",
    fontSize: 12,
    fontWeight: "500",
  },
});
