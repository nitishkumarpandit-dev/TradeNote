// components/checklist/ChecklistSkeleton.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../common/Skeleton";

/** Skeleton for a single checklist item card */
function ChecklistItemSkeleton() {
  return (
    <View style={styles.itemCard}>
      {/* Checkbox */}
      <Skeleton width={24} height={24} borderRadius={8} />
      {/* Title text */}
      <View style={styles.itemTextArea}>
        <Skeleton width="75%" height={14} borderRadius={6} />
      </View>
      {/* Edit icon */}
      <Skeleton width={32} height={32} borderRadius={10} />
    </View>
  );
}

/** Skeleton for a section header */
function SectionHeaderSkeleton() {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <Skeleton width={20} height={20} borderRadius={10} />
        <Skeleton width={160} height={13} borderRadius={4} />
      </View>
      <Skeleton width={42} height={42} borderRadius={18} />
    </View>
  );
}

/** Skeleton for the progress cards row */
function ProgressRowSkeleton() {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressCard}>
        <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width={50} height={28} borderRadius={6} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={6} borderRadius={3} />
      </View>
      <View style={styles.progressCard}>
        <Skeleton width={80} height={9} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width={50} height={28} borderRadius={6} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={6} borderRadius={3} />
      </View>
    </View>
  );
}

/** Full checklist tab skeleton */
export function ChecklistSkeleton() {
  return (
    <View style={styles.container}>
      {/* Progress cards */}
      <ProgressRowSkeleton />

      <View style={styles.sections}>
        {/* Pre-Market Section */}
        <SectionHeaderSkeleton />
        {[1, 2, 3, 4, 5].map((i) => (
          <ChecklistItemSkeleton key={`pre-${i}`} />
        ))}

        {/* Post-Market Section */}
        <SectionHeaderSkeleton />
        {[1, 2, 3, 4, 5].map((i) => (
          <ChecklistItemSkeleton key={`post-${i}`} />
        ))}

        {/* Notes Section */}
        <SectionHeaderSkeleton />
        <View style={styles.notesCard}>
          <Skeleton width="100%" height={14} borderRadius={6} style={{ marginBottom: 10 }} />
          <Skeleton width="90%" height={14} borderRadius={6} style={{ marginBottom: 10 }} />
          <Skeleton width="60%" height={14} borderRadius={6} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressCard: {
    flex: 1,
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sections: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 24,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c2026",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  itemTextArea: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  notesCard: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
});
