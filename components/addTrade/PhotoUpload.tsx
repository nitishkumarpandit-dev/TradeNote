// components/addTrade/PhotoUpload.tsx

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoUploadProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function PhotoUpload({ photos, onAdd, onRemove }: PhotoUploadProps) {
  return (
    <View style={styles.container}>
      {photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previews}
        >
          {photos.map((uri, i) => (
            <View key={i} style={styles.previewWrap}>
              <Image source={{ uri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemove(i)}
              >
                <MaterialIcons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.dropzone}
        onPress={onAdd}
        activeOpacity={0.7}
      >
        <MaterialIcons name="add-a-photo" size={28} color="#424754" />
        <Text style={styles.dropzoneText}>TAP TO UPLOAD CHART</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  previews: { marginBottom: 4 },
  previewWrap: { position: "relative", marginRight: 8 },
  preview: { width: 80, height: 80, borderRadius: 8 },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 2,
  },
  dropzone: {
    height: 120,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(66,71,84,0.4)",
    borderRadius: 16,
    backgroundColor: "rgba(24,28,34,0.3)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dropzoneText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#424754",
    textTransform: "uppercase",
  },
});
