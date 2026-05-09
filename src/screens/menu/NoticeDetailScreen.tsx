import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import {
  getAnnouncementDetail,
  markAnnouncementAsRead,
  NoticeDetail,
} from "../../services/api/announcementApi";
import { noticeDetailStyles } from "../../styles/menu/menuStyle";

export default function NoticeDetailScreen({ route }: any) {
  const noticeId = route.params?.noticeId;

  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNoticeDetail = async () => {
    try {
      setLoading(true);

      const detail = await getAnnouncementDetail(noticeId);
      setNotice(detail);

      await markAnnouncementAsRead(noticeId);
      await AsyncStorage.setItem("noticeUpdated", "1");
    } catch (e) {
      console.log("[공지사항 상세 조회 실패]", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noticeId) {
      loadNoticeDetail();
    }
  }, [noticeId]);

  return (
    <View style={noticeDetailStyles.screen}>
      <View style={noticeDetailStyles.headerArea}>
        <AppHeader title="공지사항" leftType="back" rightType="none" />
      </View>

      {loading ? (
        <View style={noticeDetailStyles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primaryDark} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={noticeDetailStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={noticeDetailStyles.container}>
            <View style={noticeDetailStyles.noticeCard}>
              <View style={noticeDetailStyles.topSection}>
                <Text style={noticeDetailStyles.badge}>
                  {notice?.category ?? "NOTICE"}
                </Text>

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
                  {(notice?.content ?? "내용이 없습니다.").replace(
                    /\\n/g,
                    "\n",
                  )}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
