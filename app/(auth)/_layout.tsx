// app/(auth)/_layout.tsx
// Auth stack layout — redirects to app if user is already signed in via Clerk.

import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // While Clerk initializes, render nothing to avoid flash
  if (!isLoaded) return null;

  // Already authenticated → skip auth screens
  if (isSignedIn) return <Redirect href="/(app)/(tabs)/DashboardScreen" />;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0B0F1A" },
          animation: "fade",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="screens/LoginScreen" />
        <Stack.Screen name="screens/RegisterScreen" />
        <Stack.Screen name="screens/ForgotPasswordScreen" />
        <Stack.Screen name="screens/ResetPasswordScreen" />
        <Stack.Screen name="screens/EmailVerificationScreen" />
      </Stack>
    </>
  );
}