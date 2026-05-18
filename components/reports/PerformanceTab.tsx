import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ReportData } from '../../hooks/useReportData';

const BentoCard = ({ children, title, style }: { children: React.ReactNode, title: string, style?: any }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const PerformanceTab = ({ data }: { data: ReportData['performance'] }) => {
  return (
    <View style={[styles.container, styles.contentContainer]}>
      
      {/* Row 1: Trade & Daily Performance */}
      <View style={styles.row}>
        {/* Trade Performance */}
        <BentoCard title="TRADE PERFORMANCE" style={styles.flex1}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#01c896' }]}>{data?.wins ?? 0}</Text>
              <Text style={styles.statLabel}>WIN</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#ff5451' }]}>{data?.losses ?? 0}</Text>
              <Text style={styles.statLabel}>LOSS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#8c909f' }]}>{data?.be ?? 0}</Text>
              <Text style={styles.statLabel}>B.E.</Text>
            </View>
          </View>
          <View style={styles.list}>
            <View style={styles.listItem}><Text style={styles.listText}>Avg Win / Loss</Text><Text style={styles.listValue}>₹{data?.avgWin?.toFixed(0) ?? 0} / ₹{data?.avgLoss?.toFixed(0) ?? 0}</Text></View>
            <View style={styles.listItem}><Text style={styles.listText}>Win Rate</Text><Text style={styles.listValue}>{data?.winRate?.toFixed(1) ?? 0}%</Text></View>
            <View style={styles.listItem}><Text style={styles.listText}>Expectancy</Text><Text style={[styles.listValue, { color: '#4d8eff' }]}>₹{data?.expectancy?.toFixed(0) ?? 0}</Text></View>
          </View>
        </BentoCard>

        {/* Daily Performance */}
        <BentoCard title="DAILY PERFORMANCE" style={styles.flex1}>
          <View style={styles.list}>
            <View style={[styles.listItemBg, { backgroundColor: '#1c2026' }]}>
              <Text style={styles.listTextLabel}>BEST DAY</Text>
              <Text style={[styles.listValue, { color: '#01c896' }]}>₹{data?.bestDay?.toFixed(0) ?? 0}</Text>
            </View>
            <View style={[styles.listItemBg, { backgroundColor: '#1c2026', marginTop: 8 }]}>
              <Text style={styles.listTextLabel}>WORST DAY</Text>
              <Text style={[styles.listValue, { color: '#ff5451' }]}>₹{data?.worstDay?.toFixed(0) ?? 0}</Text>
            </View>
          </View>
          <View style={[styles.statsRow, { marginTop: 16 }]}>
            <View style={styles.flex1}>
              <Text style={styles.listTextLabel}>AVG WIN DAY</Text>
              <Text style={styles.listValue}>₹{data?.avgWinDay?.toFixed(0) ?? 0}</Text>
            </View>
            <View style={[styles.flex1, { alignItems: 'flex-end' }]}>
              <Text style={styles.listTextLabel}>AVG LOSS DAY</Text>
              <Text style={styles.listValue}>₹{data?.avgLossDay?.toFixed(0) ?? 0}</Text>
            </View>
          </View>
        </BentoCard>
      </View>

      {/* Row 2: Trade Execution & Setup Effectiveness */}
      <View style={styles.row}>
        {/* Trade Execution */}
        <BentoCard title="TRADE EXECUTION" style={styles.flex1}>
          <View style={styles.executionHeader}>
            <Text style={styles.executionTotal}>{data?.totalTrades ?? 0}</Text>
            <Text style={styles.executionLabel}>Total Trades</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.list}>
            <View style={styles.listItem}><Text style={styles.listTextLabel}>AVG CAPITAL</Text><Text style={styles.listValue}>₹{data?.avgCapital?.toFixed(0) ?? 0}</Text></View>
            <View style={styles.listItem}><Text style={styles.listTextLabel}>BEST STRATEGY</Text><Text style={[styles.listValue, { color: '#4d8eff' }]}>{data?.bestStrategy ?? "-"}</Text></View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.streakBox, { borderColor: 'rgba(1, 200, 150, 0.1)' }]}>
              <Text style={[styles.streakValue, { color: '#01c896' }]}>{data?.streakW ?? 0}</Text>
              <Text style={styles.streakLabel}>STREAK W</Text>
            </View>
            <View style={[styles.streakBox, { borderColor: 'rgba(255, 84, 81, 0.1)' }]}>
              <Text style={[styles.streakValue, { color: '#ff5451' }]}>{data?.streakL ?? 0}</Text>
              <Text style={styles.streakLabel}>STREAK L</Text>
            </View>
          </View>
        </BentoCard>

        {/* Setup Effectiveness */}
        <BentoCard title="SETUP EFFECTIVENESS" style={styles.flex1}>
          {data?.setupEffectiveness?.slice(0, 4).map((setup, index) => (
            <View key={setup.name} style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{setup.name}</Text>
                <Text style={styles.progressValue}>{setup.winRate.toFixed(0)}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { 
                  width: `${setup.winRate}%` as any, 
                  backgroundColor: index % 2 === 0 ? '#4d8eff' : '#01c896' 
                }]} />
              </View>
            </View>
          ))}
          {(!data?.setupEffectiveness || data.setupEffectiveness.length === 0) && (
            <Text style={{color: '#8c909f', fontSize: 12, textAlign: 'center', marginTop: 20}}>No strategy data yet</Text>
          )}
        </BentoCard>
      </View>

      {/* Symbol Analysis & Trade Activity */}
      <View style={styles.row}>
        {/* Symbol Analysis */}
        <BentoCard title="SYMBOL ANALYSIS" style={styles.flex1}>
          <View style={styles.list}>
            <View style={styles.listItem}><Text style={styles.listText}>Most Traded</Text><Text style={styles.listValue}>{data?.mostTraded ?? "-"}</Text></View>
            <View style={styles.listItem}><Text style={styles.listText}>Most Profitable</Text><Text style={[styles.listValue, { color: '#01c896' }]}>{data?.mostProfitable ?? "-"}</Text></View>
            <View style={styles.listItem}><Text style={styles.listText}>Least Profitable</Text><Text style={[styles.listValue, { color: '#ff5451' }]}>{data?.leastProfitable ?? "-"}</Text></View>
            <View style={styles.listItem}><Text style={styles.listText}>Highest Win Rate</Text><Text style={styles.listValue}>{data?.highestWinRate ?? "-"}</Text></View>
          </View>
        </BentoCard>

        {/* Trade Activity */}
        <BentoCard title="TRADE ACTIVITY" style={styles.flex1}>
          <View style={styles.activityContainer}>
            <View style={styles.activityBox}>
              <Text style={styles.activityValue}>{data?.avgTradesPerDay?.toFixed(1) ?? 0}</Text>
              <Text style={styles.activityLabel}>AVG/DAY</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityBox}>
              <Text style={styles.activityValue}>-</Text>
              <Text style={styles.activityLabel}>MAX/DAY</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityBox}>
              <Text style={[styles.activityValue, { color: '#ff5451' }]}>-</Text>
              <Text style={styles.activityLabel}>OVERTRADES</Text>
            </View>
          </View>
        </BentoCard>
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
  row: {
    flexDirection: 'column',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  card: {
    backgroundColor: '#262a31',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(140, 144, 159, 0.1)',
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#c2c6d6',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    color: '#c2c6d6',
    marginTop: 4,
  },
  list: {
    gap: 12,
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemBg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  listText: {
    fontSize: 12,
    color: '#c2c6d6',
  },
  listTextLabel: {
    fontSize: 10,
    color: '#c2c6d6',
    fontWeight: '600',
  },
  listValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dfe2eb',
  },
  executionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  executionTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  executionLabel: {
    fontSize: 12,
    color: '#c2c6d6',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(140, 144, 159, 0.1)',
    marginVertical: 12,
  },
  streakBox: {
    flex: 1,
    backgroundColor: '#181c22',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 12,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 8,
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#dfe2eb',
  },
  progressValue: {
    fontSize: 10,
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
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  activityBox: {
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
  activityLabel: {
    fontSize: 9,
    color: '#c2c6d6',
    marginTop: 4,
  },
  activityDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(140, 144, 159, 0.2)',
  },
  dynamicsBox: {
    backgroundColor: '#0a0e14',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  dynamicsLabel: {
    fontSize: 9,
    color: '#c2c6d6',
    marginBottom: 4,
  },
  dynamicsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dfe2eb',
  },
});

export default PerformanceTab;
