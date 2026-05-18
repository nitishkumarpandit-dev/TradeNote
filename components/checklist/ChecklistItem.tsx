// components/checklist/ChecklistItem.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChecklistItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  disabled?: boolean;
}

export function ChecklistItem({ id, title, completed, onToggle, onEdit, disabled }: ChecklistItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        completed && styles.containerActive,
        disabled && styles.containerDisabled
      ]}
      onPress={() => !disabled && onToggle(id)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkbox, completed && styles.checkboxActive]}>
        {completed && <MaterialIcons name="check" size={16} color="#ffffff" />}
      </View>

      <Text style={[styles.title, completed && styles.titleActive]}>
        {title}
      </Text>

      {onEdit && (
        <TouchableOpacity
          onPress={() => onEdit(id)}
          style={styles.editBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="edit" size={16} color="#8c909f" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  containerActive: {
    backgroundColor: "rgba(77, 142, 255, 0.08)",
    borderColor: "rgba(77, 142, 255, 0.2)",
  },
  containerDisabled: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  checkboxActive: {
    backgroundColor: "#4d8eff",
    borderColor: "#4d8eff",
  },
  title: {
    flex: 1,
    color: "#dfe2eb",
    fontSize: 14,
    fontWeight: "700",
  },
  titleActive: {
    color: "#ffffff",
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
