// components/profile/ProfileHeader.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <MaterialIcons name="edit" size={20} color="#4d8eff" />
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  editBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
