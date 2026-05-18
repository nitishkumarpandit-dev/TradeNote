// components/profile/BrokerListSheet.tsx

import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { fetchWithAuth } from "../../services/api";

interface Broker {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "equity" | "crypto";
}

const BROKERS: Broker[] = [
  {
    id: "delta",
    name: "Delta exchange",
    description: "Connect with delta exchange!",
    icon: "https://www.delta.exchange/favicon.ico",
    type: "crypto",
  },
];

interface BrokerListSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onSelect?: (broker: Broker) => void;
}

export function BrokerListSheet({
  bottomSheetRef,
  onSelect,
}: BrokerListSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["75%"], []);

  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outboundIp, setOutboundIp] = useState<string>("Loading...");

  const { getToken } = useAuth();

  // Fetch outbound IP on mount
  React.useEffect(() => {
    const fetchIp = async () => {
      try {
        const data = await fetchWithAuth("/system/outbound-ip", getToken);
        setOutboundIp(data?.ip || "Could not fetch IP");
      } catch (err) {
        console.error("IP Fetch Error:", err);
        setOutboundIp("Could not fetch IP");
      }
    };
    fetchIp();
  }, [getToken]);

  const handleClose = useCallback(() => {
    setSelectedBroker(null);
    bottomSheetRef.current?.close();
  }, []);

  const handleBack = useCallback(() => {
    setSelectedBroker(null);
  }, []);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: "Copied",
      text2: "IP Address copied to clipboard.",
    });
  };

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter both API Key and API Secret.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetchWithAuth("/broker/connect/delta", getToken, {
        method: "POST",
        body: JSON.stringify({ apiKey, apiSecret }),
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delta Exchange connected successfully!",
        });
        handleClose();
        if (selectedBroker && onSelect) {
          onSelect(selectedBroker);
        }
      }
    } catch (error: any) {
      console.error("Broker Connection Failed:", error);
      Toast.show({
        type: "error",
        text1: "Connection Failed",
        text2: error.message || "Could not connect to broker. Please check your credentials and IP whitelisting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderBrokerItem = (broker: Broker) => (
    <TouchableOpacity
      key={broker.id}
      style={styles.brokerCard}
      onPress={() => {
        if (broker.id === "delta") {
          setSelectedBroker(broker);
        } else {
          onSelect?.(broker);
          handleClose();
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.logoWrap}>
        <MaterialIcons name="account-balance" size={20} color="#43e5b1" />
      </View>
      <View style={styles.brokerText}>
        <Text style={styles.brokerName}>{broker.name}</Text>
        <Text style={styles.brokerDesc} numberOfLines={1}>
          {broker.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const equityBrokers = BROKERS.filter((b) => b.type === "equity");
  const cryptoBrokers = BROKERS.filter((b) => b.type === "crypto");

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
      handleStyle={styles.handleWrap}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedBroker
            ? `Connect to ${selectedBroker.name}`
            : "Select Your Broker"}
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={selectedBroker ? handleBack : handleClose}
        >
          <MaterialIcons
            name={selectedBroker ? "close" : "close"}
            size={20}
            color="#8c909f"
          />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {selectedBroker ? (
          <View style={styles.form}>
            {/* API Key */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>API Key</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your API Key"
                placeholderTextColor="rgba(140,144,159,0.5)"
                value={apiKey}
                onChangeText={setApiKey}
                selectionColor="#43e5b1"
              />
            </View>

            {/* API Secret */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>API Secret</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your API Secret"
                placeholderTextColor="rgba(140,144,159,0.5)"
                value={apiSecret}
                onChangeText={setApiSecret}
                secureTextEntry
                selectionColor="#43e5b1"
              />
            </View>

            {/* IP Address */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>IP Address</Text>
              <View style={styles.ipContainer}>
                <TextInput
                  style={styles.ipInput}
                  value={outboundIp}
                  editable={false}
                  selectionColor="#43e5b1"
                />
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => copyToClipboard(outboundIp)}
                >
                  <MaterialIcons
                    name="content-copy"
                    size={20}
                    color="#8c909f"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.helpText}>
                Copy this IP Address and paste in your broker&apos;s developer
                settings
              </Text>
            </View>

            {/* Help Link */}
            <TouchableOpacity style={styles.helpLink}>
              <MaterialIcons name="info" size={20} color="#4d8eff" />
              <Text style={styles.helpLinkText}>
                How to connect delta exchange?
              </Text>
            </TouchableOpacity>

            {/* Connect Button */}
            <View style={styles.formFooter}>
              <TouchableOpacity
                style={[
                  styles.mainConnectBtn,
                  isSubmitting && { opacity: 0.7 },
                ]}
                onPress={handleConnect}
                disabled={isSubmitting}
              >
                <Text style={styles.mainConnectBtnText}>
                  {isSubmitting ? "Connecting..." : "Connect"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Crypto Brokers</Text>
            </View>

            <View style={styles.grid}>{BROKERS.map(renderBrokerItem)}</View>

            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>
                More brokers coming soon... Stay tuned!
              </Text>
            </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#1c2026",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handleWrap: { paddingTop: 10, paddingBottom: 0 },
  handle: {
    backgroundColor: "rgba(255,255,255,0.1)",
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  brokerCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(67, 229, 177, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  brokerText: {
    flex: 1,
    gap: 2,
  },
  brokerName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  brokerDesc: {
    color: "#8c909f",
    fontSize: 10,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 4,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  comingSoon: {
    marginTop: 12,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(110, 110, 110, 0.57)",
    borderStyle: "dashed",
    alignItems: "center",
  },
  comingSoonText: {
    color: "#8c909f",
    fontSize: 13,
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  ipContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  ipInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 15,
  },
  copyBtn: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  helpText: {
    color: "#8c909f",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  helpLinkText: {
    color: "#4d8eff",
    fontSize: 14,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 183, 0, 0.05)",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 183, 0, 0.15)",
  },
  warningText: {
    color: "#ffb700",
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
    fontWeight: "500",
  },
  linkText: {
    color: "#4d8eff",
    textDecorationLine: "underline",
  },
  formFooter: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  mainConnectBtn: {
    backgroundColor: "#108a45",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  mainConnectBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
