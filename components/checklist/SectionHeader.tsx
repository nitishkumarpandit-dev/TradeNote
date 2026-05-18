// components/checklist/SectionHeader.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  emoji: string;
  onAdd?: () => void;
}

export function SectionHeader({ title, emoji, onAdd }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      {onAdd && (
        <TouchableOpacity
          onPress={onAdd}
          style={styles.addButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="add" size={20} color="#43e5b1" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 24,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 20,
    marginRight: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: "rgba(67, 229, 177, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
});
