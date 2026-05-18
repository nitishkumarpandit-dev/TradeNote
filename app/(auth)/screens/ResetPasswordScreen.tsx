// app/(auth)/screens/ResetPasswordScreen.tsx

import { useSignIn } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AuthBackground from "@/components/AuthBackground";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import { AUTH_COPY, AUTH_ROUTES, COLORS } from "@/constants/auth";

function TopHeader() {
  return (
    <View style={styles.topHeader}>
      <View style={styles.topHeaderLeft}>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace(AUTH_ROUTES.login)
          }
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name="arrow-back"
            size={20}
            color={COLORS.primaryBlue}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RESET PASSWORD</Text>
      </View>
    </View>
  );
}

export default function ResetPasswordScreen() {
  const { signIn } = useSignIn() as any;
  const [isLoading, setIsLoading] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const copy = AUTH_COPY.resetPassword;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (codeError) setCodeError("");
    if (text.length === 6 && /^\d+$/.test(text)) {
      setCode(text.split(""));
      inputRefs.current[5]?.focus();
      return;
    }
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleReset = async () => {
    try {
      const fullCode = code.join("");

      // validations
      let isValid = true;
      if (fullCode.length < 6) {
        setCodeError("Please enter the full 6-digit code.");
        isValid = false;
      } else {
        setCodeError("");
      }

      if (!password) {
        setPasswordError("Password is required.");
        isValid = false;
      } else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
        isValid = false;
      } else {
        setPasswordError("");
      }

      if (!confirmPassword) {
        setConfirmPasswordError("Please confirm your password.");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }

      if (!isValid) return;

      setIsLoading(true);

      // 1. Verify the code
      await (signIn as any).resetPasswordEmailCode.verifyCode({
        code: fullCode,
      });

      // 2. Submit the new password
      await (signIn as any).resetPasswordEmailCode.submitPassword({
        password,
      });

      if (signIn.status === "complete") {
        await (signIn as any).finalize({
          navigate: ({ decorateUrl }: any) => {
            router.replace("/");
          },
        });
      } else {
        console.error("Status:", signIn.status);
        setPasswordError("Failed to reset password.");
      }
    } catch (err: any) {
      console.error("Reset Error:", err.message, err.errors);
      const clerkErr = err.errors?.[0];
      if (clerkErr) {
        if (clerkErr.meta?.paramName === "code") {
          setCodeError(clerkErr.longMessage || "Invalid code");
        } else {
          setPasswordError(clerkErr.longMessage || clerkErr.message);
        }
      } else {
        setPasswordError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fullCode = code.join("");

  return (
    <AuthBackground header={<TopHeader />}>
      <Animated.View
        style={[
          styles.inner,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <AuthCard style={styles.card}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          {/* 6-digit OTP inputs */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={[styles.otpInput, !!codeError && styles.otpInputError]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
                selectionColor={COLORS.primaryBlue}
              />
            ))}
          </View>

          {!!codeError && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={14} color="#ff5451" />
              <Text style={styles.errorText}>{codeError}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <FormInput
              placeholder="New Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              iconName="lock"
              secureTextEntry
              showToggle
              error={passwordError}
            />
            <FormInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setConfirmPasswordError("");
              }}
              iconName="lock"
              secureTextEntry
              error={confirmPasswordError}
            />
          </View>

          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.88}
            disabled={
              isLoading || fullCode.length < 6 || !password || !confirmPassword
            }
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaGradient,
                (isLoading || fullCode.length < 6 || !password) &&
                  styles.ctaDisabled,
              ]}
            >
              <Text style={styles.ctaText}>
                {isLoading ? "Resetting..." : copy.cta}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </AuthCard>
      </Animated.View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: "100%",
    maxWidth: 440,
    alignItems: "center",
    paddingTop: 100,
  },
  topHeader: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 50,
  },
  topHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { padding: 8 },
  headerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  card: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 280,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 40,
    height: 50,
    backgroundColor: "rgba(10, 14, 20, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  otpInputError: {
    borderColor: "#ff5451",
    backgroundColor: "rgba(255, 84, 81, 0.05)",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    color: "#ff5451",
    fontSize: 12,
  },
  fieldGroup: { width: "100%", gap: 16, marginBottom: 20 },
  ctaWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primaryBlue,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: { height: 56, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.5 },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
