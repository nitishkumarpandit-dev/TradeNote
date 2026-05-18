import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ── Generic picker modal ───────────────────────────────────────────────────────
function PickerModal<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={18} color="#8c909f" />
            </TouchableOpacity>
          </View>
          {options.map((opt, i) => {
            const isActive = opt === selected;
            const isLast = i === options.length - 1;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  isActive && styles.modalOptionActive,
                  !isLast && styles.modalOptionBorder,
                ]}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    isActive && styles.modalOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
                {isActive && (
                  <MaterialIcons name="check" size={16} color="#4d8eff" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const MARKET_OPTIONS = ['Crypto', 'Forex', 'Indian'];
const DURATION_OPTIONS = ['Last 30 Days', 'Last 90 Days', 'Last 1 Year'];

interface FilterBarProps {
  market: string;
  setMarket: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
}

const FilterBar = ({ market, setMarket, duration, setDuration }: FilterBarProps) => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={[styles.pill, market !== 'Indian' && styles.pillActive]} 
            onPress={() => setMarketOpen(true)}
          >
            <MaterialIcons name="public" size={16} color={market !== 'Indian' ? "#dfe2eb" : "#adc6ff"} style={styles.iconLeft} />
            <Text style={[styles.pillText, market !== 'Indian' && styles.pillTextActive]}>
              {market === 'Indian' ? 'Indian Market' : `Market: ${market}`}
            </Text>
            <MaterialIcons name="expand-more" size={16} color={market !== 'Indian' ? "#dfe2eb" : "#8c909f"} style={styles.iconRight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pill, duration !== 'Last 30 Days' && styles.pillActive]} 
            onPress={() => setDurationOpen(true)}
          >
            <MaterialIcons name="calendar-today" size={16} color={duration !== 'Last 30 Days' ? "#dfe2eb" : "#adc6ff"} style={styles.iconLeft} />
            <Text style={[styles.pillText, duration !== 'Last 30 Days' && styles.pillTextActive]}>
              {duration}
            </Text>
            <MaterialIcons name="expand-more" size={16} color={duration !== 'Last 30 Days' ? "#dfe2eb" : "#8c909f"} style={styles.iconRight} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <PickerModal
        visible={marketOpen}
        title="Market Type"
        options={MARKET_OPTIONS}
        selected={market}
        onSelect={setMarket}
        onClose={() => setMarketOpen(false)}
      />
      
      <PickerModal
        visible={durationOpen}
        title="Duration"
        options={DURATION_OPTIONS}
        selected={duration}
        onSelect={setDuration}
        onClose={() => setDurationOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10141a',
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2026',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(66,71,84,0.5)',
  },
  pillActive: {
    borderColor: "#4d8eff",
    backgroundColor: "rgba(77,142,255,0.1)",
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  pillText: {
    color: '#8c909f',
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: "#dfe2eb"
  },
  
  // Modal Styles
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  modalTitle: { color: "#dfe2eb", fontSize: 14, fontWeight: "700" },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  modalOptionActive: { backgroundColor: "rgba(77,142,255,0.07)" },
  modalOptionText: { color: "#8c909f", fontSize: 14 },
  modalOptionTextActive: { color: "#4d8eff", fontWeight: "600" },
});

export default FilterBar;
