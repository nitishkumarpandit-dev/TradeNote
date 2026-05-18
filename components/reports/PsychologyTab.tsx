import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ReportData } from '../../hooks/useReportData';

const EmotionBar = ({ label, icon, color, percentage }: { label: string, icon: any, color: string, percentage: string }) => (
  <View style={styles.emotionRow}>
    <View style={styles.emotionHeader}>
      <View style={styles.emotionLabelContainer}>
        <MaterialIcons name={icon} size={16} color={color} style={{ marginRight: 6 }} />
        <Text style={[styles.emotionLabel, { color }]}>{label}</Text>
      </View>
      <Text style={styles.emotionPercentage}>{percentage}</Text>
    </View>
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: percentage as any, backgroundColor: color }]} />
    </View>
  </View>
);

const EmotionRRCard = ({ label, icon, color, ratio, iconName }: { label: string, icon: any, color: string, ratio: string, iconName: any }) => (
  <View style={styles.rrCard}>
    <View style={styles.rrHeader}>
      <Text style={styles.rrLabel}>{label}</Text>
      <MaterialIcons name={iconName} size={16} color={color} />
    </View>
    <View style={styles.rrValueContainer}>
      <Text style={styles.rrValue}>{ratio}</Text>
      <Text style={styles.rrRatioText}>Ratio</Text>
    </View>
  </View>
);

const EMOTION_STYLES: Record<string, { icon: any, color: string, iconName: any }> = {
  "Calm": { icon: "sentiment-satisfied", color: "#43e5b1", iconName: "trending-up" },
  "Frustrated": { icon: "sentiment-very-dissatisfied", color: "#ff5451", iconName: "trending-down" },
  "Overconfident": { icon: "bolt", color: "#adc6ff", iconName: "warning" },
  "Anxious": { icon: "warning", color: "#fbbf24", iconName: "waves" },
  "Impatient": { icon: "timer-off", color: "#e879f9", iconName: "schedule" },
};

const getEmotionStyle = (emotion: string) => {
  return EMOTION_STYLES[emotion] || { icon: "face", color: "#8c909f", iconName: "horizontal-rule" };
};

const PsychologyTab = ({ data }: { data: ReportData['psychology'] }) => {
  return (
    <View style={[styles.container, styles.contentContainer]}>
      
      {/* Emotional State Distribution */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emotional State</Text>
          <Text style={styles.sectionSubtitle}>Frequency (%)</Text>
        </View>
        <View style={styles.card}>
          {data?.emotionFreq?.map((item) => {
            const style = getEmotionStyle(item.name);
            return (
              <EmotionBar 
                key={item.name} 
                label={item.name} 
                icon={style.icon} 
                color={style.color} 
                percentage={`${item.percentage.toFixed(1)}%`} 
              />
            );
          })}
          {(!data?.emotionFreq || data.emotionFreq.length === 0) && (
            <Text style={{color: '#8c909f', fontSize: 12, textAlign: 'center'}}>No emotion data available</Text>
          )}
        </View>
      </View>

      {/* R:R by Emotion */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Avg R:R by Emotion</Text>
          <MaterialIcons name="info-outline" size={16} color="#8c909f" />
        </View>
        <View style={styles.grid}>
          {data?.emotionRR?.map((item) => {
            const style = getEmotionStyle(item.name);
            return (
              <EmotionRRCard 
                key={item.name} 
                label={item.name.toUpperCase()} 
                icon={style.icon} 
                color={style.color} 
                ratio={`1:${item.avgRR.toFixed(1)}`} 
                iconName={style.iconName} 
              />
            );
          })}
          {(!data?.emotionRR || data.emotionRR.length === 0) && (
            <Text style={{color: '#8c909f', fontSize: 12, textAlign: 'center', marginTop: 20}}>No RR data available</Text>
          )}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8c909f',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#262a31',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.05)',
  },
  emotionRow: {
    gap: 8,
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  emotionPercentage: {
    fontSize: 14,
    color: '#c2c6d6',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1c2026',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  grid: {
    gap: 12,
  },
  rrCard: {
    backgroundColor: '#1c2026',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.1)',
  },
  rrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rrLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8c909f',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rrValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rrValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  rrRatioText: {
    fontSize: 12,
    color: '#8c909f',
    fontWeight: '500',
  },
});

export default PsychologyTab;
