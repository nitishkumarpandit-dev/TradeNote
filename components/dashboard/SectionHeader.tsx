import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  className?: string;
}

export const SectionHeader = ({ title, onViewAll, className = '' }: SectionHeaderProps) => {
  return (
    <View className={`flex-row justify-between items-center mb-4 ${className}`}>
      <Text className="text-text-primary text-xl font-bold">{title}</Text>
      {onViewAll && (
        <Pressable onPress={onViewAll}>
          <Text className="text-primary text-xs font-bold uppercase tracking-widest">View All</Text>
        </Pressable>
      )}
    </View>
  );
};
