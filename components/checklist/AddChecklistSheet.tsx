// components/checklist/AddChecklistSheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

export interface ChecklistFormData {
  category: string;
  text: string;
}

export interface ChecklistEditData {
  id: string;
  category: string;
  text: string;
}

const INITIAL_FORM: ChecklistFormData = {
  category: "",
  text: "",
};

interface AddChecklistSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  sectionType: "pre-market" | "post-market";
  mode: "add" | "edit";
  editData?: ChecklistEditData | null;
  onAdd: (form: ChecklistFormData) => void;
  onEdit?: (id: string, form: ChecklistFormData) => void;
  onDelete?: (id: string) => void;
}

export function AddChecklistSheet({
  bottomSheetRef,
  sectionType,
  mode,
  editData,
  onAdd,
  onEdit,
  onDelete,
}: AddChecklistSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["75%"], []);
  const [form, setForm] = useState<ChecklistFormData>(INITIAL_FORM);
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [textFocused, setTextFocused] = useState(false);

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (mode === "edit" && editData) {
      setForm({ category: editData.category, text: editData.text });
    } else if (mode === "add") {
      setForm(INITIAL_FORM);
    }
  }, [mode, editData]);

  const isEditMode = mode === "edit";

  const headerTitle = isEditMode
    ? "Edit Checklist Item"
    : sectionType === "pre-market"
      ? "Add Pre-Market Checklist"
      : "Add Post-Market Checklist";

  const accentColor = "#4d8eff";

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setForm(INITIAL_FORM);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.category.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a category.",
      });
      return;
    }
    if (!form.text.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter checklist text.",
      });
      return;
    }

    if (isEditMode && editData && onEdit) {
      onEdit(editData.id, form);
    } else {
      onAdd(form);
    }

    setForm(INITIAL_FORM);
    bottomSheetRef.current?.close();
  }, [form, isEditMode, editData, onAdd, onEdit]);

  const handleDelete = useCallback(() => {
    if (!editData || !onDelete) return;

    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${editData.text}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(editData.id);
            setForm(INITIAL_FORM);
            bottomSheetRef.current?.close();
          },
        },
      ]
    );
  }, [editData, onDelete]);

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
        <View style={styles.headerLeft}>
          <View
            style={[styles.headerDot, { backgroundColor: accentColor }]}
          />
          <Text style={styles.title}>{headerTitle}</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <MaterialIcons name="close" size={20} color="#8c909f" />
        </TouchableOpacity>
      </View>

      {/* ── Form ── */}
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CATEGORY *</Text>
          <TextInput
            value={form.category}
            onChangeText={(v) => setForm((p) => ({ ...p, category: v }))}
            placeholder="e.g. Market Analysis, Risk Management"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, categoryFocused && styles.inputFocused]}
            onFocus={() => setCategoryFocused(true)}
            onBlur={() => setCategoryFocused(false)}
            returnKeyType="next"
            selectionColor={accentColor}
          />
        </View>

        {/* Checklist Text */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CHECKLIST TEXT *</Text>
          <TextInput
            value={form.text}
            onChangeText={(v) => setForm((p) => ({ ...p, text: v }))}
            placeholder="e.g. Review overall market trend"
            placeholderTextColor="rgba(140,144,159,0.5)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textarea,
              textFocused && styles.inputFocused,
            ]}
            onFocus={() => setTextFocused(true)}
            onBlur={() => setTextFocused(false)}
            selectionColor={accentColor}
          />
        </View>

        {/* ── CTA ── */}
        <View style={styles.footerInside}>
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.88}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={["#4d8eff", "#3a76e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <MaterialIcons
                name={isEditMode ? "check" : "add"}
                size={22}
                color="#fff"
              />
              <Text style={styles.ctaText}>
                {isEditMode ? "Save Changes" : "Add Checklist Item"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Delete button — only in edit mode */}
          {isEditMode && onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.88}
              style={styles.deleteBtn}
            >
              <MaterialIcons name="delete-outline" size={20} color="#ff5451" />
              <Text style={styles.deleteBtnText}>Delete Item</Text>
            </TouchableOpacity>
          )}
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
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
    minHeight: 90,
    paddingTop: 16,
  },
  footerInside: {
    marginTop: 20,
    paddingBottom: 20,
    gap: 16,
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
  deleteBtn: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 84, 81, 0.3)",
    backgroundColor: "rgba(255, 84, 81, 0.08)",
  },
  deleteBtnText: {
    color: "#ff5451",
    fontSize: 15,
    fontWeight: "700",
  },
});
