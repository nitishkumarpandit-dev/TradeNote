import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { View, ActivityIndicator } from "react-native";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#10141a", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4d8eff" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/screens/LoginScreen" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
