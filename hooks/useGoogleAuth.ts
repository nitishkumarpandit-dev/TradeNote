import { useSignInWithGoogle } from "@clerk/expo/google";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { AUTH_ROUTES } from "@/constants/auth";
import { useState } from "react";

export function useGoogleAuth() {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (isGoogleLoading) return;
    
    // Native Google Authentication requires iOS or Android platform
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      Toast.show({
        type: "error",
        text1: "Unsupported Platform",
        text2: "Google authentication only works on iOS and Android devices for this app.",
      });
      return;
    }

    try {
      setIsGoogleLoading(true);
      const { createdSessionId, setActive, signIn, signUp } = await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace(AUTH_ROUTES.app as any);
      } else {
        // If there is no createdSessionId, this usually means more steps are required 
        // like MFA or finishing sign up
        console.warn("Sign in/up requires further action:", { signIn, signUp });
      }
    } catch (err: any) {
      if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5" || err.message?.includes('cancel')) {
        return;
      }
      const errorDetails = JSON.stringify(err, null, 2);
      console.error("Sign in with Google error:", errorDetails);
      Toast.show({
        type: "error",
        text1: "Google Sign-In Error",
        text2: err.message || "An error occurred during Google authentication.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return { handleGoogleAuth, isGoogleLoading };
}
