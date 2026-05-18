// components/strategy/AddStrategySheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INITIAL_STRATEGY_FORM, Strategy, StrategyFormData } from "../../types/strategy";

interface EditStrategySheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  strategy: Strategy | null;
  onEdit: (id: string, form: StrategyFormData) => void;
}

export function EditStrategySheet({
  bottomSheetRef,
  strategy,
  onEdit,
}: EditStrategySheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["72%"], []);
  const [form, setForm] = useState<StrategyFormData>(INITIAL_STRATEGY_FORM);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  React.useEffect(() => {
    if (strategy) {
      setForm({ name: strategy.name, description: strategy.description });
    } else {
      setForm(INITIAL_STRATEGY_FORM);
    }
  }, [strategy]);

  const handleEdit = useCallback(() => {
    if (!form.name.trim() || !strategy) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a strategy name.",
      });
      return;
    }
    onEdit(strategy.id, form);
    bottomSheetRef.current?.close();
  }, [form, onEdit, strategy]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
      handleStyle={styles.handleWrap}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Edit Strategy</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <MaterialIcons name="close" size={20} color="#8c909f" />
        </TouchableOpacity>
      </View>

      {/* ── Form ── */}
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Strategy Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>STRATEGY NAME *</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="Enter strategy name"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, nameFocused && styles.inputFocused]}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            returnKeyType="next"
            selectionColor="#4d8eff"
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <TextInput
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
            placeholder="Enter strategy description"
            placeholderTextColor="rgba(140,144,159,0.5)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textarea,
              descFocused && styles.inputFocused,
            ]}
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            selectionColor="#4d8eff"
          />
        </View>

        {/* ── CTA ── */}
        <View style={styles.footerInside}>
          <TouchableOpacity
            onPress={handleEdit}
            activeOpacity={0.88}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={["#4d8eff", "#3a76e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <MaterialIcons name="edit" size={22} color="#fff" />
              <Text style={styles.ctaText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#181c22",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  handleWrap: { paddingTop: 10, paddingBottom: 0 },
  handle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
  },
  field: { gap: 8 },
  fieldLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#31353c",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: "#dfe2eb",
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "rgba(77,142,255,0.5)",
  },
  textarea: {
    minHeight: 120,
    paddingTop: 16,
  },
  footerInside: {
    marginTop: 40,
    paddingBottom: 20,
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
