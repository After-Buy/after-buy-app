import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ItemListScreen from "../screens/item/ItemListScreen";
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
    </Stack.Navigator>
  );
}
