import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import { homeStyles } from "../../../styles/homeStyle";

export default function EmptyAssetCard() {
  return (
    <View style={[homeStyles.sectionCard, homeStyles.emptyBoxWrap]}>
      <View style={homeStyles.emptyIconCircle}>
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={34}
          color={colors.primary}
        />
      </View>

      <Text style={homeStyles.emptyTitle}>아직 등록된 제품이 없어요</Text>

      <Text style={homeStyles.emptyDescription}>
        구매한 제품을 등록하면{"\n"}
        보증 기간과 관리 정보를 한눈에 확인할 수 있어요
      </Text>

      <View style={homeStyles.emptyHintBox}>
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={16}
          color={colors.primary}
        />
        <Text style={homeStyles.emptyHintText}>
          아래 등록 버튼으로 첫 제품을 추가해보세요
        </Text>
      </View>
    </View>
  );
}
