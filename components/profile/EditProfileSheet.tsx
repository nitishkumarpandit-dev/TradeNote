// components/profile/EditProfileSheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { useUser } from "@clerk/expo";

interface EditProfileSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

export function EditProfileSheet({ bottomSheetRef }: EditProfileSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);
  const { user } = useUser();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // Pre-fill name when user is loaded
  useEffect(() => {
    if (user) {
      const currentName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();
      setName(currentName);
    }
  }, [user]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Passwords do not match.",
        });
        return;
      }
      if (password.length < 8) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Password must be at least 8 characters.",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Update name if changed
      const currentName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (name.trim() && name.trim() !== currentName) {
        const parts = name.trim().split(" ");
        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ");
        await user.update({ firstName, lastName });
      }

      // Update password if provided
      if (password) {
        // Note: Clerk typically requires the current password to update it directly.
        // If your Clerk config requires a current password, this might throw an error.
        await user.updatePassword({ newPassword: password, signOutOfOtherSessions: true });
        setPassword("");
        setConfirmPassword("");
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully.",
      });
      bottomSheetRef.current?.close();
    } catch (err: any) {
      console.error(err);
      const msg = err.errors?.[0]?.message || err.message || "Failed to update profile";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    []
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
        <Text style={styles.title}>Edit Profile</Text>
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
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>FULL NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, nameFocused && styles.inputFocused]}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            returnKeyType="next"
            selectionColor="#4d8eff"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionHint}>Leave blank to keep current password</Text>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter new password"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, passwordFocused && styles.inputFocused]}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry
            selectionColor="#4d8eff"
            editable={!isSubmitting}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="rgba(140,144,159,0.5)"
            style={[styles.input, confirmFocused && styles.inputFocused]}
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
            secureTextEntry
            selectionColor="#4d8eff"
            editable={!isSubmitting}
          />
        </View>

        {/* ── CTA ── */}
        <View style={styles.footerInside}>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.88}
            style={[styles.ctaWrap, isSubmitting && { opacity: 0.7 }]}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={["#4d8eff", "#3a76e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Text>
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
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "100%",
  },
  sectionHint: {
    color: "#8c909f",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: -8,
  },
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
