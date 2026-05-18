// app/(auth)/screens/LoginScreen.tsx
// Uses new Clerk API: signIn.password() + signIn.finalize()

import { useSignIn } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
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
import GoogleButton from "@/components/GoogleButton";
import { AUTH_COPY, AUTH_ROUTES, COLORS } from "@/constants/auth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

// ─── Brand Header ─────────────────────────────────────────────────────────────
function BrandHeader() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandIcon}>
        <MaterialIcons
          name="rocket-launch"
          size={18}
          color={COLORS.primaryBlueDim}
        />
      </View>
      <Text style={styles.brandName}>{AUTH_COPY.brand.name.toUpperCase()}</Text>
    </View>
  );
}

function Divider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{AUTH_COPY.shared.or}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  // New Clerk API: signIn object + errors + fetchStatus
  const { signIn, errors, fetchStatus } = useSignIn();
  const { handleGoogleAuth, isGoogleLoading } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mfaCodeError, setMfaCodeError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const passwordRef = useRef<TextInput>(null);
  const copy = AUTH_COPY.login;

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

  // ── Email/password sign-in ──────────────────────────────────────────────────
  const handleLogin = async () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    // New API: signIn.password() instead of signIn.create()
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) {
      const clerkErr = (error as any).errors?.[0];
      if (clerkErr) {
        const param = clerkErr.meta?.paramName;
        const msg = clerkErr.longMessage || clerkErr.message;
        if (param === "password") setPasswordError(msg);
        else if (param === "identifier" || param === "email_address" || param === "emailAddress") setEmailError(msg);
        else setPasswordError(msg);
      } else {
        setPasswordError("An unexpected error occurred during login.");
      }
      return;
    }

    if (signIn.status === "complete") {
      // New API: signIn.finalize() instead of setActive()
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    } else if (signIn.status === "needs_client_trust") {
      // MFA required — send email code
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (f) => f.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
      // Stay on screen — MFA UI shown below
    } else {
      console.error("Sign-in incomplete:", signIn.status);
    }
  };

  // ── MFA verification ────────────────────────────────────────────────────────
  const handleMfaVerify = async () => {
    if (!mfaCode || mfaCode.length < 6) {
      setMfaCodeError("Please enter a valid 6-digit code");
      return;
    }
    setMfaCodeError("");

    await signIn.mfa.verifyEmailCode({ code: mfaCode });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    } else {
      console.error("MFA verification incomplete:", signIn.status);
    }
  };

  const handleGoogle = () => {
    handleGoogleAuth();
  };

  const isLoading = fetchStatus === "fetching" || isGoogleLoading;

  // ── MFA Screen ──────────────────────────────────────────────────────────────
  if (signIn.status === "needs_client_trust") {
    return (
      <AuthBackground>
        <View style={styles.inner}>
          <AuthCard style={styles.card}>
            <Text style={styles.title}>Verify Your Identity</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to your email.
            </Text>
            <FormInput
              placeholder="6-digit code"
              value={mfaCode}
              onChangeText={(t) => { setMfaCode(t); setMfaCodeError(""); }}
              iconName="security"
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleMfaVerify}
              error={mfaCodeError || errors.fields.code?.message}
            />
            <TouchableOpacity
              onPress={handleMfaVerify}
              activeOpacity={0.88}
              disabled={isLoading}
              style={styles.ctaWrap}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>
                  {isLoading ? "Verifying…" : "Verify"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => signIn.mfa.sendEmailCode()}
              style={styles.resendBtn}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => signIn.reset()}
              style={styles.resendBtn}
            >
              <Text style={styles.resendText}>Start Over</Text>
            </TouchableOpacity>
          </AuthCard>
        </View>
      </AuthBackground>
    );
  }

  // ── Main login form ─────────────────────────────────────────────────────────
  return (
    <AuthBackground>
      <Animated.View
        style={[
          styles.inner,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <BrandHeader />

        <AuthCard style={styles.card}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <GoogleButton onPress={handleGoogle} loading={isGoogleLoading} />
          <Divider />

          <View style={styles.fieldGroup}>
            <FormInput
              placeholder={AUTH_COPY.shared.emailPlaceholder}
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(""); }}
              iconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={emailError || errors.fields.identifier?.message}
            />
            <FormInput
              inputRef={passwordRef as React.RefObject<TextInput>}
              placeholder={AUTH_COPY.shared.passwordPlaceholder}
              value={password}
              onChangeText={(t) => { setPassword(t); setPasswordError(""); }}
              iconName="lock"
              secureTextEntry
              showToggle
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              error={passwordError || errors.fields.password?.message}
            />
          </View>


          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => router.push(AUTH_ROUTES.forgotPassword)}
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Text style={styles.forgotText}>{copy.forgotPassword}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.88}
            disabled={isLoading || !email || !password}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaGradient,
                (isLoading || !email || !password) && styles.ctaDisabled,
              ]}
            >
              <Text style={styles.ctaText}>
                {isLoading ? "Logging in…" : copy.cta}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </AuthCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {copy.noAccount}{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.push(AUTH_ROUTES.register)}
            >
              {copy.signUp}
            </Text>
          </Text>
          <Text style={styles.terms}>
            {AUTH_COPY.shared.terms}{" "}
            <Text style={styles.termsLink}>{AUTH_COPY.shared.termsLink}</Text>{" "}
            {AUTH_COPY.shared.and}{" "}
            <Text style={styles.termsLink}>{AUTH_COPY.shared.privacyLink}</Text>
            .
          </Text>
        </View>
      </Animated.View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  inner: { width: "100%", maxWidth: 440, alignItems: "center" },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#31353c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  brandName: {
    color: COLORS.primaryBlueDim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  card: { marginBottom: 20 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(66,71,84,0.35)" },
  dividerText: {
    color: COLORS.textHint,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  fieldGroup: { gap: 12, marginBottom: 10 },
  forgotWrap: { alignSelf: "flex-end", marginTop: 10, marginBottom: 20 },
  forgotText: { color: COLORS.primaryBlueDim, fontSize: 12, fontWeight: "600" },
  ctaWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primaryBlue,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: { height: 52, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.5 },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  resendBtn: { marginTop: 12, alignItems: "center" },
  resendText: { color: COLORS.primaryBlueDim, fontSize: 13, fontWeight: "600" },
  footer: { alignItems: "center", gap: 12 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  footerLink: { color: COLORS.primaryBlueDim, fontWeight: "700" },
  terms: {
    color: COLORS.textHint,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 15,
    maxWidth: 280,
    opacity: 0.7,
  },
  termsLink: { textDecorationLine: "underline" },
});
