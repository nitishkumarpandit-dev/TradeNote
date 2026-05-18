// app/(auth)/screens/RegisterScreen.tsx
// Uses new Clerk API: signUp.password() → signUp.verifications.sendEmailCode()

import { useSignUp } from "@clerk/expo";
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
import GoogleButton from "@/components/GoogleButton";
import { AUTH_COPY, AUTH_ROUTES, COLORS } from "@/constants/auth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

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

export default function RegisterScreen() {
  // New Clerk API: signUp object + errors + fetchStatus
  const { signUp, errors, fetchStatus } = useSignUp();
  const { handleGoogleAuth, isGoogleLoading } = useGoogleAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const copy = AUTH_COPY.register;

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

  const handleRegister = async () => {
    let isValid = true;
    
    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    // New API: signUp.password() instead of signUp.create()
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" ") || undefined,
    });

    if (error) {
      const clerkErr = (error as any).errors?.[0];
      if (clerkErr) {
        const param = clerkErr.meta?.paramName;
        const msg = clerkErr.longMessage || clerkErr.message;
        if (param === "password") setPasswordError(msg);
        else if (param === "email_address" || param === "emailAddress" || param === "email") setEmailError(msg);
        else if (param === "first_name" || param === "last_name" || param === "name") setNameError(msg);
        else setPasswordError(msg);
      } else {
        setPasswordError("An unexpected error occurred during registration.");
      }
      return;
    }

    // New API: signUp.verifications.sendEmailCode() instead of prepareEmailAddressVerification
    await signUp.verifications.sendEmailCode();
    // Navigate to email verification screen
    router.push(AUTH_ROUTES.emailVerification);
  };

  const handleGoogle = () => {
    handleGoogleAuth();
  };

  const isLoading = fetchStatus === "fetching" || isGoogleLoading;

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

          <GoogleButton onPress={handleGoogle} loading={isGoogleLoading} />
          <Divider />

          <View style={styles.fieldGroup}>
            <FormInput
              placeholder={AUTH_COPY.shared.namePlaceholder}
              value={name}
              onChangeText={(t) => { setName(t); setNameError(""); }}
              iconName="person"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              error={nameError}
            />
            <FormInput
              inputRef={emailRef as React.RefObject<TextInput>}
              placeholder={AUTH_COPY.shared.emailPlaceholder}
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(""); }}
              iconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={emailError || errors.fields.emailAddress?.message}
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
              onSubmitEditing={handleRegister}
              error={passwordError || errors.fields.password?.message}
            />
          </View>


          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.88}
            disabled={isLoading || !name || !email || !password}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaGradient,
                (isLoading || !name || !email || !password) &&
                  styles.ctaDisabled,
              ]}
            >
              <Text style={styles.ctaText}>
                {isLoading ? "Creating account…" : copy.cta}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Required for Clerk bot protection */}
          <View nativeID="clerk-captcha" />
        </AuthCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {copy.hasAccount}{" "}
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
    marginBottom: 20,
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
  fieldGroup: { gap: 12, marginBottom: 16 },
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
