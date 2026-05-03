import React from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { guideDetailStyles } from "../../styles/menu/menuStyle";

export default function GuideDetailScreen({ route }: any) {
  const guide = route.params?.guide;

  return (
    <View style={guideDetailStyles.screen}>
      <View style={guideDetailStyles.headerArea}>
        <AppHeader title="이용 안내" leftType="back" rightType="none" />
      </View>

      <ScrollView
        contentContainerStyle={guideDetailStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={guideDetailStyles.container}>
          <View style={guideDetailStyles.guideCard}>
            <View style={guideDetailStyles.topSection}>
              <Text style={guideDetailStyles.badge}>GUIDE</Text>

              <Text style={guideDetailStyles.title}>
                {guide?.title ?? "제목 없음"}
              </Text>

              <Text style={guideDetailStyles.date}>
                {guide?.createdAt ?? ""}
              </Text>
            </View>

            <View style={guideDetailStyles.divider} />

            <View style={guideDetailStyles.contentSection}>
              <Text style={guideDetailStyles.content}>
                {guide?.content ?? "내용이 없습니다."}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
