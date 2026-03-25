import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { ComponentProps } from "react";
import HomeScreen from "../screens/home/HomeScreen";
import ItemScreen from "../screens/item/ItemScreen";
import MenuScreen from "../screens/menu/MenuScreen";
import NotificationScreen from "../screens/notification/NotificationScreen";
import { MainTabParamList } from "../types/navigation";

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => {
          let name: IconName;
          if (route.name === "홈")
            name = props.focused ? "home" : "home-outline";
          else if (route.name === "아이템")
            name = props.focused ? "archive" : "archive-outline";
          else if (route.name === "알림")
            name = props.focused ? "bell" : "bell-outline";
          else name = "menu";
          return TabIcon({ ...props, name });
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="아이템" component={ItemScreen} />
      <Tab.Screen name="알림" component={NotificationScreen} />
      <Tab.Screen name="메뉴" component={MenuScreen} />
    </Tab.Navigator>
  );
}
