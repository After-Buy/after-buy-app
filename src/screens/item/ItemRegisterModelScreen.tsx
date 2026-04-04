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
import {
  itemDetailStyle as Modalstyles,
  itemRegisterModelStyle as styles,
} from "../../styles/item/itemStyle";
import { ItemStackParamList } from "../../types/navigation";

import * as ImagePicker from "expo-image-picker";

type Props = NativeStackScreenProps<ItemStackParamList, "ItemRegisterModel">;

export default function ItemRegisterModelScreen({ navigation, route }: Props) {
  const { folderId = null, folderName = "전체 자산" } = route.params || {};
  const [modelName, setModelName] = useState("");
  const [imageActionVisible, setImageActionVisible] = useState(false);
  const insets = useSafeAreaInsets();

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

  const handleNext = () => {
    const trimmed = modelName.trim();

    if (!trimmed) {
      Alert.alert("안내", "모델명을 입력해주세요.");
      return;
    }

    navigation.navigate("ItemDetail", {
      folderId,
      folderName,
      modelName: trimmed,
      mode: "edit",
    });
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

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "갤러리 접근 권한을 허용해주세요.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) {
        Alert.alert("오류", "선택한 이미지를 불러오지 못했습니다.");
        return;
      }

      // 실제 OCR API 연결 전 임시 mock 처리
      setModelName("MTQN3KH/A");

      // 추후 실제 OCR 연결 시 예시
      // if (!asset.base64) {
      //   Alert.alert("오류", "이미지 데이터를 읽지 못했습니다.");
      //   return;
      // }
      //
      // const response = await deviceService.requestOCR({
      //   ocr_type: "MODEL",
      //   image_base64: asset.base64,
      // });
      //
      // setModelName(response.model_name ?? "");
    } catch (error) {
      Alert.alert("오류", "갤러리 이미지 선택 중 문제가 발생했습니다.");
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
      </View>

      <View style={[styles.bottomArea, { bottom: insets.bottom }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={imageActionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageActionVisible(false)}
      >
        <View style={Modalstyles.modalOverlay}>
          <Pressable
            style={Modalstyles.modalBackdrop}
            onPress={() => setImageActionVisible(false)}
          />

          <View style={Modalstyles.imageActionContainer}>
            <TouchableOpacity
              style={Modalstyles.imageActionButton}
              onPress={handlePickFromGallery}
            >
              <Text style={Modalstyles.imageActionText}>갤러리에서 선택</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Modalstyles.imageActionButton}
              onPress={handleTakePhoto}
            >
              <Text style={Modalstyles.imageActionText}>직접 촬영</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
