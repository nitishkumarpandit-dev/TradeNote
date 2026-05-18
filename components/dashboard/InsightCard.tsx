import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface InsightCardProps {
  title: string;
  count: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  onPress?: () => void;
}

export const InsightCard = ({
  title,
  count,
  icon,
  color,
  onPress,
}: InsightCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-card p-3 rounded-xl flex-1 border border-card-secondary"
      style={({ pressed }) => [{ 
        transform: [{ scale: pressed ? 0.98 : 1 }],
        borderBottomWidth: 3, 
        borderBottomColor: color 
      }]}
    >
      <View className="flex-row justify-between items-center mb-2">
        <MaterialCommunityIcons name={icon} size={16} color={color} />
        <MaterialCommunityIcons name="arrow-top-right" size={14} color="#6b7280" />
      </View>
      <Text className="text-text-primary text-[11px] font-bold" numberOfLines={1}>
        {title}
      </Text>
      <Text className="text-text-secondary text-[9px] mt-1" numberOfLines={1}>
        {count}
      </Text>
    </Pressable>
  );
};
