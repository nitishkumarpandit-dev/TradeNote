import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ReportData } from '../../hooks/useReportData';

const RiskTab = ({ data }: { data: ReportData['risk'] }) => {
  return (
    <View style={[styles.container, styles.contentContainer]}>
      
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.title}>Risk Management</Text>
            <Text style={styles.subtitle}>Operational safety and capital preservation metrics</Text>
          </View>
          <View style={styles.iconBg}>
            <MaterialIcons name="security" size={20} color="#adc6ff" />
          </View>
        </View>

        <View style={styles.bentoGrid}>
          <View style={[styles.bentoBox, styles.flex1]}>
            <Text style={styles.boxLabel}>PLANNED R:R</Text>
            <View style={styles.valueRow}>
              <Text style={styles.boxValue}>1:2.0</Text>
              <Text style={styles.boxUnit}>ratio</Text>
            </View>
          </View>
          <View style={[styles.bentoBox, styles.flex1]}>
            <Text style={styles.boxLabel}>REALIZED R:R</Text>
            <View style={styles.valueRow}>
              <Text style={styles.boxValue}>1:{data?.realizedRR?.toFixed(1) ?? 0}</Text>
              <Text style={styles.boxUnit}>ratio</Text>
            </View>
          </View>
        </View>

        <View style={[styles.bentoBox, styles.fullWidthBox, { marginTop: 12 }]}>
          <View>
            <Text style={styles.boxLabel}>AVG LOSS</Text>
            <Text style={[styles.boxValue, { color: '#ff5451' }]}>${Math.abs(data?.avgLoss ?? 0).toFixed(0)}</Text>
          </View>
          <View style={styles.lossBarBg}>
            <View style={[styles.lossBarFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={[styles.bentoBox, styles.fullWidthBox, { marginTop: 12 }]}>
          <View>
            <Text style={styles.boxLabel}>MAX DRAWDOWN</Text>
            <Text style={styles.boxValue}>${data?.maxDrawdown?.toFixed(0) ?? 0}</Text>
          </View>
          <MaterialIcons name="trending-down" size={24} color="#8c909f" />
        </View>

        <View style={styles.expectancyCard}>
          <View style={styles.expectancyRow}>
            <View>
              <Text style={styles.expectancyLabel}>EXPECTANCY</Text>
              <View style={styles.valueRow}>
                <Text style={styles.expectancyValue}>${data?.expectancy?.toFixed(0) ?? 0}</Text>
                <Text style={styles.expectancyUnit}>per R</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.expectancyLabel}>SYSTEM EDGE</Text>
              <Text style={styles.edgeValue}>{(data?.expectancy ?? 0) > 0 ? "Positive" : "Negative"}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { marginBottom: 16 }]}>Risk Distribution</Text>
        <View style={styles.chartArea}>
          {/* Mock Chart bars */}
          {[20, 30, 60, 40, 25, 15, 35].map((height, i) => (
            <View key={i} style={[styles.chartBar, { height: height, backgroundColor: i === 2 ? 'rgba(173, 198, 255, 0.4)' : '#31353c' }]} />
          ))}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>LOW RISK</Text>
          <Text style={styles.chartLabel}>OPTIMIZED</Text>
          <Text style={styles.chartLabel}>OVER LEVERAGED</Text>
        </View>
      </View>

      <View style={styles.insightsCard}>
        <MaterialIcons name="lightbulb-outline" size={24} color="#43e5b1" />
        <View style={styles.insightsTextContainer}>
          <Text style={styles.insightsTitle}>Risk Analyst AI</Text>
          <Text style={styles.insightsBody}>Your risk parameters are currently within safe limits. Maintain the 1:2 ratio for the next 5 trades to establish a statistical baseline.</Text>
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
    gap: 16,
  },
  card: {
    backgroundColor: '#262a31',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  subtitle: {
    fontSize: 12,
    color: '#8c909f',
    marginTop: 4,
  },
  iconBg: {
    backgroundColor: '#0a0e14',
    padding: 8,
    borderRadius: 8,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  bentoBox: {
    backgroundColor: '#1c2026',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 144, 159, 0.1)',
  },
  fullWidthBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8c909f',
    letterSpacing: 1,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  boxValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#dfe2eb',
  },
  boxUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8c909f',
  },
  lossBarBg: {
    width: 64,
    height: 4,
    backgroundColor: '#31353c',
    borderRadius: 2,
    overflow: 'hidden',
  },
  lossBarFill: {
    height: '100%',
    backgroundColor: '#ff5451',
  },
  expectancyCard: {
    marginTop: 16,
    backgroundColor: 'rgba(77, 142, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 142, 255, 0.2)',
  },
  expectancyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  expectancyLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#adc6ff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  expectancyValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#dfe2eb',
  },
  expectancyUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#adc6ff',
  },
  edgeValue: {
    fontSize: 14,
    color: '#c2c6d6',
  },
  chartArea: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 8,
  },
  chartBar: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8c909f',
  },
  insightsCard: {
    backgroundColor: '#1c2026',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#43e5b1',
  },
  insightsTextContainer: {
    flex: 1,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dfe2eb',
    marginBottom: 4,
  },
  insightsBody: {
    fontSize: 12,
    color: '#c2c6d6',
    lineHeight: 18,
  },
});

export default RiskTab;
