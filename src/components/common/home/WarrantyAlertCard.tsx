import React from "react";
import { Pressable, Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";
import { WarrantyAlertItem } from "../../../types/home";
import RecentItemCard from "./RecentItemCard";

interface Props {
  item?: WarrantyAlertItem | null;
  onPressProductLink: () => void;
  onPressServiceCenter: () => void;
  onPressItem: (id: number) => void;
}

export default function WarrantyAlertCard({
  item,
  onPressProductLink,
  onPressServiceCenter,
  onPressItem,
}: Props) {
  const isEmpty = !item;

  return (
    <View style={homeStyles.sectionCard}>
      <View style={homeStyles.warrantyTop}>
        <Text style={{ fontSize: 46 }}>📅</Text>

        <View style={homeStyles.warrantyTitleWrap}>
          <Text style={homeStyles.warrantyTitle}>
            {isEmpty
              ? "제품을 등록하면 보증 기간을 관리해드려요"
              : `이 제품의 보증 만료까지 D-${item.dday} 남았어요`}
          </Text>

          <Text style={homeStyles.warrantyDescription}>
            제품 정보와 가까운 서비스 센터를 확인해보세요
          </Text>
        </View>
      </View>

      {!isEmpty && <RecentItemCard item={item} onPress={onPressItem} />}

      <View style={homeStyles.actionRow}>
        <Pressable style={homeStyles.actionButton} onPress={onPressProductLink}>
          <Text>🔗</Text>
          <Text style={homeStyles.actionText}>제품 정보 링크</Text>
        </Pressable>

        <View style={homeStyles.actionDivider} />

        <Pressable
          style={homeStyles.actionButton}
          onPress={onPressServiceCenter}
        >
          <Text>📍</Text>
          <Text style={homeStyles.actionText}>가까운 서비스 센터</Text>
        </Pressable>
      </View>
    </View>
  );
}
