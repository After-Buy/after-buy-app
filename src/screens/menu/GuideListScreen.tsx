import { colors } from "@/src/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { guideListStyles } from "../../styles/menu/menuStyle";

const MOCK_GUIDES = [
  {
    guideId: 1,
    title: "제품 스캔 방법",
    content:
      "앱 메인 화면에서 전자기기 등록 버튼을 눌러 영수증이나 제품 정보를 촬영하면 OCR 기능을 통해 모델명, 구매일 등의 정보가 자동으로 입력됩니다.\n\n자동 입력이 어려운 경우 직접 입력하여 등록할 수도 있습니다.",
    createdAt: "2026-02-26",
  },
  {
    guideId: 2,
    title: "보증 기간 알림 해제",
    content: "알림 설정 화면에서 해제할 수 있습니다.",
    createdAt: "2026-02-26",
  },
  {
    guideId: 3,
    title: "제품 및 폴더 위치 변경",
    content: "선택 모드에서 이동 기능으로 변경할 수 있습니다.",
    createdAt: "2026-02-26",
  },
  {
    guideId: 4,
    title: "제품 검색 방법",
    content: "모델명 또는 제품명으로 검색할 수 있습니다.",
    createdAt: "2026-02-26",
  },
];

export default function GuideListScreen() {
  const navigation = useNavigation<any>();
  const data = useMemo(() => MOCK_GUIDES, []);

  return (
    <View style={guideListStyles.screen}>
      <View style={guideListStyles.headerArea}>
        <AppHeader title="이용 안내" leftType="back" rightType="none" />
      </View>

      <Text style={guideListStyles.helperText}>
        서비스 이용 중 자주 찾는 기능과 사용 방법을 확인해보세요.
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.guideId)}
        contentContainerStyle={guideListStyles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={guideListStyles.emptyWrap}>
            <Text style={guideListStyles.emptyTitle}>이용 안내가 없습니다</Text>
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
                guide: item,
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
                {item.content}
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
    </View>
  );
}
