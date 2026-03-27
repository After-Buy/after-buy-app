import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ItemDetailScreen from "../screens/item/ItemDetailScreen";
import ItemListScreen from "../screens/item/ItemListScreen";
import ItemRegisterModelScreen from "../screens/item/ItemRegisterModelScreen";
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
      />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen
        name="ItemRegisterModel"
        component={ItemRegisterModelScreen}
      />
    </Stack.Navigator>
  );
}
