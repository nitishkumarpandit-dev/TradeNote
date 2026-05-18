import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';

export const ReportsSkeleton = () => {
  return (
    <View style={[styles.container, styles.contentContainer]}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <View style={styles.statsRow}>
            <Skeleton width="30%" height={36} />
            <Skeleton width="30%" height={36} />
            <Skeleton width="30%" height={36} />
          </View>
          <View style={{ gap: 12, marginTop: 16 }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
          </View>
        </View>

        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <View style={{ gap: 12 }}>
            <Skeleton width="100%" height={40} borderRadius={8} />
            <Skeleton width="100%" height={40} borderRadius={8} />
          </View>
          <View style={[styles.statsRow, { marginTop: 16 }]}>
            <Skeleton width="45%" height={30} />
            <Skeleton width="45%" height={30} />
          </View>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <Skeleton width={60} height={40} style={{ marginBottom: 16 }} />
          <View style={{ gap: 12 }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
          </View>
        </View>

        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <View style={{ gap: 16 }}>
            <View>
              <Skeleton width="100%" height={12} style={{ marginBottom: 4 }} />
              <Skeleton width="100%" height={6} borderRadius={3} />
            </View>
            <View>
              <Skeleton width="100%" height={12} style={{ marginBottom: 4 }} />
              <Skeleton width="100%" height={6} borderRadius={3} />
            </View>
            <View>
              <Skeleton width="100%" height={12} style={{ marginBottom: 4 }} />
              <Skeleton width="100%" height={6} borderRadius={3} />
            </View>
          </View>
        </View>
      </View>
      
      {/* Row 3 */}
      <View style={styles.row}>
        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <View style={{ gap: 12 }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
          </View>
        </View>
        <View style={[styles.card, styles.flex1]}>
          <Skeleton width={120} height={14} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Skeleton width="28%" height={40} />
            <Skeleton width="28%" height={40} />
            <Skeleton width="28%" height={40} />
          </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
});
