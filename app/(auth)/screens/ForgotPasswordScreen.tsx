// app/(auth)/screens/ForgotPasswordScreen.tsx
// Uses new Clerk API: signIn.password() with reset_password_email_code strategy

import { useSignIn } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
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
        <Text style={styles.headerTitle}>Recover Password</Text>
      </View>
    </View>
  );
}

export default function ForgotPasswordScreen() {
  const { isLoaded, signIn } = useSignIn() as any;
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const copy = AUTH_COPY.forgotPassword;

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

  const handleReset = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    try {
      setIsLoading(true);
      // 1. Initiate the sign in with the email & inherently send the reset code
      await (signIn as any).create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      // Navigate to ResetPasswordScreen to enter code + new password
      router.push(AUTH_ROUTES.resetPassword);
    } catch (err: any) {
      const clerkErr = err.errors?.[0];
      if (clerkErr) {
        setEmailError(clerkErr.longMessage || clerkErr.message);
      } else {
        setEmailError("Failed to send the reset code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <MaterialIcons
                name="rocket-launch"
                size={32}
                color={COLORS.primaryBlue}
              />
            </View>
            <View style={styles.iconGlow} />
          </View>

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{copy.emailLabel}</Text>
            <FormInput
              placeholder={copy.emailPlaceholder}
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(""); }}
              iconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleReset}
              error={emailError}
            />
          </View>


          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.88}
            disabled={isLoading || !email}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaGradient,
                (isLoading || !email) && styles.ctaDisabled,
              ]}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaText}>
                  {isLoading ? "Sending reset link…" : copy.cta}
                </Text>
                {!isLoading && (
                  <MaterialIcons name="send" size={18} color="#fff" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </AuthCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {copy.remembered}{" "}
            <Text
              style={styles.footerLink}
              onPress={() =>
                router.canGoBack()
                  ? router.back()
                  : router.replace(AUTH_ROUTES.login)
              }
            >
              {copy.login}
            </Text>
          </Text>
        </View>

        <View style={styles.secureNote} pointerEvents="none">
          <Text style={styles.secureText}>{copy.secureNote}</Text>
        </View>
      </Animated.View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  inner: { width: "100%", maxWidth: 440, alignItems: "center" },
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
  },
  iconContainer: {
    position: "relative",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(49, 53, 60, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(140, 144, 159, 0.3)",
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
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 240,
  },
  fieldGroup: { width: "100%", gap: 8, marginBottom: 16 },
  fieldLabel: {
    color: "rgba(194, 198, 214, 0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 4,
  },
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
  ctaContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  footer: { alignItems: "center", marginTop: 12 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  footerLink: { color: COLORS.primaryBlue, fontWeight: "700" },
  secureNote: { marginTop: 40 },
  secureText: {
    color: "rgba(140, 144, 159, 0.25)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
