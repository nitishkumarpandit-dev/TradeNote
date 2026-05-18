// components/rules/CreateRuleSheet.tsx

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
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORY_COLORS,
  INITIAL_RULE_FORM,
  RULE_CATEGORIES,
  RuleCategory,
  RuleFormData,
} from "../../types/rule";

interface CreateRuleSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onAdd: (form: RuleFormData) => void;
}

// ── Category picker modal ──────────────────────────────────────────────────────
function CategoryPicker({
  value,
  onChange,
}: {
  value: RuleCategory | "";
  onChange: (v: RuleCategory) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.pickerTrigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.pickerText, !value && styles.pickerPlaceholder]}>
          {value || "Select category"}
        </Text>
        <MaterialIcons name="expand-more" size={22} color="#8c909f" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialIcons name="close" size={18} color="#8c909f" />
              </TouchableOpacity>
            </View>
            {RULE_CATEGORIES.map((cat, i) => {
              const isActive = cat === value;
              const colors = CATEGORY_COLORS[cat];
              const isLast = i === RULE_CATEGORIES.length - 1;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catOption,
                    isActive && styles.catOptionActive,
                    !isLast && styles.catOptionBorder,
                  ]}
                  onPress={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.catDot, { backgroundColor: colors.text }]}
                  />
                  <Text
                    style={[
                      styles.catText,
                      isActive && { color: colors.text, fontWeight: "700" },
                    ]}
                  >
                    {cat}
                  </Text>
                  {isActive && (
                    <MaterialIcons name="check" size={16} color={colors.text} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function CreateRuleSheet({
  bottomSheetRef,
  onAdd,
}: CreateRuleSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);
  const [form, setForm] = useState<RuleFormData>(INITIAL_RULE_FORM);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCreate = useCallback(() => {
    if (!form.name.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a rule name.",
      });
      return;
    }
    if (!form.category) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please select a category.",
      });
      return;
    }
    onAdd(form);
    setForm(INITIAL_RULE_FORM);
    bottomSheetRef.current?.close();
  }, [form, onAdd]);

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
        <Text style={styles.title}>Create New Rule</Text>
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
        {/* Rule Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>RULE NAME</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g., Wait for confirmation"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, nameFocused && styles.inputFocused]}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            returnKeyType="next"
            selectionColor="#4d8eff"
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <CategoryPicker
            value={form.category}
            onChange={(v) => setForm((p) => ({ ...p, category: v }))}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <TextInput
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
            placeholder="Describe the rule in detail..."
            placeholderTextColor="rgba(140,144,159,0.5)"
            multiline
            numberOfLines={5}
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
            onPress={handleCreate}
            activeOpacity={0.88}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={["#4d8eff", "#3a76e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Create Rule</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    paddingHorizontal: 20,
    gap: 24,
  },
  field: { gap: 8 },
  fieldLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#0a0e14",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#dfe2eb",
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "rgba(66,71,84,0.4)",
  },
  inputFocused: {
    borderColor: "rgba(77,142,255,0.5)",
  },
  textarea: {
    minHeight: 130,
    paddingTop: 14,
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0a0e14",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "rgba(66,71,84,0.4)",
  },
  pickerText: { color: "#dfe2eb", fontSize: 15 },
  pickerPlaceholder: { color: "rgba(140,144,159,0.5)" },
  modalOverlay: {
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
  catOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  catOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  catOptionActive: { backgroundColor: "rgba(77,142,255,0.06)" },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catText: { flex: 1, color: "#8c909f", fontSize: 14 },
  footerInside: {
    marginTop: 16,
    paddingBottom: 20,
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
