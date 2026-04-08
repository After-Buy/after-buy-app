import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import HomeScreen from "../screens/home/HomeScreen";
import NotificationScreen from "../screens/notification/NotificationScreen";
import { notificationService } from "../services/database/notificationService";
import { MainTabParamList } from "../types/navigation";
import ItemNavigator from "./ItemStackNavigator";
import MenuStackNavigator from "./MenuStackNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
interface TabIconProps {
  name: IconName;
  size: number;
  color: string;
}

const TabIcon = ({ name, size, color }: TabIconProps) => {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

export default function MainTabNavigator() {
  const [hasUnread, setHasUnread] = useState(false);

  const refreshUnread = useCallback(async () => {
    const unread = await notificationService.isThereAnyUnread();
    setHasUnread(unread);
  }, []);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  useFocusEffect(
    useCallback(() => {
      refreshUnread();
    }, [refreshUnread]),
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => {
          let name: IconName;
          if (route.name === "홈")
            name = props.focused ? "home" : "home-outline";
          else if (route.name === "아이템")
            name = props.focused ? "archive" : "archive-outline";
          else if (route.name === "알림") {
            if (hasUnread) {
              name = props.focused ? "bell-badge" : "bell-badge-outline";
            } else {
              name = props.focused ? "bell" : "bell-outline";
            }
          } else name = "menu";
          return TabIcon({ ...props, name });
        },
        headerShown: false,
        animation: "shift",
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="아이템" component={ItemNavigator} />
      <Tab.Screen name="알림">
        {() => <NotificationScreen onUnreadChanged={refreshUnread} />}
      </Tab.Screen>
      <Tab.Screen name="메뉴" component={MenuStackNavigator} />
    </Tab.Navigator>
  );
}
