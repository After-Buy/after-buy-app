import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import ItemDetailScreen from "../screens/item/ItemDetailScreen";
import ItemRegisterModelScreen from "../screens/item/ItemRegisterModelScreen";
import OCRCameraScreen from "../screens/OCR/OCRCameraScreen";
import ServiceCenterMapScreen from "../screens/serviceCenter/ServiceCenterMapScreen";
import { setUnauthorizedHandler } from "../services/api/api";
import { RootStackParamList } from "../types/navigation";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setIsLogin(false);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      handleLogout();
    });
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setIsLogin(true);
      }
    };

    checkLogin();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogin ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="ItemDetail"
            component={ItemDetailScreen}
            options={{ animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="ItemRegisterModel"
            component={ItemRegisterModelScreen}
            options={{ animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="OCRCamera"
            component={OCRCameraScreen}
            options={{ animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="ServiceCenterMap"
            component={ServiceCenterMapScreen}
            options={{ animation: "fade_from_bottom" }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth">
          {() => <AuthNavigator onLogin={handleLogin} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
