import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function NetworkStatus() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);
  
  // netInfo.isConnected is boolean | null
  const isConnected = netInfo.isConnected;

  const translateY = useSharedValue(-150);

  useEffect(() => {
    if (isConnected === false) {
      setIsOffline(true);
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    } else if (isConnected === true && isOffline) {
      translateY.value = withDelay(
        1500, // Show green for 1.5s before hiding
        withTiming(-150, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        })
      );
      setTimeout(() => setIsOffline(false), 2000);
    }
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isOffline && isConnected !== false) return null;

  const backgroundColor = isConnected === false ? "#ff5451" : "#43e5b1";
  const message = isConnected === false ? "No Internet Connection" : "Back Online";

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { paddingTop: insets.top > 0 ? insets.top + 10 : 30, backgroundColor },
      ]}
    >
      <View style={styles.content}>
        {isConnected === false && (
          <MaterialIcons name="wifi-off" size={16} color="white" style={styles.icon} />
        )}
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
