// components/history/FilterChipsBar.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HistoryFilters } from "../../hooks/useHistory";
import { DIRECTION_OPTIONS, MARKET_OPTIONS, OUTCOME_OPTIONS, SORT_OPTIONS } from "../../types/history";

interface FilterChipsBarProps {
  filters: HistoryFilters;
  allStrategies: string[];
  onUpdate: <K extends keyof HistoryFilters>(
    key: K,
    value: HistoryFilters[K],
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

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

// ── Chip component ─────────────────────────────────────────────────────────────
function Chip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
        {label}
      </Text>
      <MaterialIcons
        name="expand-more"
        size={16}
        color={isActive ? "#dfe2eb" : "#8c909f"}
      />
    </TouchableOpacity>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function FilterChipsBar({
  filters,
  allStrategies,
  onUpdate,
  onReset,
  hasActiveFilters,
}: FilterChipsBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);
  const [directionOpen, setDirectionOpen] = useState(false);
  const [outcomeOpen, setOutcomeOpen] = useState(false);

  const strategyOptions = ["All Strategies", ...allStrategies];

  const marketLabel =
    filters.market === "All" ? "Market" : `Market: ${filters.market}`;
  const strategyLabel = !filters.strategy ? "Strategy" : filters.strategy;
  const directionLabel =
    filters.direction === "Both" ? "Direction" : filters.direction;
  const outcomeLabel =
    filters.outcome === "All Outcomes" ? "Outcome" : filters.outcome;
  const sortLabel = filters.sort;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bar}
      >
        {/* Sort chip */}
        <Chip
          label={sortLabel}
          isActive={filters.sort !== "Newest"}
          onPress={() => setSortOpen(true)}
        />

        {/* Market chip */}
        <Chip
          label={marketLabel}
          isActive={filters.market !== "All"}
          onPress={() => setMarketOpen(true)}
        />

        {/* Strategy chip */}
        <Chip
          label={strategyLabel}
          isActive={!!filters.strategy}
          onPress={() => setStrategyOpen(true)}
        />

        {/* Direction chip */}
        <Chip
          label={directionLabel}
          isActive={filters.direction !== "Both"}
          onPress={() => setDirectionOpen(true)}
        />

        {/* Outcome chip */}
        <Chip
          label={outcomeLabel}
          isActive={filters.outcome !== "All Outcomes"}
          onPress={() => setOutcomeOpen(true)}
        />

        {/* Clear filters chip — only when filters are active */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearChip}
            onPress={onReset}
            activeOpacity={0.8}
          >
            <MaterialIcons name="close" size={14} color="#ff5451" />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modals */}
      <PickerModal
        visible={sortOpen}
        title="Sort By"
        options={SORT_OPTIONS}
        selected={filters.sort}
        onSelect={(v) => onUpdate("sort", v)}
        onClose={() => setSortOpen(false)}
      />
      <PickerModal
        visible={marketOpen}
        title="Market"
        options={MARKET_OPTIONS}
        selected={filters.market}
        onSelect={(v) => onUpdate("market", v)}
        onClose={() => setMarketOpen(false)}
      />
      <PickerModal
        visible={strategyOpen}
        title="Strategy"
        options={strategyOptions}
        selected={filters.strategy || "All Strategies"}
        onSelect={(v) => {
          onUpdate("strategy", v === "All Strategies" ? "" : v);
        }}
        onClose={() => setStrategyOpen(false)}
      />
      <PickerModal
        visible={directionOpen}
        title="Direction"
        options={DIRECTION_OPTIONS}
        selected={filters.direction}
        onSelect={(v) => onUpdate("direction", v)}
        onClose={() => setDirectionOpen(false)}
      />
      <PickerModal
        visible={outcomeOpen}
        title="Outcome"
        options={OUTCOME_OPTIONS}
        selected={filters.outcome}
        onSelect={(v) => onUpdate("outcome", v)}
        onClose={() => setOutcomeOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1c2026",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.5)",
  },
  chipActive: {
    borderColor: "#4d8eff",
    backgroundColor: "rgba(77,142,255,0.1)",
  },
  chipText: { color: "#8c909f", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#dfe2eb" },
  clearChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,84,81,0.1)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,84,81,0.3)",
  },
  clearText: { color: "#ff5451", fontSize: 13, fontWeight: "700" },

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
