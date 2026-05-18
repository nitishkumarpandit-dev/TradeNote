// components/checklist/AnalysisSkeleton.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../common/Skeleton";

/** Skeleton for the Analysis tab cards */
export function AnalysisSkeleton() {
  return (
    <View style={styles.container}>
      {/* Stats Grid (2 rows of 2) */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={styles.card}>
             <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
             <Skeleton width={60} height={20} borderRadius={6} />
          </View>
          <View style={styles.card}>
             <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
             <Skeleton width={60} height={20} borderRadius={6} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.card}>
             <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
             <Skeleton width={60} height={20} borderRadius={6} />
          </View>
          <View style={styles.card}>
             <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
             <Skeleton width={60} height={20} borderRadius={6} />
          </View>
        </View>
      </View>

      {/* Chart Card (Line) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Skeleton width={150} height={18} borderRadius={4} />
          <Skeleton width={6} height={6} borderRadius={3} />
        </View>
        <Skeleton width="100%" height={200} borderRadius={16} style={{ marginTop: 24 }} />
      </View>

      {/* Chart Card (Bar) */}
      <View style={styles.chartCard}>
        <Skeleton width={150} height={18} borderRadius={4} style={{ marginBottom: 24 }} />
        <Skeleton width="100%" height={200} borderRadius={16} />
      </View>

      {/* AI Insight Card */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Skeleton width={100} height={14} borderRadius={4} />
        </View>
        <View style={styles.innerInsight}>
           <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
           <Skeleton width="80%" height={14} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  grid: {
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  chartCard: {
    backgroundColor: "#1c2026",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  insightCard: {
    backgroundColor: "#1c2026",
    borderRadius: 32,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  insightHeader: {
    marginBottom: 20,
  },
  innerInsight: {
    backgroundColor: "#0a0e14",
    borderRadius: 16,
    padding: 16,
  }
});
