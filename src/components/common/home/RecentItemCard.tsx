import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
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
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={homeStyles.recentThumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={28} color={colors.icon} />
        )}
      </View>

      <View style={homeStyles.recentItemInfo}>
        <Text style={homeStyles.recentItemTitle}>{item.name}</Text>
        <Text style={homeStyles.recentItemCode}>{item.modelCode}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          homeStyles.detailButton,
          pressed && homeStyles.detailButtonPressed,
        ]}
        onPress={() => onPress(item.id)}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={colors.primaryDark}
        />
      </Pressable>
    </View>
  );
}
