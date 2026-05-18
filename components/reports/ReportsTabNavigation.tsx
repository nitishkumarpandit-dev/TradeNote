import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export type ReportTab = 'Performance' | 'Psychology' | 'Risk' | 'Journal';

interface Props {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const TABS: ReportTab[] = ['Performance', 'Psychology', 'Risk', 'Journal'];

const ReportsTabNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabChange(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181c22',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#43e5b1', // emerald color
  },
  tabText: {
    color: '#8c909f',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#43e5b1',
    fontWeight: '700',
  },
});

export default ReportsTabNavigation;
