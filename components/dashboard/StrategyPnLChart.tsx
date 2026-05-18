import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Rect, Line, Text as SvgText } from "react-native-svg";

interface StrategyPnLProps {
  strategyData?: { strategy: string; pnl: number }[];
}

export const StrategyPnLChart = ({ strategyData }: StrategyPnLProps) => {
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    strategy: string;
    value: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    strategy: "",
    value: 0,
    visible: false,
  });

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;

  const isEmpty = !strategyData || strategyData.length === 0;

  if (isEmpty) {
    return (
      <Animated.View
        entering={FadeInUp.duration(600).delay(200).springify()}
        className="bg-card p-5 rounded-2xl border border-card-secondary mb-6"
      >
        <Text className="text-text-primary text-base font-bold mb-4">
          Strategy vs P&L
        </Text>
        <View className="h-45 border border-dashed border-card-secondary rounded-2xl items-center justify-center">
          <MaterialCommunityIcons name="strategy" size={40} color="#262a31" />
          <Text className="text-text-secondary text-sm mt-3 font-medium">
            No strategy data
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Find min/max explicitly safely natively
  const maxPnL = Math.max(...strategyData.map((d) => d.pnl), 0);
  const minPnL = Math.min(...strategyData.map((d) => d.pnl), 0);

  // Padding cleanly dynamically scaling
  const maxVal = maxPnL > 0 ? maxPnL * 1.2 : 0;
  const minVal = minPnL < 0 ? minPnL * 1.2 : 0;
  const range = maxVal - minVal;

  const yPaddingTop = 20;
  const yPaddingBottom = 30;
  const drawableHeight = chartHeight - yPaddingTop - yPaddingBottom;

  const getYPosition = (val: number) => {
    // Top boundary is 0 at pixel 0 + pad
    // Axis zero is dynamically located based on ratio cleanly
    if (range === 0) return chartHeight / 2;
    const ratio = (maxVal - val) / range;
    return yPaddingTop + ratio * drawableHeight;
  };

  const zeroY = getYPosition(0);

  const barWidth = Math.min(30, (chartWidth / strategyData.length) * 0.6);
  const totalXPadding = chartWidth - barWidth * strategyData.length;
  const xSpacing = totalXPadding / (strategyData.length + 1);

  // Extract explicit Grid axes dynamically mapping cleanly 4 chunks explicitly securely natively
  const gridSteps = 4;
  const gridLines = [];
  for (let i = 0; i <= gridSteps; i++) {
    const val = minVal + range * (i / gridSteps);
    gridLines.push({
      y: getYPosition(val),
      label: `$${val < 0 ? "-" : ""}${Math.abs(val).toFixed(0)}`,
    });
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(600).delay(200).springify()}
      className="bg-card p-5 rounded-2xl border border-card-secondary mb-6"
    >
      <Text className="text-text-primary text-base font-bold mb-6">
        Strategy vs P&L
      </Text>

      <View
        style={{
          position: "relative",
          width: chartWidth,
          height: chartHeight + 10,
          marginLeft: 10,
        }}
      >
        <Svg
          width={chartWidth + 30}
          height={chartHeight + 10}
          style={{ position: "absolute", top: 0, left: -25 }}
        >
          {/* Grid Lines cleanly mapped */}
          {gridLines.map((gl, i) => (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={30}
                y1={gl.y}
                x2={chartWidth + 20}
                y2={gl.y}
                stroke="#2b303a"
                strokeWidth={1}
              />
              <SvgText
                x={25}
                y={gl.y + 4}
                fill="#a3a8b8"
                fontSize={10}
                textAnchor="end"
                fontWeight="bold"
              >
                {gl.label}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Zero Axis mapped prominently safely */}
          <Line
            x1={30}
            y1={zeroY}
            x2={chartWidth + 20}
            y2={zeroY}
            stroke="#3a404c"
            strokeWidth={1}
          />

          {/* Bars recursively calculated scaling cleanly natively */}
          {strategyData.map((d, i) => {
            const x = 30 + xSpacing * (i + 1) + barWidth * i;
            const y = d.pnl >= 0 ? getYPosition(d.pnl) : zeroY;
            const height = Math.abs(getYPosition(d.pnl) - zeroY);

            // Limit minimum height so it is consistently clickable cleanly natively
            const safeHeight = Math.max(height, 5);
            const safeY = d.pnl >= 0 ? zeroY - safeHeight : zeroY;

            return (
              <React.Fragment key={`bar-${i}`}>
                {/* Visual Label Bottom bounds mapping dynamically cleanly  */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 5}
                  fill="#c2c6d6"
                  fontSize={10}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {d.strategy.length > 8
                    ? `${d.strategy.substring(0, 8)}..`
                    : d.strategy}
                </SvgText>

                {/* Actual SVG Graphic matching rounded explicit bounds matching explicit aesthetics accurately */}
                <Rect
                  x={x}
                  y={safeY}
                  width={barWidth}
                  height={safeHeight}
                  fill={d.pnl >= 0 ? "#01c896" : "#f59e0b"}
                  rx={6}
                  onPress={() => {
                    if (
                      tooltipPos.visible &&
                      tooltipPos.strategy === d.strategy
                    ) {
                      setTooltipPos({ ...tooltipPos, visible: false });
                    } else {
                      setTooltipPos({
                        x: x + barWidth / 2,
                        y: d.pnl >= 0 ? safeY - 5 : safeY + safeHeight + 5,
                        strategy: d.strategy,
                        value: d.pnl,
                        visible: true,
                      });
                    }
                  }}
                />
              </React.Fragment>
            );
          })}

          {/* Overlay Tooltip matching styling closely correctly */}
          {tooltipPos.visible && (
            <React.Fragment>
              <Rect
                x={Math.max(0, tooltipPos.x - 45)}
                y={tooltipPos.value >= 0 ? tooltipPos.y - 45 : tooltipPos.y}
                width={90}
                height={40}
                fill="#161921"
                rx={6}
                stroke="#333845"
                strokeWidth={1}
              />
              <SvgText
                x={tooltipPos.x}
                y={
                  tooltipPos.value >= 0 ? tooltipPos.y - 28 : tooltipPos.y + 17
                }
                fill="#fff"
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
              >
                {tooltipPos.strategy.length > 12
                  ? `${tooltipPos.strategy.substring(0, 10)}..`
                  : tooltipPos.strategy}
              </SvgText>
              <SvgText
                x={tooltipPos.x}
                y={
                  tooltipPos.value >= 0 ? tooltipPos.y - 12 : tooltipPos.y + 32
                }
                fill="#a3a8b8"
                fontSize={11}
                textAnchor="middle"
              >
                {`P&L: ${tooltipPos.value >= 0 ? "+$" : "-$"}${Math.abs(tooltipPos.value).toFixed(2)}`}
              </SvgText>
            </React.Fragment>
          )}
        </Svg>
      </View>
    </Animated.View>
  );
};
