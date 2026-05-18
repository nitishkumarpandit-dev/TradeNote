// components/profile/LogoutButton.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>SETTINGS</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <MaterialIcons name="logout" size={22} color="#ff5451" />
          <Text style={styles.text}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: "#8c909f",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  text: {
    color: "#ff5451",
    fontSize: 15,
    fontWeight: "700",
  },
});
