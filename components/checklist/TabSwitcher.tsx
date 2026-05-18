// components/checklist/TabSwitcher.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabSwitcherProps {
  activeTab: "Checklist" | "Analysis";
  onChange: (tab: "Checklist" | "Analysis") => void;
}

export function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Checklist" && styles.activeTab]}
        onPress={() => onChange("Checklist")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === "Checklist" && styles.activeTabText]}>
          Checklist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "Analysis" && styles.activeTab]}
        onPress={() => onChange("Analysis")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === "Analysis" && styles.activeTabText]}>
          Analysis
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#0a0e14",
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#4d8eff",
    shadowColor: "#4d8eff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    color: "#8c909f",
    fontSize: 14,
    fontWeight: "800",
  },
  activeTabText: {
    color: "#ffffff",
  },
});
