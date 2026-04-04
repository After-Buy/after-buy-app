import React from "react";
import { Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";
import { AssetSummary } from "../../../types/home";

interface Props {
  summary: AssetSummary;
}

export default function AssetSummaryRow({ summary }: Props) {
  return (
    <View style={homeStyles.summaryRow}>
      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryValue}>{summary.assetCount}개 자산</Text>
      </View>

      <View style={homeStyles.summaryDivider} />

      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryValue}>
          총 가치 {summary.totalValue.toLocaleString()}원
        </Text>
      </View>

      <View style={homeStyles.summaryDivider} />

      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryValue}>
          보증 만료 임박 {summary.expiringSoonCount}건
        </Text>
      </View>
    </View>
  );
}
