import {
  ASYNC_STORAGE_KEYS,
  DASHBOARD_STATS,
  FEATURES,
  HERO_STATS,
  ONBOARDING_COPY,
  TOTAL_SCREENS,
} from "@/constants/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 48, 400);

// ─── Shared Components ────────────────────────────────────────────────────────

function EquityChart() {
  return (
    <View style={styles.chartContainer}>
      <Svg
        width="100%"
        height="80"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#43e5b1" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#43e5b1" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,10 L400,100 L0,100 Z"
          fill="url(#chartGrad)"
        />
        <Path
          d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,10"
          fill="none"
          stroke="#43e5b1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function DashboardMockup() {
  const { equityCurve, winRate, avgRR, latestTrade } = DASHBOARD_STATS;
  return (
    <View style={styles.mockupCard}>
      <View style={styles.chromeDots}>
        <View style={[styles.chromeDot, { backgroundColor: "#ffb3ad" }]} />
        <View style={[styles.chromeDot, { backgroundColor: "#43e5b1" }]} />
        <View style={[styles.chromeDot, { backgroundColor: "#adc6ff" }]} />
        <View style={styles.chromeBar} />
      </View>
      <View style={styles.equityCard}>
        <View style={styles.equityHeader}>
          <Text style={styles.equityLabel}>EQUITY CURVE</Text>
          <Text style={styles.equityValue}>{equityCurve}</Text>
        </View>
        <EquityChart />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>WIN RATE</Text>
          <Text style={styles.statValue}>{winRate}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>AVG RR</Text>
          <Text style={styles.statValue}>{avgRR}</Text>
        </View>
      </View>
      <View style={styles.tradeRow}>
        <View style={styles.tradeIconWrap}>
          <Text style={styles.tradeIcon}>↗</Text>
        </View>
        <View style={styles.tradeInfo}>
          <Text style={styles.tradeSymbol}>{latestTrade.symbol}</Text>
          <Text style={styles.tradeDate}>{latestTrade.date}</Text>
        </View>
        <View style={styles.tradePnlWrap}>
          <Text style={styles.tradePnl}>{latestTrade.pnl}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${latestTrade.progress * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function FeatureCard({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  );
}

function HeroChart() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 200 150"
      preserveAspectRatio="xMidYMid meet"
    >
      <Defs>
        <LinearGradient id="heroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#4d8eff" stopOpacity="0.35" />
          <Stop offset="100%" stopColor="#4d8eff" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path
        d="M10 130 L40 110 L70 120 L100 80 L130 90 L160 40 L190 20 L190 150 L10 150 Z"
        fill="url(#heroGrad)"
      />
      <Path
        d="M10 130 L40 110 L70 120 L100 80 L130 90 L160 40 L190 20"
        fill="none"
        stroke="#4d8eff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="10" cy="130" r="4" fill="#4d8eff" />
      <Circle cx="100" cy="80" r="4" fill="#4d8eff" />
      <Circle cx="190" cy="20" r="8" fill="#43e5b1" opacity={0.25} />
      <Circle cx="190" cy="20" r="5" fill="#43e5b1" />
    </Svg>
  );
}

function GridLines() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLine,
            styles.gridLineH,
            { top: `${(i / 5) * 100}%` },
          ]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.gridLine,
            styles.gridLineV,
            { left: `${(i / 5) * 100}%` },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const handleNext = async () => {
    if (currentIndex < TOTAL_SCREENS - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.onboarded, "true");
    } catch (_) {}
    router.replace("/(auth)/screens/RegisterScreen");
  };

  const renderItem = ({ index }: { index: number }) => {
    if (index === 0) {
      const copy = ONBOARDING_COPY.screen1;
      return (
        <View style={styles.slide}>
          <View style={styles.previewWrap}>
            <DashboardMockup />
            <View style={styles.cardShadow} />
          </View>
          <View style={styles.textSection}>
            <Text style={styles.headline}>{copy.headline}</Text>
            <Text style={styles.headlineAccent}>{copy.headlineAccent}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
        </View>
      );
    } else if (index === 1) {
      const copy = ONBOARDING_COPY.screen2;
      return (
        <View style={styles.slide}>
          <View style={styles.heroSection}>
            <View style={styles.iconBox}>
              <Text style={styles.iconBoxText}>✦</Text>
            </View>
            <Text style={styles.headline}>{copy.headline}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
          <View style={styles.grid}>
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.id}
                emoji={feature.emoji}
                title={feature.title}
              />
            ))}
          </View>
        </View>
      );
    } else {
      const copy = ONBOARDING_COPY.screen3;
      return (
        <View style={styles.slide}>
          <View style={styles.heroCardWrap}>
            <View style={styles.heroCard}>
              <GridLines />
              <View style={styles.chartArea}>
                <HeroChart />
              </View>
              <View style={[styles.badge, styles.badgeTopLeft]}>
                <Text style={styles.badgeIcon}>↗</Text>
                <View>
                  <Text style={styles.badgeLabel}>P/L CURVE</Text>
                  <Text style={styles.badgeValue}>{HERO_STATS.plCurve}</Text>
                </View>
              </View>
              <View style={[styles.badge, styles.badgeBottomRight]}>
                <Text style={styles.badgeIcon}>🧠</Text>
                <View>
                  <Text style={styles.badgeLabel}>JOURNALING</Text>
                  <Text style={styles.badgeValue}>
                    {HERO_STATS.journalingDay}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.headline}>
              {copy.headline}{" "}
              <Text style={styles.headlineAccent}>{copy.headlineAccent}</Text>
              {"\n"}
              {copy.headlineSuffix}
            </Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fixed Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={finishOnboarding}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Sliding Content */}
      <FlatList
        ref={flatListRef}
        data={[0, 1, 2]}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.toString()}
        style={styles.flatList}
      />

      {/* Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.dotsRow}>
          {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
            <View
              key={i}
              style={[
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>
            {currentIndex === 2 ? ONBOARDING_COPY.screen3.cta : "Next"}
          </Text>
          {currentIndex < 2 && <Text style={styles.ctaArrow}>→</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#10141a",
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  topBar: {
    alignItems: "flex-end",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  skipText: { color: "#8c909f", fontSize: 14, fontWeight: "500" },
  previewWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  mockupCard: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(49,53,60,0.45)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(140,144,159,0.12)",
    padding: 12,
  },
  chromeDots: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  chromeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  chromeBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#31353c",
    borderRadius: 5,
    marginLeft: 8,
  },
  cardShadow: {
    width: "80%",
    height: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 999,
    alignSelf: "center",
    marginTop: 4,
  },
  equityCard: {
    backgroundColor: "#0a0e14",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    overflow: "hidden",
    minHeight: 130,
  },
  equityHeader: { marginBottom: 8 },
  equityLabel: {
    color: "#c2c6d6",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  equityValue: { color: "#43e5b1", fontSize: 22, fontWeight: "800" },
  chartContainer: { width: "100%", height: 80 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#262a31",
    borderRadius: 10,
    padding: 14,
  },
  statLabel: {
    color: "#c2c6d6",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: { color: "#dfe2eb", fontSize: 18, fontWeight: "700" },
  tradeRow: {
    backgroundColor: "#1c2026",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tradeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(1,200,150,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  tradeIcon: { color: "#43e5b1", fontSize: 14, fontWeight: "700" },
  tradeInfo: { flex: 1 },
  tradeSymbol: {
    color: "#dfe2eb",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },
  tradeDate: {
    color: "#8c909f",
    fontSize: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tradePnlWrap: { alignItems: "flex-end" },
  tradePnl: {
    color: "#43e5b1",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  progressBar: {
    width: 48,
    height: 4,
    backgroundColor: "#31353c",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#43e5b1", borderRadius: 2 },
  textSection: { alignItems: "center", marginBottom: 20, paddingHorizontal: 8 },
  headline: {
    color: "#dfe2eb",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  headlineAccent: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 34,
    color: "#43e5b1",
    marginBottom: 10,
  },
  subtitle: {
    color: "#8c909f",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 300,
  },
  heroSection: { alignItems: "center", marginBottom: 28, paddingTop: 4 },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1c2a4a",
    borderWidth: 1,
    borderColor: "rgba(77,142,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconBoxText: { fontSize: 28, color: "#adc6ff" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
  },
  featureCard: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#1c2026",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(66,71,84,0.35)",
    padding: 20,
    justifyContent: "flex-end",
  },
  featureEmoji: { fontSize: 32, marginBottom: 10 },
  featureTitle: {
    color: "#dfe2eb",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  heroCardWrap: { alignItems: "center", marginBottom: 20 },
  heroCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.82,
    backgroundColor: "#161b22",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(48,54,61,0.8)",
    overflow: "hidden",
  },
  chartArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
  },
  gridLine: { position: "absolute", backgroundColor: "rgba(148,163,184,0.08)" },
  gridLineH: { left: 0, right: 0, height: 1 },
  gridLineV: { top: 0, bottom: 0, width: 1 },
  badge: {
    position: "absolute",
    backgroundColor: "rgba(22,27,34,0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(48,54,61,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeTopLeft: { top: 16, left: 16 },
  badgeBottomRight: { bottom: 16, right: 16 },
  badgeIcon: { fontSize: 16, color: "#43e5b1" },
  badgeLabel: {
    color: "#8c909f",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 12,
  },
  badgeValue: {
    color: "#f1f5f9",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  bottomSection: {
    alignItems: "center",
    gap: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#4d8eff",
    shadowColor: "#4d8eff",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#31353c",
    opacity: 0.5,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#4d8eff",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#4d8eff",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  ctaArrow: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
