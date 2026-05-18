// components/addTrade/GeneralTab.tsx

import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSettings } from "@/hooks/useSettings";
import {
  MARKET_TYPES,
  TradeDirection,
  TradeDuration,
  TradeFormData,
  TradeOutcome,
} from "../../types/trade";
import { LeverageSlider } from "./LeverageSlider";
import { PhotoUpload } from "./PhotoUpload";
import { PriceGrid } from "./PriceGrid";
import { RulesInput } from "./RulesInput";
import { SectionLabel } from "./SectionLabel";
import { SegmentToggle } from "./SegmentToggle";
import { TradeInput } from "./TradeInput";

interface GeneralTabProps {
  form: TradeFormData;
  computed: {
    totalAmount: string;
    pnlAmount: string;
    pnlPercent: string;
    isPnlPositive: boolean;
    charges: string;
  };
  update: <K extends keyof TradeFormData>(
    key: K,
    val: TradeFormData[K],
  ) => void;
  addRule: (r: string) => void;
  removeRule: (i: number) => void;
  errors?: Partial<Record<keyof TradeFormData, boolean>>;
}

// ── Market picker modal ────────────────────────────────────────────────────────
function MarketPicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerTrigger,
          error && {
            borderColor: "#ff5451",
            backgroundColor: "rgba(255,84,81,0.05)",
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.pickerValue}>{value}</Text>
        <MaterialIcons name="expand-more" size={20} color="#8c909f" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            {MARKET_TYPES.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.modalOption,
                  m === value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onChange(m);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    m === value && styles.modalOptionTextActive,
                  ]}
                >
                  {m}
                </Text>
                {m === value && (
                  <MaterialIcons name="check" size={16} color="#4d8eff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ── Generic dropdown picker ───────────────────────────────────────────────────
function DropdownPicker({
  value,
  options,
  placeholder,
  onChange,
  error,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerTrigger,
          error && {
            borderColor: "#ff5451",
            backgroundColor: "rgba(255,84,81,0.05)",
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.pickerValue : styles.datePlaceholder}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="expand-more" size={20} color="#8c909f" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  opt === value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    opt === value && styles.modalOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
                {opt === value && (
                  <MaterialIcons name="check" size={16} color="#4d8eff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}


// ── Outcome chips ──────────────────────────────────────────────────────────────
const OUTCOMES: {
  label: string;
  value: TradeOutcome;
  color: string;
  bg: string;
}[] = [
  { label: "Profitable", value: "PROFITABLE", color: "#004d38", bg: "#01c896" },
  { label: "Break Even", value: "BREAK_EVEN", color: "#c2c6d6", bg: "#262a31" },
  { label: "Loss", value: "LOSS", color: "#690005", bg: "#ff5451" },
];

// ── Main component ─────────────────────────────────────────────────────────────
import { useStrategies } from "@/hooks/useStrategies";
import { useRules } from "@/hooks/useRules";


const DEFAULT_STRATEGIES = [
  "Breakout Trading",
  "Trend Following",
  "Mean Reversion",
  "Scalping",
  "Position Trading",
];

const DEFAULT_RULES = [
  "Risk Managed",
  "Trend Alignment",
  "No FOMO",
  "Discipline",
  "Patience",
];

export function GeneralTab({
  form,
  computed,
  update,
  addRule,
  removeRule,
  errors = {},
}: GeneralTabProps) {
  const { settings, update: updateSettings } = useSettings();
  const { activeStrategies } = useStrategies();
  const { rules } = useRules();
  
  const STRATEGIES = Array.from(new Set([...DEFAULT_STRATEGIES, ...activeStrategies.map((s: any) => s.name)]));
  const RULES = Array.from(new Set([...DEFAULT_RULES, ...rules.filter((r: any) => r.isActive).map((r: any) => r.name)]));

  const [photos, setPhotos] = useState<string[]>([]);
  const [showEntryDatePicker, setShowEntryDatePicker] = useState(false);
  const [showExitDatePicker, setShowExitDatePicker] = useState(false);

  const selectedEntryDate = form.entryDate
    ? new Date(form.entryDate)
    : new Date();
  const selectedExitDate = form.exitDate ? new Date(form.exitDate) : new Date();

  const isUSD = form.marketType === "Forex" || form.marketType === "Crypto";
  const currencySymbol = isUSD ? "$" : "₹";

  const getSymbolPlaceholder = () => {
    switch (form.marketType) {
      case "Forex":
        return "e.g. EURUSD";
      case "Crypto":
        return "e.g. BTCUSDT";
      default:
        return "e.g. RELIANCE";
    }
  };

  const symbolPlaceholder = getSymbolPlaceholder();

  return (
    <View style={styles.container}>
      {/* ── Trade Duration ── */}
      <View style={styles.section}>
        <SectionLabel label="Trade Duration" required />
        <SegmentToggle
          options={[
            { label: "Intraday", value: "INTRADAY" },
            { label: "Swing", value: "SWING" },
          ]}
          value={form.duration}
          onChange={(v) => update("duration", v as TradeDuration)}
        />
      </View>

      {/* ── Market Type ── */}
      <View style={styles.section}>
        <SectionLabel label="Market Type" required />
        <MarketPicker
          value={form.marketType}
          onChange={(v) => update("marketType", v)}
          error={errors.marketType}
        />
      </View>

      {/* ── Symbol ── */}
      <View style={styles.section}>
        <SectionLabel label="Symbol" required />
        <TradeInput
          value={form.symbol}
          onChangeText={(v) => update("symbol", v)}
          placeholder={symbolPlaceholder}
          autoCapitalize="characters"
          error={errors.symbol}
        />
      </View>

      {/* ── Dates ── */}
      <View style={[styles.section, styles.row]}>
        <View style={styles.halfCol}>
          <SectionLabel label="Entry Date" required />
          <TouchableOpacity
            style={[
              styles.dateTrigger,
              errors.entryDate && {
                borderColor: "#ff5451",
                backgroundColor: "rgba(255,84,81,0.05)",
              },
            ]}
            onPress={() => setShowEntryDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text
              style={form.entryDate ? styles.dateValue : styles.datePlaceholder}
            >
              {form.entryDate || "dd/mm/yyyy"}
            </Text>
            <MaterialIcons name="calendar-today" size={16} color="#8c909f" />
          </TouchableOpacity>
          {showEntryDatePicker && (
            <DateTimePicker
              value={selectedEntryDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowEntryDatePicker(false);
                if (date) {
                  update("entryDate", date.toISOString().split("T")[0]);
                }
              }}
            />
          )}
        </View>

        {form.duration === "SWING" && (
          <View style={styles.halfCol}>
            <SectionLabel label="Exit Date" required={form.duration === "SWING"} />
            <TouchableOpacity
              style={[
                styles.dateTrigger,
                errors.exitDate && {
                  borderColor: "#ff5451",
                  backgroundColor: "rgba(255,84,81,0.05)",
                },
              ]}
              onPress={() => setShowExitDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={
                  form.exitDate ? styles.dateValue : styles.datePlaceholder
                }
              >
                {form.exitDate || "dd/mm/yyyy"}
              </Text>
              <MaterialIcons name="calendar-today" size={16} color="#8c909f" />
            </TouchableOpacity>
            {showExitDatePicker && (
              <DateTimePicker
                value={selectedExitDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, date) => {
                  setShowExitDatePicker(false);
                  if (date) {
                    update("exitDate", date.toISOString().split("T")[0]);
                  }
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* ── Price Grid ── */}
      <View style={styles.section}>
        <PriceGrid
          entryPrice={form.entryPrice}
          quantity={form.quantity}
          exitPrice={form.exitPrice}
          totalAmount={computed.totalAmount}
          pnlAmount={computed.pnlAmount}
          pnlPercent={computed.pnlPercent}
          isPnlPositive={computed.isPnlPositive}
          charges={computed.charges}
          onEntryChange={(v) => update("entryPrice", v)}
          onQtyChange={(v) => update("quantity", v)}
          onExitChange={(v) => update("exitPrice", v)}
          currencySymbol={currencySymbol}
          tradeTimeEnabled={settings.tradeTimeInput}
          entryTime={form.entryTime}
          exitTime={form.exitTime}
          onEntryTimeChange={(v) => update("entryTime", v)}
          onExitTimeChange={(v) => update("exitTime", v)}
          isManualCharges={settings.selectedBroker === "Enter Manually"}
          manualCharges={form.manualCharges}
          onManualChargesChange={(v) => update("manualCharges", v)}
          errors={errors}
        />
      </View>

      {/* ── Trade Margin (Leverage) ── */}
      {settings.tradeMargin && (
        <View style={styles.section}>
          <SectionLabel label="Trade Margin (Leverage)" />
          <LeverageSlider
            value={form.leverage}
            onChange={(v) => {
              update("leverage", v);
              updateSettings("defaultLeverage", v);
            }}
          />
        </View>
      )}

      {/* ── Trade Direction ── */}
      <View style={styles.section}>
        <SectionLabel label="Trade Direction" />
        <SegmentToggle
          options={[
            {
              label: "Long",
              value: "LONG",
              icon: "trending-up",
              activeColor: "#43e5b1",
              activeBg: "rgba(1,200,150,0.12)",
            },
            {
              label: "Short",
              value: "SHORT",
              icon: "trending-down",
              activeColor: "#ff5451",
              activeBg: "rgba(255,84,81,0.1)",
            },
          ]}
          value={form.direction}
          onChange={(v) => update("direction", v as TradeDirection)}
        />
      </View>

      {/* ── Stop Loss + Target ── */}
      <View style={[styles.section, styles.row]}>
        <View style={styles.halfCol}>
          <SectionLabel label="Stop Loss" />
          <TradeInput
            value={form.stopLoss}
            onChangeText={(v) => update("stopLoss", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            badge="SL"
            badgeColor="#ff5451"
            error={errors.stopLoss}
          />
        </View>
        <View style={styles.halfCol}>
          <SectionLabel label="Target" />
          <TradeInput
            value={form.target}
            onChangeText={(v) => update("target", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            badge="TGT"
            badgeColor="#43e5b1"
            error={errors.target}
          />
        </View>
      </View>

      {/* ── Strategy ── */}
      <View style={styles.section}>
        <SectionLabel label="Strategy" required />
        <DropdownPicker
          value={form.strategy}
          options={STRATEGIES}
          placeholder="Select Strategy"
          onChange={(v) => update("strategy", v)}
          error={errors.strategy}
        />
      </View>

      {/* Outcome is calculated automatically in the background based on PnL */}


      {/* ── Trade Analysis ── */}
      <View style={styles.section}>
        <SectionLabel label="Trade Analysis" />
        <TextInput
          value={form.analysis}
          onChangeText={(v) => update("analysis", v)}
          placeholder="Describe the market context, entry reasoning, and trade management..."
          placeholderTextColor="rgba(194,198,214,0.3)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textarea}
          selectionColor="#4d8eff"
        />
      </View>

      {/* ── Rules Followed ── */}
      <View style={styles.section}>
        <SectionLabel label="Rules Followed" required />
        <DropdownPicker
          value=""
          options={RULES}
          placeholder="Add Rule"
          onChange={(v) => {
            if (!form.rules.includes(v)) {
              addRule(v);
            }
          }}
          error={errors.rules}
        />
        <View style={{ marginTop: 12 }}>
          <RulesInput
            rules={form.rules}
            onRemove={removeRule}
            error={errors.rules}
          />
        </View>
      </View>

      {/* ── Trade Screenshots ── */}
      <View style={styles.section}>
        <SectionLabel label="Trade Screenshots" />
        <PhotoUpload
          photos={photos}
          onAdd={() => {
            // TODO: integrate expo-image-picker
            console.log("Pick image");
          }}
          onRemove={(i) =>
            setPhotos((prev) => prev.filter((_, idx) => idx !== i))
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  section: { gap: 0 },
  row: { flexDirection: "row", gap: 12 },
  halfCol: { flex: 1, gap: 0 },

  // Market picker
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1c2026",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
  },
  pickerValue: { color: "#dfe2eb", fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  modalOptionActive: { backgroundColor: "rgba(77,142,255,0.08)" },
  modalOptionText: { color: "#8c909f", fontSize: 14 },
  modalOptionTextActive: { color: "#4d8eff", fontWeight: "600" },

  // Date
  dateTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1c2026",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
  },
  dateValue: { color: "#dfe2eb", fontSize: 13 },
  datePlaceholder: { color: "rgba(194,198,214,0.35)", fontSize: 13 },

  // Search input
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c2026",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#dfe2eb",
    fontSize: 14,
    padding: 0,
  },

  // Outcome chips
  chipsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: "500" },

  // Textarea
  textarea: {
    backgroundColor: "#1c2026",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#dfe2eb",
    fontSize: 13,
    lineHeight: 20,
    minHeight: 110,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
  },
});
