// components/checklist/NotesInput.tsx

import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface NotesInputProps {
  value: string;
  onChange: (text: string) => void;
  editable?: boolean;
}

export function NotesInput({ value, onChange, editable = true }: NotesInputProps) {
  return (
    <View style={[styles.container, !editable && styles.containerDisabled]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="How did you feel today? Any mistakes? What did you learn?"
        placeholderTextColor="#8c909f"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginTop: 16,
    marginBottom: 100,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  input: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    minHeight: 120,
    lineHeight: 20,
  
  },
});
