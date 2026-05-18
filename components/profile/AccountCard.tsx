// components/profile/AccountCard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { User } from "../../types/profile";

interface AccountCardProps {
  user: User;
  onUpgrade: () => void;
}

export function AccountCard({ user, onUpgrade }: AccountCardProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>
      <View style={styles.card}>
        {/* Glow effect overlay */}
        <View style={styles.glow} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>{user.memberSince}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Subscription Status</Text>
            <View style={styles.statusWrap}>
              <Text style={styles.planText}>{user.plan}</Text>
              <Text style={styles.limitText}>
                Up to {user.tradesPerMonthLimit} trades/month
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={onUpgrade}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#43e5b1", "#01c896"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <MaterialIcons
                name="workspace-premium"
                size={20}
                color="#003828"
              />
              <Text style={styles.upgradeText}>Upgrade Plan</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(67, 229, 177, 0.15)",
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(67, 229, 177, 0.08)",
    // blur would be better but requires expo-blur or similar
  },
  content: {
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  },
  statusWrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  planText: {
    color: "#43e5b1",
    fontSize: 14,
    fontWeight: "700",
  },
  limitText: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "500",
  },
  upgradeBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  upgradeText: {
    color: "#003828",
    fontSize: 15,
    fontWeight: "800",
  },
});
