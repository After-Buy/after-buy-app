import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

export default function RootNavigator() {
  const isLogin = false; // 나중에 토큰으로 변경

  return (
    <NavigationContainer>
      {isLogin ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
