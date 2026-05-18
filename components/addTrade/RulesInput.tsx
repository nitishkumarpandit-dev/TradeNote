// components/addTrade/RulesInput.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RulesInputProps {
  rules: string[];
  onAdd: (rule: string) => void;
  onRemove: (index: number) => void;
}

export function RulesInput({
  rules,
  onRemove,
  error,
}: Omit<RulesInputProps, "onAdd"> & { error?: boolean }) {
  return (
    <View
      style={[
        styles.container,
        error && {
          borderColor: "#ff5451",
          backgroundColor: "rgba(255,84,81,0.05)",
        },
      ]}
    >
      {/* Existing tags */}
      {rules.length > 0 ? (
        <View style={styles.tagsRow}>
          {rules.map((rule, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{rule}</Text>
              <TouchableOpacity
                onPress={() => onRemove(i)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <MaterialIcons name="close" size={13} color="#8c909f" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No rules selected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c2026",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
    padding: 12,
    minHeight: 50,
    justifyContent: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#262a31",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    color: "#dfe2eb",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyText: {
    color: "rgba(140,144,159,0.5)",
    fontSize: 13,
    textAlign: "center",
  },
});
