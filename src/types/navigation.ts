import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  홈: undefined;
  아이템: undefined;
  알림: undefined;
  메뉴: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type ItemStackParamList = {
  ItemList: { folderId?: number | null; folderName?: string } | undefined;
  ItemRegisterModel:
    | {
        folderId?: number | null;
        folderName?: string;
      }
    | undefined;
  ItemDetail:
    | {
        deviceId: number;
        mode?: "view" | "edit";
      }
    | {
        deviceId?: undefined;
        folderId?: number | null;
        folderName?: string;
        modelName: string;
        mode: "edit";
      };
};

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

export type HomeScreenProps = BottomTabScreenProps<MainTabParamList, "홈">;
