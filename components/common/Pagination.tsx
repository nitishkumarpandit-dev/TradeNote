// components/common/Pagination.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MAX_DOTS = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize?: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  label?: string; // e.g., "TRADES", "RULES", "MISTAKES"
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 5,
  onPrev,
  onNext,
  onGoTo,
  label = "ITEMS",
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  // Show up to MAX_DOTS dots; slide window around current page
  const dotCount = Math.min(totalPages, MAX_DOTS);
  let startPage = Math.max(1, currentPage - Math.floor(dotCount / 2));
  const endPage = Math.min(totalPages, startPage + dotCount - 1);
  if (endPage - startPage < dotCount - 1) {
    startPage = Math.max(1, endPage - dotCount + 1);
  }
  const dotPages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <View style={styles.container}>
      {/* Counter */}
      <Text style={styles.counter}>
        SHOWING {start}–{end} OF {totalCount} {label.toUpperCase()}
      </Text>

      {/* Controls row */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.arrowBtn, currentPage === 1 && styles.arrowDisabled]}
          onPress={onPrev}
          disabled={currentPage === 1}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="chevron-left"
            size={20}
            color={currentPage === 1 ? "#424754" : "#dfe2eb"}
          />
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dots}>
          {dotPages.map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => onGoTo(page)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View
                style={[
                  styles.dot,
                  page === currentPage ? styles.dotActive : styles.dotInactive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.arrowBtn,
            currentPage === totalPages && styles.arrowDisabled,
          ]}
          onPress={onNext}
          disabled={currentPage === totalPages}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={currentPage === totalPages ? "#424754" : "#dfe2eb"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 14, paddingVertical: 8 },
  counter: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#262a31",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  arrowDisabled: { opacity: 0.4 },
  dots: { flexDirection: "row", gap: 8, alignItems: "center" },
  dot: { borderRadius: 999 },
  dotActive: {
    width: 8,
    height: 8,
    backgroundColor: "#adc6ff",
    shadowColor: "#adc6ff",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: "#31353c",
    opacity: 0.6,
  },
});
