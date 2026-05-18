import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps extends ViewProps {
  progress: number;
  label: string;
  description?: string;
}

export const ProgressBar = ({ progress, label, description }: ProgressBarProps) => {
  return (
    <View className="bg-card p-5 rounded-2xl border border-card-secondary">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text-primary text-base font-bold">{label}</Text>
        <Text className="text-text-primary text-sm font-bold">{progress}%</Text>
      </View>
      
      <View className="h-3 bg-card-secondary rounded-full overflow-hidden mb-4">
        <LinearGradient
          colors={['#ff5451', '#f9c449', '#01c896']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${progress}%`, height: '100%' }}
        />
        {/* Progress indicator knob */}
        <View 
          className="absolute h-4 w-1 bg-white" 
          style={{ left: `${progress}%`, top: -2, transform: [{ translateX: -0.5 }] }} 
        />
      </View>
      
      {description && (
        <Text className="text-text-secondary text-xs leading-5">
          {description}
        </Text>
      )}
    </View>
  );
};
