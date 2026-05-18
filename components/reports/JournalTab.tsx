import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ReportData } from '../../hooks/useReportData';

const ExecutionCard = ({ title, desc, count, icon, color, bgColor }: any) => (
  <View style={styles.execCard}>
    <View style={styles.execHeader}>
      <View style={[styles.execIconBg, { backgroundColor: bgColor }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.execCount}>{count}</Text>
    </View>
    <Text style={styles.execTitle}>{title}</Text>
    <Text style={styles.execDesc}>{desc}</Text>
  </View>
);

const JournalTab = ({ data }: { data: ReportData['journal'] }) => {
  const total = data?.totalTrades || 1;
  const targetAchievedPercent = (data?.targetAchievedCount / total) * 100 || 0;
  const targetMissedPercent = 100 - targetAchievedPercent;
  const stoppedPercent = (data?.stoppedBeforeTargetCount / total) * 100 || 0;

  // For the flow chart, we want to normalize the data to 0-100% heights
  const flowData = data?.dailyNetPnl || [];
  const maxPnl = Math.max(...flowData.map(d => Math.abs(d.value)), 1); // Avoid division by zero

  return (
    <View style={[styles.container, styles.contentContainer]}>
      
      {/* Target Outcome Metrics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TARGET OUTCOME METRICS</Text>
          <View style={styles.liveTag}>
            <Text style={styles.liveTagText}>LIVE STATS</Text>
          </View>
        </View>

        <View style={styles.efficiencyCard}>
          <View style={styles.efficiencyHeader}>
            <View>
              <Text style={styles.efficiencyLabel}>OVERALL EFFICIENCY</Text>
              <View style={styles.efficiencyValueRow}>
                <Text style={styles.efficiencyValue}>{targetAchievedPercent.toFixed(0)}%</Text>
                <Text style={styles.efficiencySubValue}>Targets Achieved</Text>
              </View>
            </View>
            <View style={styles.starBg}>
              <MaterialIcons name="star" size={24} color="#43e5b1" />
            </View>
          </View>

          <View style={styles.efficiencyStatsRow}>
            <View style={styles.effStatBox}>
              <Text style={styles.effStatLabel}>AVG R (ACHIEVED)</Text>
              <Text style={[styles.effStatValue, { color: '#43e5b1' }]}>1:2.5</Text>
            </View>
            <View style={styles.effStatBox}>
              <Text style={styles.effStatLabel}>AVG R (MISSED)</Text>
              <Text style={[styles.effStatValue, { color: '#ff5451' }]}>1:0.8</Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>TARGET MISSED</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>{targetMissedPercent.toFixed(0)}%</Text>
              <View style={styles.metricBarBg}>
                <View style={[styles.metricBarFill, { width: `${targetMissedPercent}%` as any, backgroundColor: '#ff5451' }]} />
              </View>
            </View>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>STOPPED BEFORE TARGET</Text>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricValue, { color: '#ff5451' }]}>{stoppedPercent.toFixed(0)}%</Text>
              <MaterialIcons name="cancel-schedule-send" size={24} color="rgba(255, 84, 81, 0.4)" />
            </View>
          </View>
        </View>
      </View>

      {/* Execution & Psychology */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EXECUTION & PSYCHOLOGY</Text>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: '#43e5b1' }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.execGrid}>
          <ExecutionCard 
            title="Full Success" desc="Perfect plan execution" count={`${data?.fullSuccess ?? 0}/${total}`} 
            icon="verified" color="#43e5b1" bgColor="rgba(67, 229, 177, 0.1)" 
          />
          <ExecutionCard 
            title="Partial Success" desc="Managed exits well" count={`${data?.partialSuccess ?? 0}/${total}`} 
            icon="published-with-changes" color="#adc6ff" bgColor="rgba(173, 198, 255, 0.1)" 
          />
          <ExecutionCard 
            title="Followed Plan" desc="Disciplined adherence" count={`${data?.followedPlan ?? 0}/${total}`} 
            icon="assignment" color="#8c909f" bgColor="#0a0e14" 
          />
          <ExecutionCard 
            title="Mistake" desc="Deviated from strategy" count={`${data?.mistakeCount ?? 0}/${total}`} 
            icon="warning" color="#ff5451" bgColor="rgba(255, 84, 81, 0.1)" 
          />
        </View>
      </View>

      {/* Journal Flow */}
      <View style={styles.flowCard}>
        <View style={styles.flowHeader}>
          <View>
            <Text style={styles.flowTitle}>Journal Flow</Text>
            <Text style={styles.flowSubtitle}>Visualizing your daily net PNL</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.flowDetails}>DETAILS</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#adc6ff" />
          </View>
        </View>

        <View style={styles.flowChartArea}>
          {flowData.length > 0 ? flowData.slice(-15).map((d, i) => {
            const height = (Math.abs(d.value) / maxPnl) * 100;
            const color = d.value >= 0 ? '#43e5b1' : '#ff5451';
            return (
              <View key={i} style={[styles.flowBar, { height: `${Math.max(height, 5)}%`, backgroundColor: color }]} />
            );
          }) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#8c909f', fontSize: 10 }}>Not enough data for chart</Text>
            </View>
          )}
        </View>
        <View style={styles.flowLabels}>
          {flowData.length >= 3 && (
            <>
              <Text style={styles.flowLabelText}>{flowData[0]?.date.slice(5) ?? ''}</Text>
              <Text style={styles.flowLabelText}>{flowData[Math.floor(flowData.length/2)]?.date.slice(5) ?? ''}</Text>
              <Text style={styles.flowLabelText}>{flowData[flowData.length-1]?.date.slice(5) ?? ''}</Text>
            </>
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
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8c909f',
    letterSpacing: 1,
  },
  liveTag: {
    backgroundColor: 'rgba(173, 198, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#adc6ff',
  },
  efficiencyCard: {
    backgroundColor: '#262a31',
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  efficiencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  efficiencyLabel: {
    fontSize: 10,
    color: '#c2c6d6',
    fontWeight: '500',
    letterSpacing: 1,
  },
  efficiencyValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    gap: 4,
  },
  efficiencyValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#dfe2eb',
  },
  efficiencySubValue: {
    fontSize: 12,
    color: 'rgba(194, 198, 214, 0.6)',
  },
  starBg: {
    backgroundColor: '#0a0e14',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.2)',
  },
  efficiencyStatsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  effStatBox: {
    flex: 1,
    backgroundColor: '#181c22',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.1)',
  },
  effStatLabel: {
    fontSize: 10,
    color: '#c2c6d6',
    marginBottom: 4,
  },
  effStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#262a31',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricLabel: {
    fontSize: 10,
    color: '#c2c6d6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  metricBarBg: {
    width: 48,
    height: 4,
    backgroundColor: '#1c2026',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  metricBarFill: {
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#424754',
  },
  execGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  execCard: {
    width: '48%',
    backgroundColor: '#262a31',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.1)',
  },
  execHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  execIconBg: {
    padding: 8,
    borderRadius: 8,
  },
  execCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c2c6d6',
  },
  execTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  execDesc: {
    fontSize: 10,
    color: '#c2c6d6',
    marginTop: 4,
  },
  flowCard: {
    backgroundColor: '#181c22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.05)',
  },
  flowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  flowSubtitle: {
    fontSize: 10,
    color: '#c2c6d6',
    marginTop: 2,
  },
  flowDetails: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#adc6ff',
    marginRight: 4,
  },
  flowChartArea: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  flowBar: {
    flex: 1,
    backgroundColor: 'rgba(38, 42, 49, 0.5)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  flowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  flowLabelText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#c2c6d6',
  },
});

export default JournalTab;
