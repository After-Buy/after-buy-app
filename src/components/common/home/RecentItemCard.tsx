import React from "react";
import { Pressable, Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";
import { HomeItem } from "../../../types/home";

interface Props {
  item: HomeItem;
  onPress: (id: number) => void;
}

export default function RecentItemCard({ item, onPress }: Props) {
  return (
    <View style={homeStyles.recentItemRow}>
      <View style={homeStyles.recentThumbnail}>
        <Text>🖼️</Text>
      </View>

      <View style={homeStyles.recentItemInfo}>
        <Text style={homeStyles.recentItemTitle}>{item.name}</Text>
        <Text style={homeStyles.recentItemCode}>{item.modelCode}</Text>
      </View>

      <Pressable
        style={homeStyles.arrowButton}
        onPress={() => onPress(item.id)}
      >
        <Text>→</Text>
      </Pressable>
    </View>
  );
}
