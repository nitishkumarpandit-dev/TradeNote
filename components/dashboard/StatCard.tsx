import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  color = "#4d8eff",
}: StatCardProps) => {
  return (
    <View className="bg-card p-5 rounded-2xl min-w-40 mr-4 border border-card-secondary">
      <View className="flex-row items-center mb-2">
        <View
          className="p-2 rounded-lg mr-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        </View>
        <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">
          {title}
        </Text>
      </View>
      <Text className="text-text-primary text-2xl font-bold">{value}</Text>
    </View>
  );
};
