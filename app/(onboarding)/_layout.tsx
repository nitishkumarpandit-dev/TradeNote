// app/(onboarding)/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#10141a" },
        }}
      >
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  );
}
