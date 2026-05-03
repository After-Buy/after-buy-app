import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";
import { AssetSummary, HomeItem } from "../../../types/home";
import AssetSummaryRow from "./AssetSummaryRow";
import EmptyAssetCard from "./EmptyAssetCard";
import RecentItemCard from "./RecentItemCard";

interface Props {
  summary: AssetSummary;
  recentItems: HomeItem[];
  onPressViewAll: () => void;
  onPressItem: (id: number) => void;
}

export default function HomeAssetSection({
  summary,
  recentItems,
  onPressViewAll,
  onPressItem,
}: Props) {
  if (recentItems.length === 0) {
    return <EmptyAssetCard />;
  }

  return (
    <View style={homeStyles.sectionCard}>
      <AssetSummaryRow summary={summary} />

      {recentItems.slice(0, 3).map((item) => (
        <RecentItemCard key={item.id} item={item} onPress={onPressItem} />
      ))}

      <Pressable style={homeStyles.viewAllButton} onPress={onPressViewAll}>
        <View style={homeStyles.viewAllRow}>
          <Text style={homeStyles.viewAllText}>모두 보기</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={23}
            color={colors.textSecondary}
            style={{ marginLeft: -4 }}
          />
        </View>
      </Pressable>
    </View>
  );
}
