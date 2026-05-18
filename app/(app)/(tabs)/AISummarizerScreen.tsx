import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const AISummarizerScreen = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');
  const [targetMarket, setTargetMarket] = useState('Crypto');
  const [marketModalVisible, setMarketModalVisible] = useState(false);
  const [customRangeModalVisible, setCustomRangeModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const analysisInfo = [
    {
      title: 'Data Source',
      description: 'All trades from selected period',
      icon: 'database',
      color: '#4d8eff',
    },
    {
      title: 'Analysis Focus',
      description: 'Performance metrics, strategy patterns',
      icon: 'brain',
      color: '#a855f7',
    },
    {
      title: 'Output Format',
      description: 'Structured insights with recommendations',
      icon: 'file-document-outline',
      color: '#10b981',
    },
    {
      title: 'Response Time',
      description: 'Usually 10–20 seconds',
      icon: 'clock-outline',
      color: '#f59e0b',
    },
  ];

  const periods = ['30 Days', '60 Days', '90 Days', 'Custom'];
  const markets = ['Crypto', 'Forex', 'Indian'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Analysis</Text>
      </View>

      <View style={styles.mainContainer}>
        {/* Period Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Select Analysis Period
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.periodScroll}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => {
                  setSelectedPeriod(period);
                  if (period === 'Custom') setCustomRangeModalVisible(true);
                }}
                style={[
                  styles.periodChip,
                  selectedPeriod === period ? styles.periodChipActive : styles.periodChipInactive
                ]}
              >
                <View style={styles.periodChipContent}>
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period ? styles.periodTextActive : styles.periodTextInactive
                    ]}
                  >
                    {period}
                  </Text>
                  {period === 'Custom' && (
                    <MaterialCommunityIcons 
                      name="calendar" 
                      size={14} 
                      style={styles.periodIcon} 
                      color={selectedPeriod === period ? '#00285d' : 'white'} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Market Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Target Market
          </Text>
          <TouchableOpacity 
            onPress={() => setMarketModalVisible(true)}
            style={styles.marketSelector}
          >
            <Text style={styles.marketText}>{targetMarket}</Text>
            <MaterialIcons name="expand-more" size={24} color="#8c909f" />
          </TouchableOpacity>
        </View>

        {/* Info Section - 2x2 Grid */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            Analysis Information
          </Text>
          
          <View style={styles.infoList}>
            {analysisInfo.map((item, index) => (
              <View 
                key={index} 
                style={styles.infoItem}
              >
                <View style={[styles.infoIconContainer, { backgroundColor: `${item.color}20` }]}>
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={22} 
                    color={item.color} 
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoItemTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.infoItemDesc}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>


        {/* Action Button */}
        <TouchableOpacity 
          onPress={() => {
            router.push({
              pathname: '/ai-insights',
              params: {
                targetMarket,
                period: selectedPeriod,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
              }
            });
          }}
          activeOpacity={0.8}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>Analyze Now</Text>
        </TouchableOpacity>
      </View>

      {/* Market Picker Modal */}
      <PickerModal
        visible={marketModalVisible}
        title="Select Target Market"
        options={markets}
        selected={targetMarket}
        onSelect={(v) => setTargetMarket(v)}
        onClose={() => setMarketModalVisible(false)}
      />

      {/* Custom Date Range Modal */}
      <Modal visible={customRangeModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setCustomRangeModalVisible(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Custom Range</Text>
              <TouchableOpacity onPress={() => setCustomRangeModalVisible(false)}>
                <MaterialIcons name="close" size={18} color="#8c909f" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20, gap: 20 }}>
              <View>
                <Text style={styles.sectionLabel}>Start Date</Text>
                <TouchableOpacity style={styles.marketSelector} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.marketText}>{startDate.toISOString().split('T')[0]}</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#8c909f" />
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowStartPicker(Platform.OS === 'ios');
                      if (date) setStartDate(date);
                    }}
                  />
                )}
              </View>

              <View>
                <Text style={styles.sectionLabel}>End Date</Text>
                <TouchableOpacity style={styles.marketSelector} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.marketText}>{endDate.toISOString().split('T')[0]}</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#8c909f" />
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    minimumDate={startDate}
                    onChange={(event, date) => {
                      setShowEndPicker(Platform.OS === 'ios');
                      if (date) setEndDate(date);
                    }}
                  />
                )}
              </View>

              <TouchableOpacity 
                style={[styles.actionButton, { marginTop: 8 }]} 
                onPress={() => setCustomRangeModalVisible(false)}
              >
                <Text style={styles.actionButtonText}>Apply Range</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#10141a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24, 
    gap: 12,
    marginTop: 10,
  },
  section: {
    gap: 18,
  },
  sectionLabel: {
    color: '#c2c6d6',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  periodScroll: {
    flexDirection: 'row',
  },
  periodChip: {
    marginRight: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  periodChipActive: {
    backgroundColor: '#4d8eff',
    borderColor: '#4d8eff',
  },
  periodChipInactive: {
    backgroundColor: '#262a31',
    borderColor: 'rgba(66, 71, 84, 0.2)',
  },
  periodChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#00285d',
  },
  periodTextInactive: {
    color: 'white',
  },
  periodIcon: {
    marginLeft: 8,
  },
  marketSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0a0e14',
    borderWidth: 1,
    borderColor: 'rgba(66, 71, 84, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  marketText: {
    color: 'white',
  },
  infoSection: {
    // Removed background to make child elements individual cards
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#181c22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoIconContainer: {
    padding: 10,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 8,
  },
  infoTextContainer: {
    alignItems: 'center',
  },
  infoItemTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  infoItemDesc: {
    color: '#8c909f',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4d8eff',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
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

export default AISummarizerScreen;
