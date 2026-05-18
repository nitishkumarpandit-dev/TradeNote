// components/checklist/ChecklistHeader.tsx

import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChecklistHeaderProps {
  onSave: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  saveDisabled?: boolean;
  isSaving?: boolean;
}

export function ChecklistHeader({
  onSave,
  selectedDate,
  onDateChange,
  saveDisabled,
  isSaving,
}: ChecklistHeaderProps) {
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (date) {
      onDateChange(date);
    }
  };

  const handleCalendarPress = () => {
    setShowPicker(true);
  };

  const handleIOSDone = () => {
    setShowPicker(false);
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Checklist</Text>
        <View style={styles.dateRow}>
          <Text style={styles.date}>{formattedDate.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleCalendarPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="calendar-today" size={20} color="#8c909f" />
        </TouchableOpacity>

        {!saveDisabled && (
          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={onSave}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Text style={styles.saveBtnText}>
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Android: native modal dialog */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS: inline picker in a bottom overlay */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          />
          <View style={styles.iosPickerContainer}>
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={handleIOSDone}>
                <Text style={styles.iosDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor="#ffffff"
              style={styles.iosPicker}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 2,
  },
  date: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1c2026",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  saveBtn: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#4d8eff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4d8eff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  iosPickerContainer: {
    backgroundColor: "#1c2026",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  iosDoneText: {
    color: "#4d8eff",
    fontSize: 16,
    fontWeight: "700",
  },
  iosPicker: {
    height: 200,
  },
});

