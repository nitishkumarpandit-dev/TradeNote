import { useUser } from "@clerk/expo";
import React from "react";
import { Image, Text, View } from "react-native";

interface ProfileAvatarProps {
  size?: number;
}

export const ProfileAvatar = ({ size = 48 }: ProfileAvatarProps) => {
  const { user } = useUser();

  // If we have an image URL from Clerk, render it
  if (user?.imageUrl) {
    return (
      <Image
        source={{ uri: user.imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  // Fallback to initials
  const firstNameLabel = user?.firstName ? user.firstName[0].toUpperCase() : "";
  const lastNameLabel = user?.lastName ? user.lastName[0].toUpperCase() : "";
  const fallbackLabel = firstNameLabel || lastNameLabel ? `${firstNameLabel}${lastNameLabel}` : "Me";

  return (
    <View
      className="bg-card-secondary items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-text-primary text-xs font-bold">
        {fallbackLabel}
      </Text>
    </View>
  );
};
