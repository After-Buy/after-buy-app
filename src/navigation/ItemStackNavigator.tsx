import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ItemDetailScreen from "../screens/item/ItemDetailScreen";
import ItemListScreen from "../screens/item/ItemListScreen";
import ItemRegisterModelScreen from "../screens/item/ItemRegisterModelScreen";
import OCRCameraScreen from "../screens/OCR/OCRCameraScreen";
import { ItemStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<ItemStackParamList>();

export default function ItemNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="ItemList"
        component={ItemListScreen}
        initialParams={{ folderId: null, folderName: "전체 자산" }}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name="ItemRegisterModel"
        component={ItemRegisterModelScreen}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="OCRCamera"
        component={OCRCameraScreen}
        options={{ animation: "fade_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
