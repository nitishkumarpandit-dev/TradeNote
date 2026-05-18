// app/index.tsx
// Bootstrap entry point — checks Clerk auth + onboarding state, then redirects.

import { ASYNC_STORAGE_KEYS } from "@/constants/auth";
import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!isLoaded || !rootNavigationState?.key) return; // Wait for Clerk and Navigation Tree
    bootstrapApp();
  }, [isLoaded, isSignedIn, rootNavigationState?.key]);

  async function bootstrapApp() {
    try {
      const onboarded = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.onboarded,
      );

      // Use setTimeout to push routing to the next tick, ensuring safe transition
      setTimeout(() => {
        if (isSignedIn) {
          router.replace("/(tabs)/DashboardScreen");
        } else if (!onboarded) {
          router.replace("/(onboarding)/onboarding");
        } else {
          router.replace("/(auth)/screens/LoginScreen");
        }
      }, 0);
    } catch (error) {
      console.error("Bootstrap error:", error);
      setTimeout(() => router.replace("/(onboarding)/onboarding"), 0);
    }
  }

  // Dark splash while Clerk + AsyncStorage resolve
  return <View style={styles.splash} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: "#10141a" },
});
