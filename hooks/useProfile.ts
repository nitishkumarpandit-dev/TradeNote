import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Broker, User } from "../types/profile";
import { useUser, useAuth } from "@clerk/expo";
import { fetchWithAuth } from "../services/api";
import Toast from "react-native-toast-message";

export function useProfile() {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchBrokerStatus = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setIsDataLoading(false);
        return;
      }
      
      const data = await fetchWithAuth("/broker/status", () => Promise.resolve(token));
      if (data && data.isConnected) {
        setBroker({
          name: data.brokerId === "delta" ? "Delta Exchange" : data.brokerId,
          connectedAt: data.lastVerifiedAt 
            ? new Date(data.lastVerifiedAt).toLocaleDateString("en-GB", { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).toUpperCase()
            : "Connected",
          isConnected: true,
        });
      } else {
        setBroker(null);
      }
    } catch (err) {
      console.error("Failed to fetch broker status:", err);
      setBroker(null);
    } finally {
      setIsDataLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded) {
      fetchBrokerStatus();
    }
  }, [isLoaded, fetchBrokerStatus]);

  const user: User | null = clerkUser
    ? {
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          "Unnamed User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "No Email Associated",
        memberSince: new Date(clerkUser.createdAt || Date.now()).toLocaleDateString(),
        plan: "Active Free Plan",
        tradesPerMonthLimit: 100,
      }
    : null;

  const logout = useCallback(() => {
    setBroker(null);
  }, []);

  const disconnectBroker = useCallback(() => {
    Alert.alert("Disconnect Broker", "Are you sure you want to disconnect your broker?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: async () => {
          try {
            await fetchWithAuth("/broker/disconnect", getToken, { method: "POST" });
            setBroker(null);
            console.log("Broker disconnected successfully");
            Toast.show({
              type: "success",
              text1: "Broker Disconnected",
              text2: "Your broker was successfully disconnected.",
            });
          } catch (err) {
            console.error("Failed to disconnect broker:", err);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Could not disconnect broker. Please try again.",
            });
          }
        },
      },
    ]);
  }, [getToken]);

  const editProfile = useCallback(() => {
    console.log("Opening edit profile...");
  }, []);

  const upgradePlan = useCallback(() => {
    console.log("Upgrading plan...");
  }, []);

  return {
    user,
    broker,
    isLoading: !isLoaded || isDataLoading,
    logout,
    refreshBrokerStatus: fetchBrokerStatus,
    disconnectBroker,
    editProfile,
    upgradePlan,
  };
}
