// hooks/useSettings.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  SettingsState,
} from "../types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        // Auto-persist on every change
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next)).catch(
          (err) => console.error("Failed to auto-save settings:", err),
        );
        return next;
      });
    },
    [],
  );

  const reset = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
  }, []);

  return { settings, update, reset, loading };
}
