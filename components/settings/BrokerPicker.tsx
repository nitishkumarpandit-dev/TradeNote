// components/settings/BrokerPicker.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BROKER_OPTIONS, BrokerOption } from "../../types/settings";

interface BrokerPickerProps {
  value: BrokerOption;
  onChange: (broker: BrokerOption) => void;
  disabled?: boolean;
}

export function BrokerPicker({
  value,
  onChange,
  disabled = false,
}: BrokerPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={styles.triggerText}>{value}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#8c909f" />
      </TouchableOpacity>

      {/* Helper text */}
      {value === "Calculate from Broker" && (
        <Text style={styles.helperText}>
          Charges may vary slightly depending on the broker and can be adjusted
          manually if needed.
        </Text>
      )}

      {/* Picker Modal */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Broker</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialIcons name="close" size={20} color="#8c909f" />
              </TouchableOpacity>
            </View>

            {/* Options */}
            {BROKER_OPTIONS.map((broker, i) => {
              const isActive = broker === value;
              const isLast = i === BROKER_OPTIONS.length - 1;
              return (
                <TouchableOpacity
                  key={broker}
                  style={[
                    styles.option,
                    isActive && styles.optionActive,
                    !isLast && styles.optionBorder,
                  ]}
                  onPress={() => {
                    onChange(broker);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    {/* Broker icon placeholder */}
                    <View
                      style={[
                        styles.optionDot,
                        isActive && styles.optionDotActive,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isActive && styles.optionTextActive,
                      ]}
                    >
                      {broker}
                    </Text>
                  </View>
                  {isActive && (
                    <MaterialIcons name="check" size={18} color="#4d8eff" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No horizontal padding, handled by parent card
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0a0e14",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  triggerDisabled: {
    opacity: 0.4,
  },
  triggerText: {
    color: "#dfe2eb",
    fontSize: 14,
    fontWeight: "500",
  },
  helperText: {
    color: "#ff5451",
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
    opacity: 0.9,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  modalTitle: {
    color: "#dfe2eb",
    fontSize: 15,
    fontWeight: "700",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  optionActive: {
    backgroundColor: "rgba(77,142,255,0.07)",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#424754",
  },
  optionDotActive: {
    backgroundColor: "#4d8eff",
  },
  optionText: {
    color: "#8c909f",
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextActive: {
    color: "#dfe2eb",
    fontWeight: "600",
  },
});
