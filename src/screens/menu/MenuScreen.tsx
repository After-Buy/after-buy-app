import { runUnauthorizedHandler } from "@/src/services/api/api";
import { authApi } from "@/src/services/api/authapi";
import { modalStyles } from "@/src/styles/modalStyle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
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

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutErrorVisible, setLogoutErrorVisible] = useState(false);

  const loadMenuData = useCallback(async () => {
    try {
      setStatus("loading");

      const p = await authApi.getMyProfile();

      if (!p) throw new Error();

      setProfile({
        nickname: p.nickname,
        email: p.email,
        profileImage: p.profileImageUrl,
      });

      setStatus("loaded");
    } catch (error) {
      console.log("[MENU_PROFILE_LOAD_ERROR]", error);
      setStatus("error");
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await loadMenuData();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadMenuData]);

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
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }

      setLogoutModalVisible(false);

      runUnauthorizedHandler();
    } catch (error: any) {
      console.log("[LOGOUT_ERROR_STATUS]", error.response?.status);
      console.log("[LOGOUT_ERROR_DATA]", error.response?.data);
      console.log("[LOGOUT_ERROR_MESSAGE]", error.message);

      setLogoutModalVisible(false);
      setLogoutErrorVisible(true);
    }
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
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={modalStyles.confirmOverlay}>
          <View style={modalStyles.confirmBox}>
            <MaterialCommunityIcons
              name="logout"
              size={30}
              color={colors.danger}
              style={{ alignSelf: "center" }}
            />

            <Text style={modalStyles.confirmText}>
              현재 계정에서 로그아웃하시겠습니까?
            </Text>

            <View style={modalStyles.confirmButtons}>
              <Pressable
                style={modalStyles.confirmButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={modalStyles.confirmCancelText}>취소</Text>
              </Pressable>

              <Pressable
                style={[
                  modalStyles.confirmButton,
                  modalStyles.confirmConfirmButton,
                ]}
                onPress={handleConfirmLogout}
              >
                <Text style={modalStyles.confirmConfirmText}>로그아웃</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={logoutErrorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutErrorVisible(false)}
      >
        <View style={modalStyles.confirmOverlay}>
          <View style={modalStyles.confirmBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={30}
              color={colors.danger}
              style={{ alignSelf: "center" }}
            />

            <Text style={modalStyles.confirmTitle}>오류 발생</Text>

            <Text style={modalStyles.confirmText}>
              로그아웃 처리 중 문제가 발생했습니다.
            </Text>

            <View style={modalStyles.confirmButtons}>
              <Pressable
                style={[
                  modalStyles.confirmButton,
                  modalStyles.confirmConfirmButton,
                  { marginLeft: 0 },
                ]}
                onPress={() => setLogoutErrorVisible(false)}
              >
                <Text style={modalStyles.confirmConfirmText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
