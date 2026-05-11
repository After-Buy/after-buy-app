import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Login: undefined;
  KakaoLogin: undefined;
};

export type MainTabParamList = {
  홈: undefined;
  아이템: NavigatorScreenParams<ItemStackParamList>;
  알림: undefined;
  메뉴: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ItemDetail:
    | {
        deviceId: number;
        mode?: "view" | "edit";
        ocrResult?: OCRResultPayload;
        from?: "home" | "item";
        ocrOriginalResult?: OCROriginalResult | null;
        ocrLogId?: number | null;
        draftSnapshot?: DeviceDraftPayload;
      }
    | {
        deviceId?: undefined;
        folderId?: number | null;
        folderName?: string;
        modelName: string;
        productInfo?: ProductSearchPayload;
        mode: "edit";
        from?: "home" | "item";
        ocrResult?: OCRResultPayload;
        ocrOriginalResult?: OCROriginalResult | null;
        ocrLogId?: number | null;
        draftSnapshot?: DeviceDraftPayload;
      };
  ItemRegisterModel:
    | {
        folderId?: number | null;
        folderName?: string;
        ocrResult?: OCRResultPayload;
        ocrOriginalResult?: OCROriginalResult | null;
        ocrLogId?: number | null;
      }
    | undefined;

  ServiceCenterMap: {
    brand: string;
    productName?: string;
  };

  OCRCamera: {
    ocrType: OCRType;
    sourceScreen: "ItemRegisterModel" | "ItemDetail";
    itemDetailParams?:
      | {
          deviceId: number;
          mode?: "view" | "edit";
          from?: "home" | "item";
          ocrResult?: OCRResultPayload;
          ocrOriginalResult?: OCROriginalResult | null;
          ocrLogId?: number | null;
          draftSnapshot?: DeviceDraftPayload;
        }
      | {
          deviceId?: undefined;
          folderId?: number | null;
          folderName?: string;
          modelName: string;
          productInfo?: ProductSearchPayload;
          mode: "edit";
          from?: "home" | "item";
          ocrResult?: OCRResultPayload;
          ocrOriginalResult?: OCROriginalResult | null;
          ocrLogId?: number | null;
          draftSnapshot?: DeviceDraftPayload;
        };
  };
};

export type OCRType = "MODEL" | "SERIAL" | "RECEIPT";

export type OCRResultPayload =
  | {
      ocrType: "MODEL";
      model_name: string;
    }
  | {
      ocrType: "SERIAL";
      serial_number: string;
    }
  | {
      ocrType: "RECEIPT";
      purchase_date?: string;
      purchase_price?: string;
      purchase_store?: string;
    };

export type OCROriginalResult = {
  model_name?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  purchase_store?: string;
};

export type ProductSearchPayload = {
  product_name?: string;
  model_name: string;
  brand?: string;
  image_url?: string;
  product_link_url?: string;
};

export type DeviceDraftPayload = {
  folder_id: number | null;
  product_name: string;
  model_name: string;
  brand: string;
  image_url: string;
  product_link_url: string;
  purchase_date: string;
  purchase_price: string;
  purchase_store: string;
  warranty_months: string;
  serial_number: string;
  memo: string;
};

export type ItemStackParamList = {
  ItemList: { folderId?: number | null; folderName?: string } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

export type NoticeCategoryApi = "ALL" | "NOTICE" | "MAINTENANCE" | "UPDATE";
export type NoticeCategoryLabel = "전체" | "안내" | "점검" | "업데이트";

export type NoticeListItem = {
  noticeId: number;
  title: string;
  category: NoticeCategoryLabel;
  categoryApi: Exclude<NoticeCategoryApi, "ALL">;
  isPinned: boolean;
  isNew: boolean;
  isRead: boolean;
  createdAt: string;
};

export type NoticeDetail = NoticeListItem & {
  content: string;
  createdBy: number;
  updatedAt: string;
};

export type HomeScreenProps = BottomTabScreenProps<MainTabParamList, "홈">;
