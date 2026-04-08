import { authService } from "@/src/services/database/authService";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import ErrorState from "../../components/common/error/ErrorState";
import { colors } from "../../constants/colors";
import { menuStyles } from "../../styles/menu/menuStyle";

type MenuItemProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
};

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[menuStyles.menuItem, !isLast && menuStyles.menuItemBorder]}
      onPress={onPress}
    >
      <View style={menuStyles.menuItemLeft}>
        <View style={menuStyles.menuIconWrapper}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.icon} />
        </View>

        <View style={menuStyles.menuTextWrapper}>
          <Text style={menuStyles.menuTitle}>{title}</Text>
          {subtitle ? (
            <Text style={menuStyles.menuSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const navigation = useNavigation<any>();

  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loaded",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [profile, setProfile] = useState({
    nickname: "",
    email: "",
    profileImage: null as string | null,
  });

  const loadMenuData = useCallback(async () => {
    try {
      setStatus("loading");

      const p = await authService.getMyProfile();

      if (!p) throw new Error();

      setProfile({
        nickname: p.nickname,
        email: p.email,
        profileImage: p.profile_image_url,
      });

      setStatus("loaded");
    } catch (error) {
      setStatus("error");
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStatus("loaded");
    } catch (error) {
      setStatus("error");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMenuData();
    }, [loadMenuData]),
  );

  const handlePressProfile = () => {
    navigation.navigate("ProfileEdit");
  };

  const handlePressNotice = () => {
    navigation.navigate("NoticeList");
  };

  const handlePressGuide = () => {
    navigation.navigate("GuideList");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            // TODO:
            // await authService.logout();
            // await clearAuthStorage();
            // navigation reset 처리
          } catch (error) {
            Alert.alert("오류", "로그아웃에 실패했습니다.");
          }
        },
      },
    ]);
  };

  if (status === "error") {
    return (
      <View style={menuStyles.screen}>
        <View style={menuStyles.headerArea}>
          <AppHeader title="메뉴" leftType="none" rightType="none" />
        </View>

        <View style={menuStyles.errorContent}>
          <ErrorState
            title="정보를 불러오지 못했습니다"
            buttonText="다시 시도"
            onPress={loadMenuData}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={menuStyles.screen}>
      <View style={menuStyles.headerArea}>
        <AppHeader title="메뉴" leftType="none" rightType="none" />
      </View>

      <ScrollView
        contentContainerStyle={menuStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={menuStyles.profileCard}
          onPress={handlePressProfile}
        >
          <View style={menuStyles.profileLeft}>
            <Image
              source={
                profile.profileImage
                  ? { uri: profile.profileImage }
                  : { uri: "https://via.placeholder.com/300x300.png?text=K" }
              }
              style={menuStyles.profileImage}
            />

            <View style={menuStyles.profileTextWrapper}>
              <Text style={menuStyles.profileName}>{profile.nickname}</Text>
              <Text style={menuStyles.profileEmail}>{profile.email}</Text>
            </View>
          </View>

          <View style={menuStyles.profileChevron}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>

        <View style={menuStyles.section}>
          <Text style={menuStyles.sectionTitle}>고객 지원</Text>

          <View style={menuStyles.menuCard}>
            <MenuItem
              icon="bullhorn-outline"
              title="공지사항"
              subtitle="점검, 업데이트, 서비스 안내"
              onPress={handlePressNotice}
            />
            <MenuItem
              icon="help-circle-outline"
              title="이용 안내"
              subtitle="서비스 이용 관련 도움말"
              onPress={handlePressGuide}
              isLast
            />
          </View>
        </View>

        <View style={menuStyles.section}>
          <Text style={menuStyles.sectionTitle}>계정</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={menuStyles.logoutButton}
            onPress={handleLogout}
          >
            <View style={menuStyles.logoutIconWrap}>
              <MaterialCommunityIcons
                name="logout"
                size={18}
                color={colors.danger}
              />
            </View>
            <Text style={menuStyles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
