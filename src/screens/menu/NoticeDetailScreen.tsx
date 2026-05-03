import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { noticeDetailStyles } from "../../styles/menu/menuStyle";

export default function NoticeDetailScreen({ route }: any) {
  const notice = route.params?.notice;

  return (
    <View style={noticeDetailStyles.screen}>
      <View style={noticeDetailStyles.headerArea}>
        <AppHeader title="공지사항" leftType="back" rightType="none" />
      </View>

      <ScrollView
        contentContainerStyle={noticeDetailStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={noticeDetailStyles.container}>
          <View style={noticeDetailStyles.noticeCard}>
            <View style={noticeDetailStyles.topSection}>
              <Text style={noticeDetailStyles.badge}>NOTICE</Text>

              <Text style={noticeDetailStyles.title}>
                {notice?.title ?? "제목 없음"}
              </Text>

              <View style={noticeDetailStyles.metaRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={colors.textMuted}
                />
                <Text style={noticeDetailStyles.date}>
                  {notice?.createdAt ?? ""}
                </Text>
              </View>
            </View>

            <View style={noticeDetailStyles.divider} />

            <View style={noticeDetailStyles.contentSection}>
              <Text style={noticeDetailStyles.content}>
                {(notice?.content ?? "내용이 없습니다.").replace(/\\n/g, "\n")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
