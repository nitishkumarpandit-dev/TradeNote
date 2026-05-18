import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PieChart } from 'react-native-chart-kit';

interface DonutChartProps {
  wins: number;
  losses: number;
  winRate: number;
}

export const DonutChart = ({ wins, losses, winRate }: DonutChartProps) => {
  const data = [
    {
      name: 'Wins',
      population: wins,
      color: '#039f78ff',
      legendFontColor: '#c2c6d6',
      legendFontSize: 12,
    },
    {
      name: 'Losses',
      population: losses,
      color: '#ff5451',
      legendFontColor: '#c2c6d6',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const isEmpty = wins + losses === 0;

  if (isEmpty) {
    return (
      <Animated.View 
        entering={FadeInDown.duration(600).delay(200).springify()}
        className="bg-card p-8 rounded-2xl border border-card-secondary items-center justify-center w-full"
      >
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4 border border-dashed border-primary/30">
          <Text className="text-primary text-xl font-bold">0%</Text>
        </View>
        <Text className="text-text-primary text-base font-bold">No Win/Loss Data</Text>
        <Text className="text-text-secondary text-xs mt-2 text-center">
          Add some trades to see your win rate distribution.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(200).springify()}
      className="bg-card p-5 rounded-2xl border border-card-secondary items-center"
    >
      <View className="flex-row justify-between w-full mb-4">
        <Text className="text-text-primary text-base font-bold">Win/Loss Dist.</Text>
      </View>
      
      <View className="relative items-center justify-center">
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 80}
          height={180}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
          hasLegend={false}
        />
        {/* Donut hole for centered text */}
        <View 
          className="absolute bg-card items-center justify-center rounded-full"
          style={{ width: 100, height: 100 }}
        >
          <Text className="text-text-primary text-2xl font-bold">{winRate}%</Text>
          <Text className="text-text-secondary text-[10px] uppercase font-bold">Win Rate</Text>
        </View>
      </View>
      
      <View className="flex-row justify-center mt-4 gap-6">
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-success mr-2" />
          <Text className="text-text-secondary text-xs">{wins} Wins</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-danger mr-2" />
          <Text className="text-text-secondary text-xs">{losses} Losses</Text>
        </View>
      </View>
    </Animated.View>
  );
};
