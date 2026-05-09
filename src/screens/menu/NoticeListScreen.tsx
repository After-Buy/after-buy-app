import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import {
  getAnnouncements,
  NoticeListItem,
} from "../../services/api/announcementApi";
import { noticeListStyles } from "../../styles/menu/menuStyle";

type NoticeCategory = "전체" | "안내" | "점검" | "업데이트";

const CATEGORIES = [
  { label: "전체", value: "ALL" },
  { label: "안내", value: "NOTICE" },
  { label: "점검", value: "MAINTENANCE" },
  { label: "업데이트", value: "UPDATE" },
] as const;

const CATEGORY_STYLE = {
  안내: {
    bg: "#E8F3FF",
    border: "#BFDFFF",
    text: "#2F80ED",
    selectedBg: colors.primaryDark,
    selectedText: colors.white,
  },
  점검: {
    bg: "#FFF4E5",
    border: "#FFD8A8",
    text: "#E67E22",
    selectedBg: "#E67E22",
    selectedText: colors.white,
  },
  업데이트: {
    bg: "#EAFBF2",
    border: "#B7F0D2",
    text: "#27AE60",
    selectedBg: "#2ECC71",
    selectedText: colors.white,
  },
  전체: {
    bg: "#F1F5F9",
    border: "#CBD5E1",
    text: "#475569",
    selectedBg: colors.textPrimary,
    selectedText: colors.white,
  },
};

export default function NoticeListScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [pinnedNotices, setPinnedNotices] = useState<NoticeListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    size: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<FlatList>(null);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAnnouncements({
        category: selectedCategory as any,
        page,
        size: 10,
      });

      setPinnedNotices(result.pinnedAnnouncements);
      setNotices(result.announcements);
      setPagination(result.pagination);
    } catch (e) {
      console.log("[공지사항 목록 조회 실패]", e);
      setError("공지사항을 불러오지 못했습니다.");
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

      await loadAnnouncements();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [selectedCategory, page]);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [page, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      const checkNoticeUpdated = async () => {
        const updated = await AsyncStorage.getItem("noticeUpdated");

        console.log("[NOTICE UPDATED]", updated);

        if (updated === "1") {
          await AsyncStorage.removeItem("noticeUpdated");
          await loadAnnouncements();
        }
      };

      checkNoticeUpdated();
    }, [selectedCategory, page]),
  );

  const listData = [
    ...pinnedNotices,
    ...notices.filter(
      (n) => !pinnedNotices.some((p) => p.noticeId === n.noticeId),
    ),
  ];

  return (
    <View style={noticeListStyles.screen}>
      <View style={noticeListStyles.headerArea}>
        <AppHeader title="공지사항" leftType="back" rightType="none" />
      </View>

      <View style={noticeListStyles.categoryWrap}>
        {CATEGORIES.map((category) => {
          const isSelected = category.value === selectedCategory;

          const styleKey = category.label as NoticeCategory;

          return (
            <TouchableOpacity
              key={category.value}
              activeOpacity={0.85}
              style={[
                noticeListStyles.categoryChip,
                {
                  backgroundColor: isSelected
                    ? CATEGORY_STYLE[styleKey].selectedBg
                    : CATEGORY_STYLE[styleKey].bg,

                  borderColor: isSelected
                    ? CATEGORY_STYLE[styleKey].selectedBg
                    : CATEGORY_STYLE[styleKey].border,

                  borderWidth: 1.2,
                },
              ]}
              onPress={() => {
                setSelectedCategory(category.value);
                setPage(1);
              }}
            >
              <Text
                style={[
                  noticeListStyles.categoryText,
                  {
                    color: isSelected
                      ? CATEGORY_STYLE[styleKey].selectedText
                      : CATEGORY_STYLE[styleKey].text,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={noticeListStyles.helperText}>
        서비스 안내, 점검, 업데이트 소식을 확인해보세요.
      </Text>

      {error && (
        <Text style={{ color: "#EF4444", textAlign: "center", marginTop: 6 }}>
          {error}
        </Text>
      )}

      <View style={noticeListStyles.topDivider} />

      <FlatList
        ref={listRef}
        data={listData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => String(item.noticeId)}
        contentContainerStyle={[
          noticeListStyles.listContent,
          noticeListStyles.listContentWithPagination,
          listData.length === 0 && noticeListStyles.emptyListContent,
        ]}
        ListEmptyComponent={
          !loading ? (
            <View style={noticeListStyles.emptyWrap}>
              <Text style={noticeListStyles.emptyTitle}>
                공지사항이 없습니다
              </Text>
              <Text style={noticeListStyles.emptyDescription}>
                선택한 카테고리에 해당하는 공지사항이 아직 없어요.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              noticeListStyles.noticeCard,
              item.isRead && noticeListStyles.noticeCardRead,
            ]}
            onPress={() =>
              navigation.navigate("NoticeDetail", {
                noticeId: item.noticeId,
              })
            }
          >
            <View style={noticeListStyles.noticeTopRow}>
              <View
                style={[
                  noticeListStyles.categoryBadge,
                  item.category === "안내" &&
                    noticeListStyles.categoryBadgeInfo,
                  item.category === "점검" &&
                    noticeListStyles.categoryBadgeInspect,
                  item.category === "업데이트" &&
                    noticeListStyles.categoryBadgeUpdate,
                ]}
              >
                <Text
                  style={[
                    noticeListStyles.categoryBadgeText,
                    item.category === "안내" &&
                      noticeListStyles.categoryBadgeTextInfo,
                    item.category === "점검" &&
                      noticeListStyles.categoryBadgeTextInspect,
                    item.category === "업데이트" &&
                      noticeListStyles.categoryBadgeTextUpdate,
                  ]}
                >
                  {item.category}
                </Text>
              </View>

              {!item.isRead && <View style={noticeListStyles.unreadDot} />}
            </View>

            <Text
              style={[
                noticeListStyles.noticeTitle,
                item.isRead && noticeListStyles.noticeTitleRead,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <View style={noticeListStyles.noticeBottomRow}>
              <Text style={noticeListStyles.noticeDate}>{item.createdAt}</Text>

              <View style={noticeListStyles.noticeArrowWrap}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
