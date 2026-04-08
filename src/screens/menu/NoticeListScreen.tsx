import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { noticeListStyles } from "../../styles/menu/menuStyle";

type NoticeCategory = "전체" | "안내" | "점검" | "업데이트";

const MOCK_NOTICES = [
  {
    noticeId: 1,
    category: "안내",
    title: "[안내] After-Buy 서비스 정식 출시 안내",
    content: "After-Buy 서비스가 정식 출시되었습니다.",
    createdAt: "2026-03-01",
    isRead: false,
  },
  {
    noticeId: 2,
    category: "업데이트",
    title: "[업데이트] OCR 인식 정확도 개선 안내",
    content: "영수증 및 제품 정보 인식 정확도가 개선되었습니다.",
    createdAt: "2026-03-05",
    isRead: false,
  },
  {
    noticeId: 3,
    category: "안내",
    title: "[안내] 보증기간 알림 기능 사용 방법 안내",
    content: "보증 만료 전에 알림을 받을 수 있습니다.",
    createdAt: "2026-03-07",
    isRead: true,
  },
  {
    noticeId: 4,
    category: "점검",
    title: "[점검] 3월 2주차 서버 점검 안내",
    content: "서비스 안정화를 위한 점검이 진행됩니다.",
    createdAt: "2026-03-10",
    isRead: true,
  },
  {
    noticeId: 5,
    category: "업데이트",
    title: "[업데이트] 서비스 센터 찾기 기능 개선",
    content: "더 정확한 위치 기반 검색이 가능합니다.",
    createdAt: "2026-03-12",
    isRead: false,
  },
  {
    noticeId: 6,
    category: "안내",
    title: "[안내] 계정 및 데이터 정책 안내",
    content: "사용자 데이터 보호 정책이 업데이트되었습니다.",
    createdAt: "2026-03-15",
    isRead: true,
  },
];

const CATEGORIES: NoticeCategory[] = ["전체", "안내", "점검", "업데이트"];

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
  const [selectedCategory, setSelectedCategory] =
    useState<NoticeCategory>("전체");

  const filteredData = useMemo(() => {
    if (selectedCategory === "전체") return MOCK_NOTICES;
    return MOCK_NOTICES.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <View style={noticeListStyles.screen}>
      <View style={noticeListStyles.headerArea}>
        <AppHeader title="공지사항" leftType="back" rightType="none" />
      </View>

      <View style={noticeListStyles.categoryWrap}>
        {CATEGORIES.map((category) => {
          const isSelected = category === selectedCategory;
          return (
            <TouchableOpacity
              key={category}
              activeOpacity={0.85}
              style={[
                noticeListStyles.categoryChip,
                {
                  backgroundColor: isSelected
                    ? CATEGORY_STYLE[category].selectedBg
                    : CATEGORY_STYLE[category].bg,

                  borderColor: isSelected
                    ? CATEGORY_STYLE[category].selectedBg
                    : CATEGORY_STYLE[category].border,

                  borderWidth: 1.2,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  noticeListStyles.categoryText,
                  {
                    color: isSelected
                      ? CATEGORY_STYLE[category].selectedText
                      : CATEGORY_STYLE[category].text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={noticeListStyles.helperText}>
        서비스 안내, 점검, 업데이트 소식을 확인해보세요.
      </Text>

      <View style={noticeListStyles.topDivider} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => String(item.noticeId)}
        contentContainerStyle={noticeListStyles.listContent}
        ListEmptyComponent={
          <View style={noticeListStyles.emptyWrap}>
            <Text style={noticeListStyles.emptyTitle}>공지사항이 없습니다</Text>
            <Text style={noticeListStyles.emptyDescription}>
              선택한 카테고리에 해당하는 공지사항이 아직 없어요.
            </Text>
          </View>
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
                notice: item,
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
    </View>
  );
}
