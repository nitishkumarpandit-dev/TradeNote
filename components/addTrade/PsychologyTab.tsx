// components/addTrade/PsychologyTab.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { EMOTIONAL_STATES, TradeFormData } from "../../types/trade";
import { MistakesGrid } from "./MistakesGrid";
import { RatingSlider } from "./RatingSlider";
import { SectionLabel } from "./SectionLabel";

interface PsychologyTabProps {
  form: TradeFormData;
  update: <K extends keyof TradeFormData>(
    key: K,
    val: TradeFormData[K],
  ) => void;
  toggleMistake: (m: string) => void;
  clearMistakes: () => void;
  errors?: Partial<Record<keyof TradeFormData, boolean>>;
}

// ── Emotional state picker ─────────────────────────────────────────────────────
function EmotionPicker({
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
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            {EMOTIONAL_STATES.map((state) => (
              <TouchableOpacity
                key={state}
                style={[styles.option, state === value && styles.optionActive]}
                onPress={() => {
                  onChange(state);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    state === value && styles.optionTextActive,
                  ]}
                >
                  {state}
                </Text>
                {state === value && (
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

// ── Main component ─────────────────────────────────────────────────────────────
export function PsychologyTab({
  form,
  update,
  toggleMistake,
  clearMistakes,
  errors = {},
}: PsychologyTabProps) {
  return (
    <View style={styles.container}>
      {/* ── Sliders ── */}
      <View style={styles.section}>
        <RatingSlider
          label="Entry Confidence Level"
          required
          value={form.confidence}
          onChange={(v) => update("confidence", v)}
          leftLabel="Low"
          midLabel="Medium"
          rightLabel="High"
          valueColor="#adc6ff"
        />
      </View>

      <View style={styles.section}>
        <RatingSlider
          label="Satisfaction Rating"
          required
          value={form.satisfaction}
          onChange={(v) => update("satisfaction", v)}
          leftLabel="Not Satisfied"
          midLabel="Average"
          rightLabel="Satisfied"
          valueColor="#43e5b1"
        />
      </View>

      {/* ── Emotional State ── */}
      <View style={styles.section}>
        <SectionLabel label="Emotional State" required />
        <EmotionPicker
          value={form.emotionalState}
          onChange={(v) => update("emotionalState", v)}
          error={errors.emotionalState}
        />
      </View>

      {/* ── Mistakes ── */}
      <View style={styles.section}>
        <SectionLabel label="Mistakes Made" />
        <MistakesGrid
          selected={form.mistakes}
          onToggle={toggleMistake}
          onClear={clearMistakes}
        />
      </View>

      {/* ── Lessons Learned ── */}
      <View style={styles.section}>
        <SectionLabel label="Lessons Learned" />
        <TextInput
          value={form.lessonsLearned}
          onChangeText={(v) => update("lessonsLearned", v)}
          placeholder="Reflect on your technical and mental performance..."
          placeholderTextColor="rgba(194,198,214,0.3)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textarea}
          selectionColor="#4d8eff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 28 },
  section: { gap: 0 },

  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0a0e14",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.3)",
  },
  pickerValue: { color: "#dfe2eb", fontSize: 14 },

  overlay: {
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  optionActive: { backgroundColor: "rgba(77,142,255,0.08)" },
  optionText: { color: "#8c909f", fontSize: 14 },
  optionTextActive: { color: "#4d8eff", fontWeight: "600" },

  textarea: {
    backgroundColor: "#0a0e14",
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
