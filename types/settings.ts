// types/settings.ts

export interface SettingsState {
  // Trade Settings
  tradeTimeInput: boolean;
  tradeMargin: boolean;
  // Brokerage
  brokerageEnabled: boolean;
  selectedBroker: BrokerOption;
  // Preferences
  darkMode: boolean;
  notifications: boolean; // locked / coming soon
  defaultLeverage: number;
}

export type BrokerOption = "Calculate from Broker" | "Enter Manually";

export const BROKER_OPTIONS: BrokerOption[] = [
  "Calculate from Broker",
  "Enter Manually",
];

export const DEFAULT_SETTINGS: SettingsState = {
  tradeTimeInput: false,
  tradeMargin: true,
  brokerageEnabled: true,
  selectedBroker: "Enter Manually",
  darkMode: true,
  notifications: false,
  defaultLeverage: 1,
};

export const SETTINGS_STORAGE_KEY = "app_settings";
