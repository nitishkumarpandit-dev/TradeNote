import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAIInsights } from "../../hooks/useAIInsights";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const AIInsightsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    targetMarket = "All",
    period = "Last 30 Days",
    startDate,
    endDate,
  } = params;

  const { data, isLoading, isError, error } = useAIInsights(
    targetMarket as string,
    period as string,
    startDate as string,
    endDate as string,
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <StyledView className="flex-row items-center justify-between px-6 py-4">
        <StyledView className="flex-row items-center gap-4">
          <StyledTouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-xl bg-card"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </StyledTouchableOpacity>
          <StyledText className="text-white font-bold text-xl">
            AI Insights
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center gap-2">
          <StyledTouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl">
            <Ionicons name="share-social-outline" size={24} color="#8c909f" />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl">
            <Ionicons name="refresh-outline" size={24} color="#8c909f" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledScrollView
        className="flex-1 px-6 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <StyledView className="flex-1 justify-center items-center py-20 mt-10">
            <ActivityIndicator size="large" color="#4d8eff" />
            <StyledText className="text-[#8c909f] mt-4 font-medium">
              Generating personalized AI insights...
            </StyledText>
            <StyledText className="text-[#8c909f] text-xs mt-2 text-center px-10">
              This usually takes 10-15 seconds. Our AI is analyzing your
              performance metrics, rule adherence, and market conditions.
            </StyledText>
          </StyledView>
        ) : isError ? (
          <StyledView className="flex-1 justify-center items-center py-20 mt-10">
            <Ionicons name="alert-circle-outline" size={48} color="#ff5451" />
            <StyledText className="text-white mt-4 font-bold text-lg">
              Analysis Failed
            </StyledText>
            <StyledText className="text-[#8c909f] text-center mt-2 px-10">
              {error instanceof Error
                ? error.message
                : "We couldn't generate insights at this time. Please try again later."}
            </StyledText>
          </StyledView>
        ) : data ? (
          <>
            {/* Summary Card */}
            <StyledView className="mt-4 overflow-hidden rounded-2xl bg-card p-6 border border-[#8c909f1a]">
              <StyledView className="flex-row items-center gap-2 mb-4">
                <MaterialCommunityIcons
                  name="brain"
                  size={20}
                  color="#4d8eff"
                />
                <StyledText className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6]">
                  Performance Summary
                </StyledText>
              </StyledView>
              <StyledText className="text-[#dfe2eb] text-sm leading-relaxed">
                {data.summary}
              </StyledText>
            </StyledView>

            {/* Quick Metrics Row */}
            <StyledView className="flex-row gap-4 mt-8">
              <StyledView className="flex-1 bg-card rounded-2xl p-4 border border-[#8c909f1a]">
                <StyledText className="text-[10px] uppercase font-bold tracking-widest text-[#c2c6d6]">
                  Win Rate Delta
                </StyledText>
                <StyledView className="flex-row items-end gap-2 mt-2">
                  <StyledText
                    className={`text-2xl font-black ${data.winRateDelta.startsWith("-") ? "text-[#ff5451]" : "text-[#43e5b1]"}`}
                  >
                    {data.winRateDelta}
                  </StyledText>
                  <Ionicons
                    name={
                      data.winRateDelta.startsWith("-")
                        ? "trending-down-outline"
                        : "trending-up-outline"
                    }
                    size={16}
                    color={
                      data.winRateDelta.startsWith("-") ? "#ff5451" : "#43e5b1"
                    }
                  />
                </StyledView>
              </StyledView>
              <StyledView className="flex-1 bg-card rounded-2xl p-4 border border-[#8c909f1a]">
                <StyledText className="text-[10px] uppercase font-bold tracking-widest text-[#c2c6d6]">
                  Avg R:R Ratio
                </StyledText>
                <StyledView className="flex-row items-end gap-2 mt-2">
                  <StyledText className="text-2xl font-black text-white">
                    {data.avgRrRatio}
                  </StyledText>
                  <StyledText className="text-[10px] text-[#c2c6d6] mb-1">
                    {data.targetRrRatio}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>

            {/* Key Strengths */}
            {data.strengths && data.strengths.length > 0 && (
              <StyledView className="mt-8 space-y-4">
                <StyledText className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] ml-1 mb-2">
                  Key Strengths
                </StyledText>
                <StyledView className="space-y-3">
                  {data.strengths.map((strength, idx) => (
                    <StyledView
                      key={idx}
                      className="flex-row items-start gap-4 p-4 rounded-xl bg-[#181c22] border-l-2 border-[#43e5b180] mb-3"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#43e5b1"
                      />
                      <StyledView className="flex-1">
                        <StyledText className="text-white font-bold text-sm">
                          {strength.title}
                        </StyledText>
                        <StyledText className="text-[#c2c6d6] text-xs mt-1 leading-tight">
                          {strength.description}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  ))}
                </StyledView>
              </StyledView>
            )}

            {/* Areas to Improve */}
            {data.weaknesses && data.weaknesses.length > 0 && (
              <StyledView className="mt-8 space-y-4">
                <StyledText className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] ml-1 mb-2">
                  Areas to Improve
                </StyledText>
                <StyledView className="space-y-3">
                  {data.weaknesses.map((weakness, idx) => (
                    <StyledView
                      key={idx}
                      className="flex-row items-start gap-4 p-4 rounded-xl bg-[#181c22] border-l-2 border-[#ff545180] mb-3"
                    >
                      <Ionicons name="warning" size={24} color="#ff5451" />
                      <StyledView className="flex-1">
                        <StyledText className="text-white font-bold text-sm">
                          {weakness.title}
                        </StyledText>
                        <StyledText className="text-[#c2c6d6] text-xs mt-1 leading-tight">
                          {weakness.description}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  ))}
                </StyledView>
              </StyledView>
            )}

            {/* Actionable Advice */}
            {data.actionableAdvice && (
              <StyledView className="mt-8 mb-12 bg-primary rounded-2xl p-6 shadow-none elevation-0">
                <StyledView className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="bulb-outline" size={16} color="white" />
                  <StyledText className="text-white font-bold">
                    Actionable Advice
                  </StyledText>
                </StyledView>
                <StyledText className="text-white text-sm font-medium leading-relaxed mb-6">
                  {data.actionableAdvice}
                </StyledText>

                <StyledView className="bg-black/10 px-4 py-3 rounded-xl flex-row items-center justify-between">
                  <StyledText className="text-white text-[10px] font-bold uppercase tracking-tighter">
                    AI Confidence Index
                  </StyledText>
                  <StyledView className="flex-row gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StyledView
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${i <= (data.confidenceScore || 4) ? "bg-white" : "bg-white/30"}`}
                      />
                    ))}
                  </StyledView>
                </StyledView>
              </StyledView>
            )}
          </>
        ) : null}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default AIInsightsScreen;
