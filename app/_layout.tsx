import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, useNavigationContainerRef } from "expo-router";

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import { ErrorBoundaryProps } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import NetworkStatus from "../components/NetworkStatus";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/ToastConfig";
import "./global.css";



const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file",
  );
}

export function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const ref = useNavigationContainerRef();

  useEffect(() => {
    // Sentry routing instrumentation removed
  }, [ref]);

  useEffect(() => {
    // Configure Navigation Bar for Android
    if (Platform.OS === "android") {
      // NavigationBar.setBackgroundColorAsync("#10141a");
      NavigationBar.setButtonStyleAsync("light");
    }

    // Simulate some app initialization
    const prepare = async () => {
      try {
        // You can load fonts or other assets here.
        // We'll keep a small delay to simulate loading or prevent a flash, but
        // you can remove the timeout if no async initialization is required.
        await new Promise((resolve) => setTimeout(resolve, 500)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="light" />
            <NetworkStatus />
            <Stack screenOptions={{ headerShown: false }} />
            <Toast config={toastConfig} />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

export default RootLayout;

// Global Error Boundary (Prep for Sentry)
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#10141a", padding: 20 }}>
      <Text style={{ color: "#ff5451", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Something went wrong!</Text>
      <Text style={{ color: "#dfe2eb", fontSize: 14, textAlign: "center", marginBottom: 20 }}>{error.message}</Text>
      <TouchableOpacity onPress={retry} style={{ backgroundColor: "#4d8eff", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
