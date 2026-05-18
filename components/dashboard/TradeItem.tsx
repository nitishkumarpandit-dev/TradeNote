import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface TradeItemProps {
  symbol: string;
  date: string;
  pnl: string;
  rr: string;
  type: "LONG" | "SHORT";
  status: "WIN" | "LOSS";
}

export const TradeItem = ({
  symbol,
  date,
  pnl,
  rr,
  type,
  status,
}: TradeItemProps) => {
  const isWin = status === "WIN";
  const color = isWin ? "#01c896" : "#ff5451";

  return (
    <Pressable
      className="bg-card p-4 rounded-2xl mb-3 border border-card-secondary flex-row justify-between items-center"
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="p-2 rounded-full mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <MaterialCommunityIcons
            name={isWin ? "arrow-up-right" : "arrow-down-left"}
            size={24}
            color={color}
          />
        </View>
        <View>
          <View className="flex-row items-center">
            <Text className="text-text-primary font-bold text-base mr-2">
              {symbol}
            </Text>
            <View
              className={`px-2 py-0.5 rounded-md ${type === "LONG" ? "bg-success/20" : "bg-danger/20"}`}
            >
              <Text
                className={`text-[10px] font-bold ${type === "LONG" ? "text-success" : "text-danger"}`}
              >
                {type}
              </Text>
            </View>
          </View>
          <Text className="text-text-secondary text-xs mt-1 uppercase tracking-tight">
            {date}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`font-bold text-base ${isWin ? "text-success" : "text-danger"}`}
        >
          {isWin ? "+" : ""}
          {pnl}
        </Text>
        <Text className="text-text-secondary text-xs mt-1">{rr} RR</Text>
      </View>
    </Pressable>
  );
};
