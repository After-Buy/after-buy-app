import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import ItemDetailScreen from "../screens/item/ItemDetailScreen";
import ItemRegisterModelScreen from "../screens/item/ItemRegisterModelScreen";
import OCRCameraScreen from "../screens/OCR/OCRCameraScreen";
import { RootStackParamList } from "../types/navigation";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

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
        </>
      ) : (
        <Stack.Screen name="Auth">
          {() => <AuthNavigator onLogin={handleLogin} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
