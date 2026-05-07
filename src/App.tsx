import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./navigation/RootNavigator";
import { initDatabase } from "./services/database/sqlite";

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  const linking = {
    prefixes: ["afterbuy://"],
    config: {
      screens: {
        Main: "main",
        ItemDetail: "item/:deviceId",
        // 공지 상세 화면 만들면 여기에 추가
        AnnouncementDetail: "announcements/:announcementId",
      },
    },
  };

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error("DB 초기화 실패:", error);
      }
    }
    setup();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        console.log("[NOTIFICATION CLICK DATA]", data);

        const deepLink = data?.deep_link;

        if (deepLink) {
          Linking.openURL(String(deepLink));
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4D86E8" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
