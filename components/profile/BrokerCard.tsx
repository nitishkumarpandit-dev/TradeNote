// components/profile/BrokerCard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Broker } from "../../types/profile";

interface BrokerCardProps {
  broker: Broker | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function BrokerCard({
  broker,
  onConnect,
  onDisconnect,
}: BrokerCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>BROKER CONNECTIONS</Text>
        {!broker?.isConnected && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onConnect}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={16} color="#43e5b1" />
            <Text style={styles.addBtnText}>Connect Broker</Text>
          </TouchableOpacity>
        )}
      </View>

      {broker?.isConnected ? (
        <View style={styles.card}>
          <View style={styles.brokerInfo}>
            <View style={styles.logoWrap}>
              <MaterialIcons name="account-balance" size={24} color="#43e5b1" />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.brokerName}>{broker.name}</Text>
              <Text style={styles.connectedDate}>
                Connected on {broker.connectedAt}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.disconnectBtn}
            onPress={onDisconnect}
            activeOpacity={0.7}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="link" size={28} color="#43e5b1" />
          </View>
          <View style={styles.emptyTextContent}>
            <Text style={styles.emptyText}>No Broker Connected</Text>
            <Text style={styles.emptySub}>
              Connect your account to auto-sync trades
            </Text>
          </View>
          <TouchableOpacity
            style={styles.connectBtn}
            onPress={onConnect}
            activeOpacity={0.8}
          >
            <Text style={styles.connectBtnText}>Connect with broker</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionLabel: {
    color: "#8c909f",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addBtnText: {
    color: "#43e5b1",
    fontSize: 11,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  brokerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(67, 229, 177, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    gap: 2,
    flex: 1,
  },
  brokerName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  connectedDate: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "500",
  },
  disconnectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff5451",
  },
  disconnectText: {
    color: "#ff5451",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#1c2026",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 20,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(67, 229, 177, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(67, 229, 177, 0.1)",
  },
  emptyTextContent: {
    alignItems: "center",
    gap: 4,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySub: {
    color: "#8c909f",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  connectBtn: {
    backgroundColor: "#43e5b1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  connectBtnText: {
    color: "#10141a",
    fontSize: 14,
    fontWeight: "800",
  },
});
