import React from "react";
import { Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";

export default function EmptyAssetCard() {
  return (
    <View style={[homeStyles.sectionCard, homeStyles.emptyBoxWrap]}>
      <Text style={{ fontSize: 64 }}>📦</Text>
      <Text style={homeStyles.emptyTitle}>등록된 제품이 없어요</Text>
      <Text style={homeStyles.emptyDescription}>
        최근에 등록한 상품이 이곳에 표시됩니다
      </Text>
    </View>
  );
}
