import React from "react";
import { Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";
import { AssetSummary } from "../../../types/home";

interface Props {
  summary: AssetSummary;
}

function formatCurrency(value: number) {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1).replace(/\.0$/, "")}억`;
  }

  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}만`;
  }

  return `${value.toLocaleString()}원`;
}

export default function AssetSummaryRow({ summary }: Props) {
  return (
    <View style={homeStyles.summaryRow}>
      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryNumber}>{summary.assetCount}</Text>
        <Text style={homeStyles.summaryLabel}>전체 자산</Text>
      </View>

      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryNumber}>
          {formatCurrency(summary.totalValue)}
        </Text>
        <Text style={homeStyles.summaryLabel}>총 자산 가치</Text>
      </View>

      <View style={homeStyles.summaryItem}>
        <Text style={homeStyles.summaryNumber}>
          {summary.expiringSoonCount}
        </Text>
        <Text style={homeStyles.summaryLabel}>만료 임박</Text>
      </View>
    </View>
  );
}
