// components/addTrade/SectionLabel.tsx

import React from "react";
import { Text } from "react-native";

interface SectionLabelProps {
  label: string;
  required?: boolean;
}

export function SectionLabel({ label, required }: SectionLabelProps) {
  return (
    <Text className="text-[10px] font-bold uppercase tracking-widest text-white px-1 mb-2">
      {label}{required && <Text style={{ color: "#ff5451" }}> *</Text>}
    </Text>
  );
}
