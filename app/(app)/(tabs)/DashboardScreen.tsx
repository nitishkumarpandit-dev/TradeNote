import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DashboardSkeleton,
  DynamicDataSkeleton,
} from "../../../components/dashboard/DashboardSkeleton";
import { DonutChart } from "../../../components/dashboard/DonutChart";
import { InsightCard } from "../../../components/dashboard/InsightCard";
import { LineChart } from "../../../components/dashboard/LineChart";
import { StrategyPnLChart } from "../../../components/dashboard/StrategyPnLChart";
import { ProgressBar } from "../../../components/dashboard/ProgressBar";
import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { StatCard } from "../../../components/dashboard/StatCard";
import { TradeHistoryCard } from "../../../components/history/TradeHistoryCard";
import { SettingsBottomSheet } from "../../../components/settings/SettingsBottomSheet";
import { HistoryTrade } from "../../../types/history";
import { ProfileAvatar } from "../../../components/profile/ProfileAvatar";
import { useDashboardData } from "../../../hooks/useDashboardData";
import { EmptyState } from "../../../components/common/EmptyState";

const DashboardScreen = () => {
  const [selectedMarket, setSelectedMarket] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const { data, isLoading, isFetching, refetch } = useDashboardData(
    selectedMarket,
    selectedRange,
  );
  const insets = useSafeAreaInsets();

  // Filter States
  const [marketDropdownVisible, setMarketDropdownVisible] = useState(false);
  const [rangeDropdownVisible, setRangeDropdownVisible] = useState(false);

  const MARKET_OPTIONS = ["All", "Crypto", "Indian", "Forex"];

  const RANGE_OPTIONS = ["Last 7 Days", "Last 30 Days", "Last 1 Year"];

  // Settings bottom sheet ref
  const settingsSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    router.push("/add-trade");
  };

  const handleOpenSettings = () => {
    // settingsSheetRef.current?.expand();
    settingsSheetRef.current?.snapToIndex(0);
  };

  // Wrap refetch to safely handle the promise
  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (e) {
      console.error("Refresh failed:", e);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) return null;

  return (
    <View
      className="flex-1 bg-background px-4"
      style={{ flex: 1, backgroundColor: "#10141a", paddingTop: insets.top }}
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center">
          <View className="bg-primary p-2 rounded-xl mr-3">
            <MaterialCommunityIcons
              name="rocket-launch"
              size={24}
              color="white"
            />
          </View>
          <Text className="text-text-primary text-xl font-bold">
            Trade Note
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-6" onPress={handleOpenSettings}>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.8}
            className="rounded-full border border-card overflow-hidden"
          >
            <ProfileAvatar size={40} />
          </TouchableOpacity>
        </View>
      </View>

      {/* QUICK LINKS */}
      <View className="mb-4 flex-row gap-2">
        <InsightCard
          title="Strategies"
          count={data.insights.strategies}
          icon="chart-timeline-variant"
          color="#4d8eff"
          onPress={() => router.push("/strategies")}
        />
        <InsightCard
          title="Rules"
          count={data.insights.rules}
          icon="gavel"
          color="#f9c449"
          onPress={() => router.push("/rules")}
        />
        <InsightCard
          title="Mistakes"
          count={data.insights.mistakes}
          icon="alert-decagram-outline"
          color="#ff5451"
          onPress={() => router.push("/mistakes")}
        />
      </View>

      {/* FILTER CHIPS */}
      <View className="mb-4 flex-row w-full gap-2">
        <TouchableOpacity
          style={[
            styles.chip,
            { flex: 1, justifyContent: "center" },
            styles.chipActive,
          ]}
          onPress={() => setMarketDropdownVisible(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.chipText, styles.chipTextActive]}
            numberOfLines={1}
          >
            {`Market: ${selectedMarket}`}
          </Text>
          <MaterialIcons name="expand-more" size={16} color="#dfe2eb" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chip,
            { flex: 1, justifyContent: "center" },
            styles.chipActive,
          ]}
          onPress={() => setRangeDropdownVisible(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.chipText, styles.chipTextActive]}
            numberOfLines={1}
          >
            {selectedRange}
          </Text>
          <MaterialIcons name="expand-more" size={16} color="#dfe2eb" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(data && isFetching)}
            onRefresh={handleRefresh}
            tintColor="#4d8eff"
            colors={["#4d8eff"]}
          />
        }
      >
        {isFetching ? (
          <DynamicDataSkeleton />
        ) : (
          <>
            {/* STATS CARDS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-8"
            >
              <StatCard
                title="Highest P&L"
                value={data.stats.highestPnl}
                icon="cash-multiple"
                color="#01c896"
              />
              <StatCard
                title="Win Rate"
                value={data.stats.winRate}
                icon="trophy-outline"
                color="#f9c449"
              />
              <StatCard
                title="Avg R:R"
                value={data.stats.avgRR}
                icon="chart-bell-curve-cumulative"
                color="#4d8eff"
              />
              <StatCard
                title="Trades"
                value={data.stats.totalTrades}
                icon="swap-horizontal"
                color="#ff5451"
              />
            </ScrollView>

            {/* CONFIDENCE INDEX */}
            <View className="mb-8">
              <ProgressBar
                label="Confidence Index"
                progress={data.confidence.index}
                description={data.confidence.description}
              />
            </View>

            {/* TRADING INSIGHTS */}
            <View className="mb-2">
              <SectionHeader title="Trading Insights" className="mb-1" />
              <Text className="text-text-secondary text-xs mb-4">
                Track and improve your trading behavior
              </Text>
            </View>

            {/* CUMULATIVE P&L */}
            <LineChart chartData={data.chartData} />

            {/* STRATEGY VS P&L */}
            <StrategyPnLChart strategyData={data.strategyPnL} />

            {/* WIN/LOSS DISTRIBUTION */}
            <View className="mb-8">
              <DonutChart
                wins={data.winLossDist.wins}
                losses={data.winLossDist.losses}
                winRate={data.winLossDist.winRate}
              />
            </View>

            {/* TOP TRADES */}
            <View className="mb-8">
              <SectionHeader
                title="Top Trades"
                onViewAll={() =>
                  router.push({
                    pathname: "/history",
                    params: { sort: "Highest PnL", market: selectedMarket },
                  })
                }
              />
              {data.topTrades.length > 0 ? (
                data.topTrades.map((trade) => (
                  <View key={trade.id} className="mb-3">
                    <TradeHistoryCard
                      trade={trade as HistoryTrade}
                      hideActions={true}
                    />
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="trophy-outline"
                  title="No Top Trades"
                  description="Your highest performing trades will appear here."
                />
              )}
            </View>

            {/* COMMON MISTAKES */}
            <View className="mb-8">
              <SectionHeader title="Common Mistakes" />
              {data.commonMistakes.length > 0 ? (
                data.commonMistakes.map((mistake) => (
                  <View
                    key={mistake.id}
                    className={`bg-card p-4 rounded-2xl mb-3 border-l-4 flex-row justify-between items-center ${
                      mistake.severity === "CRITICAL"
                        ? "border-l-danger"
                        : "border-l-yellow-500"
                    }`}
                  >
                    <View>
                      <Text className="text-text-primary font-bold text-base">
                        {mistake.title}
                      </Text>
                      <Text className="text-text-secondary text-xs mt-1">
                        {mistake.occurrences} Occurrences
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-text-primary font-bold">
                        {mistake.pnl}
                      </Text>
                      {mistake.severity === "CRITICAL" && (
                        <View className="bg-danger/10 px-2 py-0.5 rounded mt-1">
                          <Text className="text-danger text-[8px] font-bold uppercase">
                            Critical
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="alert-circle-outline"
                  title="All Clear!"
                  description="No common mistakes recorded yet. Keep up the disciplined trading."
                />
              )}
            </View>

            {/* TRADE HISTORY */}
            <View className="mb-8">
              <SectionHeader
                title="Trade History"
                onViewAll={() =>
                  router.push({
                    pathname: "/history",
                    params: { market: selectedMarket },
                  })
                }
              />
              {data.tradeHistory.length > 0 ? (
                data.tradeHistory.map((trade) => (
                  <View key={trade.id} className="mb-4">
                    <TradeHistoryCard
                      trade={trade as HistoryTrade}
                      hideActions={true}
                    />
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="calendar-text-outline"
                  title="No History"
                  description="Start your trading journey by logging your first trade."
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        onPress={handleOpenBottomSheet}
        className="absolute bottom-8 right-6 bg-primary px-6 py-4 rounded-2xl flex-row items-center shadow-lg shadow-primary/40"
        style={{
          elevation: 8,
          position: "absolute",
          bottom: insets.bottom + 20,
          right: 24,
          backgroundColor: "#4d8eff",
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text className="text-white font-bold ml-2">New Trade</Text>
      </TouchableOpacity>

      {/* MODALS */}
      <PickerModal
        visible={marketDropdownVisible}
        title="Market"
        options={MARKET_OPTIONS}
        selected={selectedMarket}
        onSelect={(v) => setSelectedMarket(v)}
        onClose={() => setMarketDropdownVisible(false)}
      />
      <PickerModal
        visible={rangeDropdownVisible}
        title="Date Range"
        options={RANGE_OPTIONS}
        selected={selectedRange}
        onSelect={(v) => setSelectedRange(v)}
        onClose={() => setRangeDropdownVisible(false)}
      />

      {/* SETTINGS BOTTOM SHEET */}
      <SettingsBottomSheet bottomSheetRef={settingsSheetRef} />
    </View>
  );
};

// ── Generic picker modal ───────────────────────────────────────────────────────
function PickerModal<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={18} color="#8c909f" />
            </TouchableOpacity>
          </View>
          {options.map((opt, i) => {
            const isActive = opt === selected;
            const isLast = i === options.length - 1;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  isActive && styles.modalOptionActive,
                  !isLast && styles.modalOptionBorder,
                ]}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    isActive && styles.modalOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
                {isActive && (
                  <MaterialIcons name="check" size={16} color="#4d8eff" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1c2026",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.5)",
  },
  chipActive: {
    borderColor: "#4d8eff",
    backgroundColor: "rgba(77,142,255,0.1)",
  },
  chipText: { color: "#8c909f", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#dfe2eb" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: "#1c2026",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  modalTitle: { color: "#dfe2eb", fontSize: 14, fontWeight: "700" },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  modalOptionActive: { backgroundColor: "rgba(77,142,255,0.07)" },
  modalOptionText: { color: "#8c909f", fontSize: 14 },
  modalOptionTextActive: { color: "#4d8eff", fontWeight: "600" },
});

export default DashboardScreen;
