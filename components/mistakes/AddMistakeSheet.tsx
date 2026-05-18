// components/mistakes/AddMistakeSheet.tsx

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
  INITIAL_MISTAKE_FORM,
  MISTAKE_CATEGORIES,
  MistakeCategory,
  MistakeFormData,
} from "../../types/mistake";

interface AddMistakeSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onAdd: (form: MistakeFormData) => void;
}

// ── Category picker ────────────────────────────────────────────────────────────
function CategoryPicker({
  value,
  onChange,
}: {
  value: MistakeCategory | "";
  onChange: (v: MistakeCategory) => void;
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
          style={styles.overlay}
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
            {MISTAKE_CATEGORIES.map((cat, i) => {
              const isActive = cat === value;
              const isLast = i === MISTAKE_CATEGORIES.length - 1;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catOption,
                    isActive && styles.catOptionActive,
                    !isLast && styles.catBorder,
                  ]}
                  onPress={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.catText, isActive && styles.catTextActive]}
                  >
                    {cat}
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
    </>
  );
}

// ── Main sheet ─────────────────────────────────────────────────────────────────
export function AddMistakeSheet({
  bottomSheetRef,
  onAdd,
}: AddMistakeSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["65%"], []);
  const [form, setForm] = useState<MistakeFormData>(INITIAL_MISTAKE_FORM);
  const [nameFocused, setNameFocused] = useState(false);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCreate = useCallback(() => {
    if (!form.name.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a mistake name.",
      });
      return;
    }
    onAdd(form);
    setForm(INITIAL_MISTAKE_FORM);
    bottomSheetRef.current?.close();
  }, [form, onAdd]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.75}
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Custom Mistake</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <MaterialIcons name="close" size={20} color="#8c909f" />
        </TouchableOpacity>
      </View>

      {/* Form fields */}
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mistake Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            MISTAKE NAME <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g., Revenge Trading"
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

        {/* ── CTA ── */}
        <View style={styles.footerInside}>
          <TouchableOpacity
            style={styles.createWrap}
            onPress={handleCreate}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={["#4d8eff", "#3a76e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createGradient}
            >
              <Text style={styles.createText}>Create Mistake</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#1c2026",
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
    backgroundColor: "#353940",
    alignItems: "center",
    justifyContent: "center",
  },
  form: { paddingHorizontal: 20, gap: 22 },
  field: { gap: 8 },
  fieldLabel: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  required: { color: "#ffb3ad" },
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
  inputFocused: { borderColor: "rgba(77,142,255,0.5)" },
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
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
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  catBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  catOptionActive: { backgroundColor: "rgba(77,142,255,0.06)" },
  catText: { color: "#8c909f", fontSize: 14 },
  catTextActive: { color: "#4d8eff", fontWeight: "600" },
  footerInside: {
    marginTop: 40,
    paddingBottom: 20,
  },
  createWrap: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  createGradient: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  createText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
