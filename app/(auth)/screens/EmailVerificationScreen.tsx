// app/(auth)/screens/EmailVerificationScreen.tsx
// Uses new Clerk API: signUp.verifications.verifyEmailCode() + signUp.finalize()

import { useSignUp } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import AuthBackground from "@/components/AuthBackground";
import AuthCard from "@/components/AuthCard";
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
        <Text style={styles.headerTitle}>Verification</Text>
      </View>
    </View>
  );
}

export default function EmailVerificationScreen() {
  // New Clerk API: signUp object + errors + fetchStatus
  const { signUp, errors, fetchStatus } = useSignUp();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const copy = AUTH_COPY.emailVerification;

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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
    // Support paste of full 6-digit code
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

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setCodeError("Please enter the full 6-digit code");
      return;
    }
    setCodeError("");

    try {
      // New API: signUp.verifications.verifyEmailCode() instead of attemptEmailAddressVerification()
      await signUp.verifications.verifyEmailCode({ code: fullCode });

      if (signUp.status === "complete") {
        // New API: signUp.finalize() instead of setActive()
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            router.replace(url as Href);
          },
        });
      } else {
        if (signUp.status === "missing_requirements") {
          setCodeError("Invalid verification code. Please check and try again.");
        }
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setCodeError(err.errors?.[0]?.longMessage || "Invalid code. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!signUp || countdown > 0) return;

    try {
      await signUp.verifications.sendEmailCode();
      setCountdown(30);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Failed to resend code. Please try again.",
      });
    }
  };

  const isLoading = fetchStatus === "fetching";
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
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <MaterialIcons name="lock" size={40} color={COLORS.primaryBlue} />
            </View>
            <View style={styles.iconGlow} />
          </View>

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{" "}
            <Text style={styles.emailText}>{signUp?.emailAddress}</Text> 
          </Text>

          {/* 6-digit OTP inputs */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={[
                  styles.otpInput,
                  !!(codeError || errors.fields.code) && styles.otpInputError,
                ]}
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

          {/* Clerk error messages */}
          {(codeError || errors.fields.code) && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={14} color="#ff5451" />
              <Text style={styles.errorText}>
                {codeError || errors.fields.code?.message}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.88}
            disabled={isLoading || fullCode.length < 6}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaGradient,
                (isLoading || fullCode.length < 6) && styles.ctaDisabled,
              ]}
            >
              <Text style={styles.ctaText}>
                {isLoading ? "Verifying..." : copy.cta}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {copy.noEmail}{" "}
              <Text
                style={[
                  styles.footerLink,
                  countdown > 0 && styles.footerLinkDisabled,
                ]}
                onPress={handleResend}
              >
                {countdown > 0 ? `Resend ${countdown}s` : copy.resend}
              </Text>
            </Text>
          </View>
        </AuthCard>

        <View style={styles.decoration}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  card: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "rgba(77, 142, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryBlue,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  emailText: {
    color: "#fff",
    fontWeight: "700",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 42,
    height: 56,
    backgroundColor: "rgba(28, 32, 38, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: 20,
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
  ctaWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: COLORS.primaryBlue,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: { height: 56, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { alignItems: "center" },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  footerLink: {
    color: COLORS.primaryBlue,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  footerLinkDisabled: {
    color: COLORS.textMuted,
    textDecorationLine: "none",
  },
  decoration: { flexDirection: "row", gap: 16, marginTop: 48, opacity: 0.4 },
  dot: {
    width: 48,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
  },
  dotActive: { backgroundColor: COLORS.primaryBlue },
});
