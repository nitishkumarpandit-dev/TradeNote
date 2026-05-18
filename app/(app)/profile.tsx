// app/profile.tsx

import { useAuth } from "@clerk/expo";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrokerCard } from "../../components/profile/BrokerCard";
import { InfoCard } from "../../components/profile/InfoCard";
import { LogoutButton } from "../../components/profile/LogoutButton";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { EditProfileSheet } from "../../components/profile/EditProfileSheet";
import { BrokerListSheet } from "../../components/profile/BrokerListSheet";
import { AUTH_ROUTES } from "@/constants/auth";
import { useProfile } from "../../hooks/useProfile";

import { SkeletonCard } from "@/components/common/Skeleton";

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const brokerSheetRef = useRef<BottomSheet>(null);
  const { signOut } = useAuth();
  const {
    user,
    broker,
    isLoading,
    logout,
    refreshBrokerStatus,
    disconnectBroker,
    editProfile,
    upgradePlan,
  } = useProfile();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (logout) {
        logout(); // clear local state if needed
      }
      await signOut();
      router.replace(AUTH_ROUTES.login as any);
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };


  if (isLoading || !user) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.headerWrap}>
          <ProfileHeader onEdit={() => {}} />
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <SkeletonCard />
          <SkeletonCard style={{ height: 160 }} />
          <SkeletonCard style={{ height: 120 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <ProfileHeader onEdit={() => bottomSheetRef.current?.expand()} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard user={user} />

        <BrokerCard
          broker={broker}
          onConnect={() => brokerSheetRef.current?.expand()}
          onDisconnect={disconnectBroker}
        />

        <LogoutButton onLogout={handleLogout} />
      </ScrollView>

      <EditProfileSheet bottomSheetRef={bottomSheetRef} />
      <BrokerListSheet
        bottomSheetRef={brokerSheetRef}
        onSelect={(b) => {
          // Refresh the status after a successful connection from the sheet
          if (refreshBrokerStatus) {
            refreshBrokerStatus();
          }
        }}
      />
      
      {isLoggingOut && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4d8eff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#10141a",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 20, 26, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerWrap: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 32,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
});
