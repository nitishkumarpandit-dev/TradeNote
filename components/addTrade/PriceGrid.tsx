// components/addTrade/PriceGrid.tsx

import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DisplayField } from "./DisplayField";
import { TradeInput } from "./TradeInput";

interface PriceGridProps {
  entryPrice: string;
  quantity: string;
  exitPrice: string;
  totalAmount: string;
  pnlAmount: string;
  pnlPercent: string;
  isPnlPositive: boolean;
  charges: string;
  onEntryChange: (v: string) => void;
  onQtyChange: (v: string) => void;
  onExitChange: (v: string) => void;
  showExitPrice?: boolean;
  currencySymbol?: string;
  tradeTimeEnabled?: boolean;
  entryTime?: string;
  exitTime?: string;
  onEntryTimeChange?: (v: string) => void;
  onExitTimeChange?: (v: string) => void;
  isManualCharges?: boolean;
  manualCharges?: string;
  onManualChargesChange?: (v: string) => void;
  errors?: {
    entryPrice?: boolean;
    quantity?: boolean;
    exitPrice?: boolean;
    entryTime?: boolean;
    exitTime?: boolean;
    manualCharges?: boolean;
  };
}

interface GridCellProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: any;
}

function GridCell({ label, required, children, style }: GridCellProps) {
  return (
    <View style={[styles.cell, style]}>
      <Text style={styles.cellLabel}>
        {label}{required && <Text style={{ color: "#ff5451" }}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

export function PriceGrid({
  entryPrice,
  quantity,
  exitPrice,
  totalAmount,
  pnlAmount,
  pnlPercent,
  isPnlPositive,
  charges,
  onEntryChange,
  onQtyChange,
  onExitChange,
  currencySymbol = "₹",
  tradeTimeEnabled = false,
  entryTime = "",
  exitTime = "",
  onEntryTimeChange,
  onExitTimeChange,
  isManualCharges = false,
  manualCharges = "",
  onManualChargesChange,
  errors = {},
}: PriceGridProps) {
  const [showEntryTime, setShowEntryTime] = useState(false);
  const [showExitTime, setShowExitTime] = useState(false);

  const pnlColor = isPnlPositive ? "#43e5b1" : "#ff5451";
  const pnlPrefix = isPnlPositive ? "+" : "";

  const parseTime = (timeStr: string) => {
    const d = new Date();
    if (timeStr) {
      const [h, m] = timeStr.split(":");
      d.setHours(parseInt(h), parseInt(m));
    }
    return d;
  };

  const renderTimeInput = (
    value: string,
    onPress: () => void,
    error?: boolean,
    placeholder: string = "--:--",
  ) => (
    <TouchableOpacity
      style={[
        styles.timeTrigger,
        error && {
          borderColor: "#ff5451",
          backgroundColor: "rgba(255,84,81,0.05)",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={value ? styles.timeValue : styles.timePlaceholder}>
        {value || placeholder}
      </Text>
      <MaterialIcons name="access-time" size={14} color="#8c909f" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        {/* Row 1: Entry Price + (Entry Time if enabled or Exit Price if disabled) */}
        <GridCell label="ENTRY PRICE" required style={styles.cellHalf}>
          <TradeInput
            value={entryPrice}
            onChangeText={onEntryChange}
            placeholder="0.00"
            keyboardType="decimal-pad"
            compact
            error={errors.entryPrice}
          />
        </GridCell>

        {tradeTimeEnabled ? (
          <GridCell label="ENTRY TIME" required style={styles.cellHalf}>
            {renderTimeInput(
              entryTime,
              () => setShowEntryTime(true),
              errors.entryTime,
            )}
            {showEntryTime && (
              <DateTimePicker
                value={parseTime(entryTime)}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, date) => {
                  setShowEntryTime(false);
                  if (date && onEntryTimeChange) {
                    const h = date.getHours().toString().padStart(2, "0");
                    const m = date.getMinutes().toString().padStart(2, "0");
                    onEntryTimeChange(`${h}:${m}`);
                  }
                }}
              />
            )}
          </GridCell>
        ) : (
          <GridCell label="EXIT PRICE" required style={styles.cellHalf}>
            <TradeInput
              value={exitPrice}
              onChangeText={onExitChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              compact
              error={errors.exitPrice}
            />
          </GridCell>
        )}

        {/* Row 2: Exit Price + Exit Time (if enabled) OR Quantity + Total Amount (if time disabled) */}
        {tradeTimeEnabled && (
          <>
            <GridCell label="EXIT PRICE" required style={styles.cellHalf}>
              <TradeInput
                value={exitPrice}
                onChangeText={onExitChange}
                placeholder="0.00"
                keyboardType="decimal-pad"
                compact
                error={errors.exitPrice}
              />
            </GridCell>

            <GridCell label="EXIT TIME" required style={styles.cellHalf}>
              {renderTimeInput(
                exitTime,
                () => setShowExitTime(true),
                errors.exitTime,
              )}
              {showExitTime && (
                <DateTimePicker
                  value={parseTime(exitTime)}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, date) => {
                    setShowExitTime(false);
                    if (date && onExitTimeChange) {
                      const h = date.getHours().toString().padStart(2, "0");
                      const m = date.getMinutes().toString().padStart(2, "0");
                      onExitTimeChange(`${h}:${m}`);
                    }
                  }}
                />
              )}
            </GridCell>
          </>
        )}

        {/* Row 3 (or 2 if time disabled): Quantity + Total Amount */}
        <GridCell label="QUANTITY" required style={styles.cellHalf}>
          <TradeInput
            value={quantity}
            onChangeText={onQtyChange}
            placeholder="0"
            keyboardType="number-pad"
            compact
            error={errors.quantity}
          />
        </GridCell>

        <GridCell label="TOTAL AMOUNT" style={styles.cellHalf}>
          <DisplayField value={`${currencySymbol} ${totalAmount}`} compact />
        </GridCell>

        {/* Row 4 (or 3 if time disabled): P&L Amount + P&L (%) */}
        <GridCell label="P&L AMOUNT" style={styles.cellHalf}>
          <DisplayField
            value={`${pnlPrefix}${currencySymbol} ${pnlAmount}`}
            color={pnlColor}
            compact
          />
        </GridCell>

        <GridCell label="P&L (%)" style={styles.cellHalf}>
          <DisplayField
            value={`${pnlPrefix}${pnlPercent}%`}
            color={pnlColor}
            compact
          />
        </GridCell>

        {(isManualCharges || parseFloat(charges) > 0) && (
          <GridCell label="EST. CHARGES" style={styles.cellHalf}>
            {isManualCharges ? (
              <TradeInput
                value={manualCharges}
                onChangeText={onManualChargesChange!}
                placeholder="0.00"
                keyboardType="decimal-pad"
                compact
                error={errors.manualCharges}
              />
            ) : (
              <DisplayField
                value={`${currencySymbol} ${charges}`}
                color="#8c909f"
                compact
              />
            )}
          </GridCell>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cell: {
    gap: 6,
  },
  cellHalf: {
    width: "47%",
  },
  cellThird: {
    width: "30.5%",
  },
  cellFull: {
    width: "100%",
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#c2c6d6",
  },
  timeTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f141a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
    height: 40,
  },
  timeValue: {
    color: "#dfe2eb",
    fontSize: 13,
  },
  timePlaceholder: {
    color: "rgba(194,198,214,0.35)",
    fontSize: 13,
  },
});
