import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';

export interface ChartDataGroup {
  daily: { date: string; value: number }[];
  weekly: { date: string; value: number }[];
  monthly: { date: string; value: number }[];
}

interface LineChartProps {
  chartData?: ChartDataGroup;
}

type Period = 'D' | 'W' | 'M';

export const LineChart = ({ chartData }: LineChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('D');
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; value: number; index: number; visible: boolean }>({
    x: 0, y: 0, value: 0, index: 0, visible: false
  });

  const screenWidth = Dimensions.get('window').width;

  const dataset = useMemo(() => {
    if (!chartData) return [];
    if (selectedPeriod === 'D') return chartData.daily;
    if (selectedPeriod === 'W') return chartData.weekly;
    return chartData.monthly;
  }, [chartData, selectedPeriod]);

  const isEmpty = !dataset || dataset.length === 0;

  // Process data for ChartKit
  const processedData = useMemo(() => {
    if (isEmpty) return { labels: [''], data: [0] };
    
    // ChartKit fails or draws dots instead of lines if length < 2.
    if (dataset.length === 1) {
      return {
        labels: [dataset[0].date.substring(5), 'Now'],
        data: [dataset[0].value, dataset[0].value]
      }
    }
    
    const rawLabels = dataset.map(d => d.date.substring(5)); // 'MM-DD'
    const cleanLabels = rawLabels.map((l, i) => {
      // Prevent label overlapping by skipping labels if dataset is too large
      if (rawLabels.length > 5) {
        if (i === 0 || i === rawLabels.length - 1 || i === Math.floor(rawLabels.length/2)) return l;
        return "";
      }
      return l;
    });

    return {
      labels: cleanLabels,
      data: dataset.map(d => d.value)
    };
  }, [dataset, isEmpty]);

  // Determine Red/Green thematic conditional logic
  const finalValue = processedData.data[processedData.data.length - 1] || 0;
  const isPositive = finalValue >= 0;
  const strokeColor = isPositive ? '#01c896' : '#ff5451';
  const colorFunc = (opacity = 1) => isPositive ? `rgba(1, 200, 150, ${opacity})` : `rgba(255, 84, 81, ${opacity})`;

  const chartConfig = {
    backgroundColor: '#1c2026',
    backgroundGradientFrom: '#1c2026',
    backgroundGradientTo: '#1c2026',
    decimalPlaces: 2,
    color: colorFunc,
    labelColor: (opacity = 1) => `rgba(194, 198, 214, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: strokeColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: '#262a31',
    },
  };

  const PERIODS: Period[] = ['D', 'W', 'M'];

  const handleDataPointClick = (data: any) => {
    if (tooltipPos.visible && tooltipPos.index === data.index) {
      setTooltipPos({ ...tooltipPos, visible: false }); // Toggle off
    } else {
      setTooltipPos({
        x: data.x,
        y: data.y,
        value: data.value,
        index: data.index,
        visible: true
      });
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(600).delay(100).springify()}
      className="bg-card p-5 rounded-2xl border border-card-secondary mb-6"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-text-primary text-base font-bold">Cumulative P&L</Text>
        <View className="flex-row bg-card-secondary rounded-lg p-1">
          {PERIODS.map((period) => (
            <Pressable 
              key={period}
              className={`px-4 py-1.5 rounded-md ${selectedPeriod === period ? 'bg-card' : ''}`}
              onPress={() => {
                setSelectedPeriod(period);
                setTooltipPos({ ...tooltipPos, visible: false });
              }}
            >
              <Text className={`text-xs font-bold ${selectedPeriod === period ? 'text-primary' : 'text-text-secondary'}`}>
                {period}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isEmpty ? (
        <View className="h-[180px] border border-dashed border-card-secondary rounded-2xl items-center justify-center">
          <MaterialCommunityIcons name="trending-up" size={40} color="#262a31" />
          <Text className="text-text-secondary text-sm mt-3 font-medium">No Trading Data</Text>
        </View>
      ) : (
        <View>
          <RNLineChart
            data={{
              labels: processedData.labels,
              datasets: [{ data: processedData.data }],
            }}
            width={screenWidth - 80}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -15, 
            }}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withVerticalLines={false}
            onDataPointClick={handleDataPointClick}
            decorator={() => {
              if (!tooltipPos.visible) return null;
              
              const activePoint = dataset[tooltipPos.index] || dataset[0];
              const prevValue = tooltipPos.index > 0 ? processedData.data[tooltipPos.index - 1] : null;
              
              let pctChangeStr = "0.0%";
              if (prevValue !== null && prevValue !== 0) {
                 const pct = ((tooltipPos.value - prevValue) / Math.abs(prevValue)) * 100;
                 pctChangeStr = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
              }
              
              const tooltipWidth = 100;
              const tooltipHeight = 50;
              const tooltipX = tooltipPos.x < tooltipWidth / 2 ? 0 : 
                               tooltipPos.x + tooltipWidth > (screenWidth - 80) ? (screenWidth - 80) - tooltipWidth : 
                               tooltipPos.x - tooltipWidth / 2;
              const tooltipY = tooltipPos.y > 60 ? tooltipPos.y - 65 : tooltipPos.y + 15;

              return (
                <View>
                  <Svg>
                    <Rect
                      x={tooltipX}
                      y={tooltipY}
                      width={tooltipWidth}
                      height={tooltipHeight}
                      fill="#262a31"
                      rx={8}
                    />
                    <SvgText
                      x={tooltipX + tooltipWidth / 2}
                      y={tooltipY + 18}
                      fill="#dfe2eb"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {`${tooltipPos.value >= 0 ? '+$' : '-$'}${Math.abs(tooltipPos.value).toFixed(2)}`}
                    </SvgText>
                    <SvgText
                      x={tooltipX + tooltipWidth / 2}
                      y={tooltipY + 36}
                      fill={pctChangeStr.includes('+') ? '#01c896' : pctChangeStr !== "0.0%" ? '#ff5451' : '#c2c6d6'}
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {`${activePoint?.date} • ${pctChangeStr}`}
                    </SvgText>
                  </Svg>
                </View>
              );
            }}
          />
        </View>
      )}
    </Animated.View>
  );
};
