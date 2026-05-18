import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#01c896",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#10141a",
          borderTopWidth: 1,
          borderTopColor: "#262a31",
          height: Platform.OS === "ios" ? 88 : 64 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : insets.bottom + 8,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="DashboardScreen"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              size={24}
              name="view-dashboard"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ChecklistScreen"
        options={{
          title: "Checklist",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              size={24}
              name="checkbox-marked-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AISummarizerScreen"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ReportsScreen"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons size={24} name="chart-box" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
