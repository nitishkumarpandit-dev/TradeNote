// components/profile/InfoCard.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "../../types/profile";

interface InfoCardProps {
  user: User;
}

export function InfoCard({ user }: InfoCardProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {user.email}
          </Text>
        </View>
      </View>
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
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  label: {
    color: "#c2c6d6",
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginHorizontal: 16,
  },
});
