// components/settings/SettingsBottomSheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "../../hooks/useSettings";
import { BrokerPicker } from "./BrokerPicker";
import { SettingsRow } from "./SettingsRow";
import { SettingsSection } from "./SettingsSection";

interface SettingsBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

export function SettingsBottomSheet({
  bottomSheetRef,
}: SettingsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { settings, update, loading } = useSettings();

  // Sheet snaps: 85% of screen height
  const snapPoints = useMemo(() => ["85%"], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Backdrop with blur-like dim
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.65}
        pressBehavior="close"
      />
    ),
    [],
  );

  if (loading) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.handle}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Advanced Settings</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={24} color="#dfe2eb" />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ── */}
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Trade Settings ── */}
        <SettingsSection label="" style={styles.sectionFirst}>
          <SettingsRow
            title="Trade Time Input"
            subtitle="Configure custom trade entry and exit times"
            icon="clock-outline"
            iconType="community"
            value={settings.tradeTimeInput}
            onChange={(v) => update("tradeTimeInput", v)}
          />
          <SettingsRow
            title="Trade Margin"
            subtitle="Set and manage margin usage for trades"
            icon="scale-balance"
            iconType="community"
            value={settings.tradeMargin}
            onChange={(v) => update("tradeMargin", v)}
            isLast
          />
        </SettingsSection>

        {/* ── Brokerage ── */}
        <SettingsSection label="" style={styles.sectionGap}>
          <SettingsRow
            title="Enable Brokerage"
            subtitle="Calculate charges based on broker selection"
            icon="file-document-outline"
            iconType="community"
            value={settings.brokerageEnabled}
            onChange={(v) => update("brokerageEnabled", v)}
            isLast={!settings.brokerageEnabled}
          />
          {/* Broker picker — inside same card, below the toggle */}
          {settings.brokerageEnabled && (
            <View style={styles.brokerPickerWrap}>
              <BrokerPicker
                value={settings.selectedBroker}
                onChange={(v) => update("selectedBroker", v)}
                disabled={!settings.brokerageEnabled}
              />
            </View>
          )}
        </SettingsSection>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#161b22",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    paddingTop: 8,
    paddingBottom: 0,
  },
  handleIndicator: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 36,
    height: 4,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    color: "#8c909f",
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 0,
  },
  sectionFirst: {
    marginTop: 10,
  },
  sectionGap: {
    marginTop: 16,
  },

  // ── Broker picker spacer ──
  brokerPickerWrap: {
    paddingBottom: 16,
    paddingTop: 4,
  },
});
