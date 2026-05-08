import { colors } from "@/src/constants/colors";
import { modalStyles } from "@/src/styles/modalStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../../components/common/AppHeader";
import { deviceService } from "../../services/database/deviceService";
import { itemRegisterModelStyle as styles } from "../../styles/item/itemStyle";
import { OCROriginalResult, RootStackParamList } from "../../types/navigation";

import * as ImagePicker from "expo-image-picker";

type Props = NativeStackScreenProps<RootStackParamList, "ItemRegisterModel">;

export default function ItemRegisterModelScreen({ navigation, route }: Props) {
  const { folderId = null, folderName = "전체 자산" } = route.params || {};
  const [modelName, setModelName] = useState("");
  const [imageActionVisible, setImageActionVisible] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const insets = useSafeAreaInsets();
  const [ocrOriginalResult, setOcrOriginalResult] =
    useState<OCROriginalResult | null>(null);
  const [ocrLogId, setOcrLogId] = useState<number | null>(null);

  useEffect(() => {
    const result = route.params?.ocrResult;

    if (result?.ocrType === "MODEL" && result.model_name) {
      setModelName(result.model_name);
    }
  }, [route.params?.ocrResult]);

  useLayoutEffect(() => {
    const parentTab = navigation.getParent();

    parentTab?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parentTab?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handleNext = async () => {
    const trimmed = modelName.trim();

    if (!trimmed) {
      Alert.alert("안내", "모델명을 입력해주세요.");
      return;
    }

    try {
      setIsSearching(true);

      const productInfo = await deviceService.searchProductByModelName(trimmed);

      navigation.navigate("ItemDetail", {
        folderId,
        folderName,
        modelName: trimmed,
        productInfo,
        mode: "edit",
        ocrOriginalResult,
        ocrLogId,
      });
    } catch (error: any) {
      console.log("===== NAVER SEARCH DEBUG =====");

      console.log(
        "FULL URL:",
        `${error?.config?.baseURL}${error?.config?.url}`,
      );

      console.log("BASE URL:", `[${error?.config?.baseURL}]`);
      console.log("URL PATH:", `[${error?.config?.url}]`);

      console.log("PARAMS:", error?.config?.params);
      console.log("HEADERS:", error?.config?.headers);

      console.log("STATUS:", error?.response?.status);
      console.log("RESPONSE:", error?.response?.data);

      console.log("ERROR MESSAGE:", error?.message);
      console.log("ERROR CODE:", error?.code);
      console.log("REQUEST EXISTS:", !!error?.request);

      console.log("QUERY:", trimmed);

      Alert.alert(
        "안내",
        "제품 정보를 찾지 못했습니다. 상세 정보 화면에서 직접 입력해주세요.",
        [
          {
            text: "확인",
            onPress: () =>
              navigation.navigate("ItemDetail", {
                folderId,
                folderName,
                modelName: trimmed,
                mode: "edit",
                ocrOriginalResult,
                ocrLogId,
              }),
          },
        ],
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenOCROptions = () => {
    setImageActionVisible(true);
  };

  const handleTakePhoto = () => {
    setImageActionVisible(false);

    navigation.navigate("OCRCamera", {
      ocrType: "MODEL",
      sourceScreen: "ItemRegisterModel",
    });
  };

  const handlePickFromGallery = async () => {
    try {
      setImageActionVisible(false);
      setIsOcrLoading(true);

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "갤러리 접근 권한을 허용해주세요.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.base64) {
        Alert.alert("오류", "이미지 데이터를 읽지 못했습니다.");
        return;
      }

      const response = await deviceService.requestOCR({
        ocr_type: "MODEL",
        image_base64: asset.base64,
      });

      if (
        !response.success ||
        !response.data.is_success ||
        !response.data.result
      ) {
        Alert.alert(
          "안내",
          response.data.message ?? "모델명을 인식하지 못했습니다.",
        );
        return;
      }

      const modelName = response.data.result.model_name;

      setOcrOriginalResult(response.data.result);
      setOcrLogId(response.data.ocr_log_id ?? null);

      console.log("[OCR] 원본 결과", response.data.result);
      console.log("[OCR] ocrLogId", response.data.ocr_log_id);

      if (!modelName) {
        Alert.alert("안내", "모델명을 인식하지 못했습니다.");
        return;
      }

      setModelName(modelName);
    } catch (error: any) {
      console.log("Gallery OCR error message:", error?.message);
      console.log("Gallery OCR error response:", error?.response?.data);
      console.log("Gallery OCR error status:", error?.response?.status);
      console.log(
        "Gallery OCR error config url:",
        error?.config?.baseURL,
        error?.config?.url,
      );

      Alert.alert("오류", "갤러리 이미지 OCR 처리 중 문제가 발생했습니다.");
    } finally {
      setIsOcrLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AppHeader
          title="아이템"
          leftType="back"
          rightType="none"
          onPressLeft={() => navigation.goBack()}
        />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.ocrRow} onPress={handleOpenOCROptions}>
          <Text style={styles.ocrText}>OCR로 입력하기</Text>
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>모델명을 입력해주세요</Text>
          <Text style={styles.description}>
            제품정보를 자동으로 입력해드려요
          </Text>
        </View>

        <TextInput
          value={modelName}
          onChangeText={setModelName}
          placeholder="예: SL-C513"
          style={styles.input}
          autoCapitalize="characters"
        />
        {isOcrLoading && (
          <Text style={styles.ocrLoadingText}>
            모델명을 인식하는 중이에요...
          </Text>
        )}
      </View>

      <View style={[styles.bottomArea, { bottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={isSearching}
        >
          <Text style={styles.nextButtonText}>
            {isSearching ? "제품 정보 확인 중..." : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={imageActionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageActionVisible(false)}
      >
        <View
          style={[modalStyles.modalOverlay, { paddingBottom: insets.bottom }]}
        >
          <Pressable
            style={modalStyles.modalBackdrop}
            onPress={() => setImageActionVisible(false)}
          />

          <View style={modalStyles.profileImageSheet}>
            <View style={modalStyles.sheetHandle} />

            <Text style={modalStyles.sheetTitle}>이미지 선택</Text>
            <Text style={modalStyles.sheetDescription}>
              모델명을 자동으로 입력할 수 있어요
            </Text>

            <TouchableOpacity
              style={modalStyles.sheetActionButton}
              onPress={handlePickFromGallery}
            >
              <View style={modalStyles.sheetActionIconWrap}>
                <MaterialCommunityIcons
                  name="image-outline"
                  size={22}
                  color={colors.primaryDark}
                />
              </View>

              <View style={modalStyles.sheetActionTextWrap}>
                <Text style={modalStyles.sheetActionTitle}>
                  갤러리에서 선택
                </Text>
                <Text style={modalStyles.sheetActionSubtitle}>
                  저장된 사진에서 모델명을 인식합니다
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.sheetActionButton}
              onPress={handleTakePhoto}
            >
              <View style={modalStyles.sheetActionIconWrap}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={22}
                  color={colors.primaryDark}
                />
              </View>

              <View style={modalStyles.sheetActionTextWrap}>
                <Text style={modalStyles.sheetActionTitle}>직접 촬영</Text>
                <Text style={modalStyles.sheetActionSubtitle}>
                  카메라로 모델명을 촬영합니다
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
