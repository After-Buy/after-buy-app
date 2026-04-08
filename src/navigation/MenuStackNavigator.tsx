import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import GuideDetailScreen from "../screens/menu/GuideDetailScreen";
import GuideListScreen from "../screens/menu/GuideListScreen";
import MenuScreen from "../screens/menu/MenuScreen";
import NoticeDetailScreen from "../screens/menu/NoticeDetailScreen";
import NoticeListScreen from "../screens/menu/NoticeListScreen";
import ProfileEditScreen from "../screens/menu/ProfileEditScreen";
import WithdrawNoticeScreen from "../screens/menu/WithdrawNoticeScreen";

const Stack = createNativeStackNavigator();

export default function MenuStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuMain" component={MenuScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="NoticeList" component={NoticeListScreen} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
      <Stack.Screen name="GuideList" component={GuideListScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
      <Stack.Screen
        name="WithdrawNotice"
        component={WithdrawNoticeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
