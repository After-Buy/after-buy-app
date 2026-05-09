import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { FaqListItem, getFaqList } from "../../services/api/faqApi";
import { guideListStyles, noticeListStyles } from "../../styles/menu/menuStyle";

export default function GuideListScreen() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<FaqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    size: 10,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const result = await getFaqList({
        page,
        size: 10,
      });

      setData(result.faqs);
      setPagination(result.pagination);
    } catch (error: any) {
      console.log("[FAQ LIST ERROR]", error);
      console.log("[FAQ LIST ERROR STATUS]", error.response?.status);
      console.log("[FAQ LIST ERROR DATA]", error.response?.data);
      console.log("[FAQ LIST ERROR URL]", error.config?.url);
      console.log("[FAQ LIST ERROR METHOD]", error.config?.method);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      if (page !== 1) {
        setPage(1);
        return;
      }

      await fetchFaqs();
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFaqs();
    }, [page]),
  );

  return (
    <View style={guideListStyles.screen}>
      <View style={guideListStyles.headerArea}>
        <AppHeader title="이용 안내" leftType="back" rightType="none" />
      </View>

      <Text style={guideListStyles.helperText}>
        서비스 이용 중 자주 찾는 기능과 사용 방법을 확인해보세요.
      </Text>

      {loading ? (
        <View style={guideListStyles.emptyWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={guideListStyles.emptyDescription}>
            이용 안내를 불러오는 중입니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item) => String(item.faqId)}
          contentContainerStyle={[
            guideListStyles.listContent,
            guideListStyles.listContentWithPagination,
            data.length === 0 && guideListStyles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={guideListStyles.emptyWrap}>
              <Text style={guideListStyles.emptyTitle}>
                이용 안내가 없습니다
              </Text>
              <Text style={guideListStyles.emptyDescription}>
                현재 표시할 수 있는 이용 안내 항목이 없어요.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.88}
              style={guideListStyles.guideCard}
              onPress={() =>
                navigation.navigate("GuideDetail", {
                  faqId: item.faqId,
                })
              }
            >
              <View style={guideListStyles.iconWrap}>
                <MaterialCommunityIcons
                  name="book-open-page-variant-outline"
                  size={22}
                  color={colors.primaryDark}
                />
              </View>

              <View style={guideListStyles.textArea}>
                <Text style={guideListStyles.title} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={guideListStyles.preview} numberOfLines={2}>
                  자세한 이용 방법을 확인해보세요.
                </Text>

                <Text style={guideListStyles.date}>{item.createdAt}</Text>
              </View>

              <View style={guideListStyles.arrowWrap}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={noticeListStyles.fixedPaginationArea}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={page <= 1}
          style={[
            noticeListStyles.pageButton,
            page <= 1 && noticeListStyles.pageButtonDisabled,
          ]}
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color={page <= 1 ? "#94A3B8" : colors.white}
          />
        </TouchableOpacity>

        <View style={noticeListStyles.pageIndicator}>
          <Text style={noticeListStyles.pageCurrentText}>{page}</Text>
          <Text style={noticeListStyles.pageSlashText}>/</Text>
          <Text style={noticeListStyles.pageTotalText}>
            {Math.max(pagination.totalPages, 1)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={page >= pagination.totalPages}
          style={[
            noticeListStyles.pageButton,
            page >= pagination.totalPages &&
              noticeListStyles.pageButtonDisabled,
          ]}
          onPress={() =>
            setPage((prev) =>
              Math.min(prev + 1, Math.max(pagination.totalPages, 1)),
            )
          }
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={page >= pagination.totalPages ? "#94A3B8" : colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
