import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterBar from "../../../components/reports/FilterBar";
import ReportsTabNavigation, {
  ReportTab,
} from "../../../components/reports/ReportsTabNavigation";
import PerformanceTab from "../../../components/reports/PerformanceTab";
import PsychologyTab from "../../../components/reports/PsychologyTab";
import RiskTab from "../../../components/reports/RiskTab";
import JournalTab from "../../../components/reports/JournalTab";
import { useReportData } from "../../../hooks/useReportData";
import { EmptyState } from "../../../components/common/EmptyState";
import { ReportsSkeleton } from "../../../components/reports/ReportsSkeleton";

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("Performance");
  const [market, setMarket] = useState("Indian");
  const [duration, setDuration] = useState("Last 30 Days");

  const {
    data: reportData,
    isLoading,
    isFetching,
    refetch,
  } = useReportData(market, duration);

  const renderContent = () => {
    if (isLoading) {
      return <ReportsSkeleton />;
    }

    if (!reportData || reportData.performance.totalTrades === 0) {
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <EmptyState
            icon="filter"
            title="No Report Data"
            description="There are no trades matching the selected filters to generate a report."
          />
        </View>
      );
    }

    if (isFetching && !reportData) {
      return <ReportsSkeleton />;
    }

    switch (activeTab) {
      case "Performance":
        return <PerformanceTab data={reportData.performance} />;
      case "Psychology":
        return <PsychologyTab data={reportData.psychology} />;
      case "Risk":
        return <RiskTab data={reportData.risk} />;
      case "Journal":
        return <JournalTab data={reportData.journal} />;
      default:
        return <PerformanceTab data={reportData.performance} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(reportData && isFetching)}
            onRefresh={refetch}
            tintColor="#4d8eff"
            colors={["#4d8eff"]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
        </View>

        <View style={styles.filterContainer}>
          <FilterBar
            market={market}
            setMarket={setMarket}
            duration={duration}
            setDuration={setDuration}
          />
        </View>

        <ReportsTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <View style={styles.contentContainer}>{renderContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10141a",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#10141a",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "Inter",
    letterSpacing: -0.5,
  },
  filterContainer: {
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ReportsScreen;
