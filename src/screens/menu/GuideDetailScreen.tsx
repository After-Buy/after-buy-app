import { colors } from "@/src/constants/colors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { FaqDetail, getFaqDetail } from "../../services/api/faqApi";
import { guideDetailStyles } from "../../styles/menu/menuStyle";

export default function GuideDetailScreen({ route }: any) {
  const faqId = route.params?.faqId;

  const [guide, setGuide] = useState<FaqDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFaqDetail = async () => {
    if (faqId === undefined || faqId === null) {
      console.log("[FAQ DETAIL] faqId 없음");
      setLoading(false);
      setGuide(null);
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const result = await getFaqDetail(faqId);
      setGuide(result);
    } catch (error) {
      console.log("[FAQ DETAIL ERROR]", error);
      setError(true);
      setGuide(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (faqId === undefined || faqId === null) {
      console.log("[FAQ DETAIL] faqId 없음");
      setLoading(false);
      setGuide(null);
      return;
    }

    fetchFaqDetail();
  }, [faqId]);

  return (
    <View style={guideDetailStyles.screen}>
      <View style={guideDetailStyles.headerArea}>
        <AppHeader title="이용 안내" leftType="back" rightType="none" />
      </View>

      {error ? (
        <View style={guideDetailStyles.container}>
          <Text style={guideDetailStyles.content}>
            이용 안내를 불러오지 못했습니다.
          </Text>
        </View>
      ) : loading ? (
        <View style={guideDetailStyles.container}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={guideDetailStyles.content}>
            이용 안내를 불러오는 중입니다.
          </Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}
