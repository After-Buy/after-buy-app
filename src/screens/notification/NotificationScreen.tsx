import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { authApi } from "../../services/api/authapi";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { notificationService } from "../../services/database/notificationService";
import { notificationStyle as styles } from "../../styles/notification/notificationStyle";
import { NotificationItem } from "../../types/notification";

type Props = {
  onUnreadChanged?: () => Promise<void> | void;
};

export default function NotificationScreen({ onUnreadChanged }: Props) {
  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const pendingReadIdRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    Alert.alert("", message);
  };

  const loadData = async () => {
    try {
      setIsError(false);

      const [notificationRows, pushSettings] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getPushSettings(),
      ]);

      console.log("[NOTIFICATION ROWS]", notificationRows);
      console.log("[PUSH SETTINGS]", pushSettings);

      setNotifications(notificationRows);
      setPushEnabled(pushSettings?.pushEnabled === 1);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("[NOTIFICATION SCREEN FOCUS]");
      loadData();
    }, []),
  );

  useEffect(() => {
    syncFcmToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const applyPendingRead = async () => {
        if (!pendingReadIdRef.current) return;

        const targetId = pendingReadIdRef.current;
        pendingReadIdRef.current = null;

        try {
          await notificationService.markAsRead(targetId);

          setNotifications((prev) =>
            prev.map((item) =>
              item.notification_id === targetId
                ? { ...item, is_read: 1 }
                : item,
            ),
          );

          await onUnreadChanged?.();
        } catch (error) {
          // 읽음 처리 실패는 조용히 무시
        }
      };

      applyPendingRead();
    }, [onUnreadChanged]),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
  };

  const syncFcmToken = async () => {
    try {
      console.log("[FCM TOKEN SYNC] start");

      const hasPermission = await requestNotificationPermission();

      console.log("[FCM TOKEN SYNC] permission:", hasPermission);

      if (!hasPermission) return;

      const token = await Notifications.getDevicePushTokenAsync();

      console.log("[FCM TOKEN]", token.data);

      await notificationService.updateFcmToken(String(token.data));

      console.log("[FCM TOKEN SYNC] success");
    } catch (error: any) {
      console.log("[FCM TOKEN SYNC ERROR]", {
        status: error?.response?.status,
        data: error?.response?.data,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL,
        url: error?.config?.url,
        fullUrl: `${error?.config?.baseURL ?? ""}${error?.config?.url ?? ""}`,
        body: error?.config?.data,
      });
    }
  };

  const requestNotificationPermission = async () => {
    const current = await Notifications.getPermissionsAsync();

    if (current.status === "granted") return true;

    const requested = await Notifications.requestPermissionsAsync();

    if (requested.status === "granted") return true;

    Alert.alert(
      "알림 권한이 꺼져 있습니다",
      "전체 알림을 켜려면 휴대폰 설정에서 알림 권한을 허용해야 합니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "설정 열기", onPress: () => Linking.openSettings() },
      ],
    );

    return false;
  };

  const handleTogglePush = async () => {
    if (isToggleLoading) return;

    const previous = pushEnabled;
    const next = !previous;

    if (next) {
      const hasPermission = await requestNotificationPermission();

      if (!hasPermission) {
        setPushEnabled(previous);
        return;
      }
    }

    setPushEnabled(next);
    setIsToggleLoading(true);

    try {
      await authApi.patchMyPushEnabled(next ? 1 : 0);
      showToast(`전체 알림이 ${next ? "활성화" : "비활성화"}되었습니다`);
    } catch (error: any) {
      console.log("[PUSH TOGGLE ERROR]", {
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method,
        body: error?.config?.data,
      });

      setPushEnabled(previous);
      showToast("서버 알림 동기화에 실패했습니다");
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handlePressNotification = (item: NotificationItem) => {
    if (item.is_read === 0) {
      pendingReadIdRef.current = item.notification_id;
    }

    navigation.navigate("ItemDetail", {
      deviceId: item.device_id,
      mode: "view",
      fromNotification: true,
      notificationId: item.notification_id,
    });
  };

  const handleDelete = async (notificationId: number) => {
    const previous = notifications;

    setNotifications((current) =>
      current.filter((item) => item.notification_id !== notificationId),
    );

    try {
      await notificationService.deleteNotification(notificationId);
      await onUnreadChanged?.();
    } catch (error) {
      setNotifications(previous);
      showToast("삭제에 실패했습니다");
    }
  };

  const getDdayText = (item: NotificationItem) => {
    const daysRemaining = notificationService.getDaysRemaining(
      item.warranty_expiry_date,
    );

    if (item.notification_type === "WARRANTY_EXPIRED" || daysRemaining < 0) {
      return "만료";
    }

    if (daysRemaining === 0) {
      return "D-Day";
    }

    return `D - ${daysRemaining}`;
  };

  const renderRightAction = (item: NotificationItem) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.deleteAction}
        onPress={() => handleDelete(item.notification_id)}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={22}
          color="white"
        />
        <Text style={styles.deleteActionText}>삭제</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isRead = item.is_read === 1;

    return (
      <Swipeable
        overshootRight={false}
        renderRightActions={() => renderRightAction(item)}
      >
        <Pressable
          style={[
            styles.notificationCard,
            isRead && styles.notificationCardRead,
          ]}
          onPress={() => handlePressNotification(item)}
        >
          {!isRead ? <View style={styles.unreadBadge} /> : null}

          <View style={styles.cardContentRow}>
            <View style={styles.leftSection}>
              <View style={styles.imageBox}>
                {item.device_image_url ? (
                  <Image
                    source={{ uri: item.device_image_url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color={colors.icon}
                  />
                )}
              </View>

              <Text style={styles.productName} numberOfLines={1}>
                {item.device_name}
              </Text>
            </View>

            <View style={styles.centerSection}>
              <Text style={[styles.ddayText, isRead && styles.ddayTextRead]}>
                {getDdayText(item)}
              </Text>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <AppHeader
            title="알림 내역"
            leftType="none"
            rightComponent={
              <View style={styles.headerToggleWrapper}>
                <Text style={styles.headerToggleLabel}>전체 알림</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={handleTogglePush}
                  disabled={isToggleLoading}
                  trackColor={{ false: "#D1D5DB", true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            }
          />
        </View>

        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.icon} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <AppHeader
            title="알림 내역"
            leftType="none"
            rightComponent={
              <View style={styles.headerToggleWrapper}>
                <Text style={styles.headerToggleLabel}>전체 알림</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={handleTogglePush}
                  disabled={isToggleLoading}
                  trackColor={{ false: "#D1D5DB", true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            }
          />
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>정보를 불러오지 못했습니다</Text>

          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AppHeader
          title="알림 내역"
          leftType="none"
          rightComponent={
            <View style={styles.headerToggleWrapper}>
              <Text style={styles.headerToggleLabel}>전체 알림</Text>
              <Switch
                value={pushEnabled}
                onValueChange={handleTogglePush}
                disabled={isToggleLoading}
                trackColor={{ false: "#D1D5DB", true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          }
        />

        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderInner}>
            <Text style={styles.tableHeaderProduct}>상품</Text>
            <Text style={styles.tableHeaderDday}>남은 보증 기간</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.notification_id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>최근 알림 내역이 없습니다</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
