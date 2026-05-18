// components/addTrade/MistakesGrid.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMistakes } from "@/hooks/useMistakes";
import { MISTAKES_LIST as DEFAULT_MISTAKES } from "../../types/trade";

interface MistakesGridProps {
  selected: string[];
  onToggle: (mistake: string) => void;
  onClear: () => void;
}

export function MistakesGrid({
  selected,
  onToggle,
  onClear,
}: MistakesGridProps) {
  const { mistakes } = useMistakes();
  const MISTAKES_LIST = Array.from(new Set([...DEFAULT_MISTAKES, ...mistakes.map((m: any) => m.name)]));
  const noMistakes = selected.length === 0;

  if (MISTAKES_LIST.length === 0) {
    return (
      <View style={[styles.container, { alignItems: "center", paddingVertical: 20 }]}>
        <Text style={{ color: "#8c909f", fontSize: 13 }}>
          No custom mistakes defined yet. Add them in the Mistakes tab.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 2-col grid */}
      <View style={styles.grid}>
        {MISTAKES_LIST.map((mistake) => {
          const checked = selected.includes(mistake);
          return (
            <TouchableOpacity
              key={mistake}
              style={[styles.item, checked && styles.itemChecked]}
              onPress={() => onToggle(mistake)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, checked && styles.checkboxChecked]}
              >
                {checked && (
                  <MaterialIcons name="check" size={11} color="#fff" />
                )}
              </View>
              <Text
                style={[styles.itemText, checked && styles.itemTextChecked]}
              >
                {mistake}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* No mistakes button */}
      <TouchableOpacity
        style={[styles.noMistakesBtn, noMistakes && styles.noMistakesBtnActive]}
        onPress={onClear}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name="check-circle"
          size={20}
          color={noMistakes ? "#43e5b1" : "#424754"}
        />
        <Text
          style={[
            styles.noMistakesText,
            noMistakes && styles.noMistakesTextActive,
          ]}
        >
          NO MISTAKES MADE
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  item: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#181c22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.25)",
  },
  itemChecked: {
    borderColor: "rgba(255,84,81,0.4)",
    backgroundColor: "rgba(255,84,81,0.06)",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#424754",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#ff5451",
    borderColor: "#ff5451",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8c909f",
    flex: 1,
  },
  itemTextChecked: {
    color: "#dfe2eb",
  },
  noMistakesBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#424754",
    backgroundColor: "transparent",
  },
  noMistakesBtnActive: {
    borderColor: "rgba(67,229,177,0.5)",
    backgroundColor: "rgba(67,229,177,0.05)",
  },
  noMistakesText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#424754",
    textTransform: "uppercase",
  },
  noMistakesTextActive: {
    color: "#43e5b1",
  },
});
