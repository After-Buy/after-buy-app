import { MaterialCommunityIcons } from "@expo/vector-icons";
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
        <View style={homeStyles.warrantyBadge}>
          {/* <Text style={homeStyles.warrantyBadgeEmoji}>🛡️</Text> */}
          <MaterialCommunityIcons
            name="shield-check"
            size={30}
            color="#42A5F5"
          />
        </View>

        <View style={homeStyles.warrantyTitleWrap}>
          <Text style={homeStyles.warrantyLabel}>보증 만료 알림</Text>

          <Text style={homeStyles.warrantyHeadline}>
            {isEmpty ? "보증 기간을 한눈에 관리해보세요" : `D-${item.dday}`}
          </Text>

          <Text style={homeStyles.warrantyTitle}>
            {isEmpty
              ? "제품을 등록하면 보증 기간을 관리해드려요"
              : "이 제품의 보증 만료가 얼마 남지 않았어요"}
          </Text>
        </View>
      </View>

      {!isEmpty && <RecentItemCard item={item} onPress={onPressItem} />}

      <View style={homeStyles.warrantyButtonRow}>
        <Pressable
          style={({ pressed }) => [
            homeStyles.warrantyActionButton,
            pressed && homeStyles.warrantyActionButtonPressed,
          ]}
          onPress={onPressProductLink}
        >
          <MaterialCommunityIcons
            name="link-variant"
            size={14}
            color={homeStyles.warrantyActionText.color}
          />
          <Text style={homeStyles.warrantyActionText}>제품 정보</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            homeStyles.warrantyActionButton,
            pressed && homeStyles.warrantyActionButtonPressed,
          ]}
          onPress={onPressServiceCenter}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color={homeStyles.warrantyActionText.color}
          />
          <Text style={homeStyles.warrantyActionText}>서비스센터</Text>
        </Pressable>
      </View>
    </View>
  );
}
