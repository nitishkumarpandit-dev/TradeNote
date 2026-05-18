// components/addTrade/TabToggle.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActiveTab } from "../../types/trade";

interface TabToggleProps {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

export function TabToggle({ active, onChange }: TabToggleProps) {
  return (
    <View style={styles.container}>
      {(["GENERAL", "PSYCHOLOGY"] as ActiveTab[]).map((tab) => {
        const isActive = active === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
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
    backgroundColor: "#181c22",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#00285d",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8c909f",
  },
  labelActive: {
    color: "#adc6ff",
    fontWeight: "700",
  },
});
