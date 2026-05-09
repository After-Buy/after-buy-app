import AppHeader from "@/src/components/common/AppHeader";
import CutoutOverlay from "@/src/components/OCR/CutoutOverlay";
import { ocrStyles as styles } from "@/src/styles/OCRStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { deviceService } from "../../services/database/deviceService";
import { OCRResultPayload, RootStackParamList } from "../../types/navigation";

import * as ImageManipulator from "expo-image-manipulator";

type Props = NativeStackScreenProps<RootStackParamList, "OCRCamera">;

export default function OCRCameraScreen({ navigation, route }: Props) {
  const { ocrType, sourceScreen, itemDetailParams } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableTorch, setEnableTorch] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

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

  const guideText =
    ocrType === "MODEL"
      ? "모델명 캡쳐"
      : ocrType === "SERIAL"
        ? "시리얼 번호 캡쳐"
        : "구매 정보 캡쳐";

  const headerHeight = insets.top + 65;

  const frameConfig =
    ocrType === "RECEIPT"
      ? { width: 300, height: 360, radius: 18, topRatio: 0.18 }
      : ocrType === "SERIAL"
        ? { width: 300, height: 120, radius: 18, topRatio: 0.24 }
        : { width: 300, height: 180, radius: 18, topRatio: 0.24 };
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const cropOverlayToBase64 = async (uri: string) => {
    const imageInfo = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    const imageWidth = imageInfo.width;
    const imageHeight = imageInfo.height;

    const frameX = (SCREEN_WIDTH - frameConfig.width) / 2;
    const frameY =
      headerHeight + (SCREEN_HEIGHT - headerHeight) * frameConfig.topRatio;

    const scaleX = imageWidth / SCREEN_WIDTH;
    const scaleY = imageHeight / SCREEN_HEIGHT;

    const cropX = Math.max(0, Math.round(frameX * scaleX));
    const cropY = Math.max(0, Math.round(frameY * scaleY));

    const cropWidth = Math.min(
      Math.round(frameConfig.width * scaleX),
      imageWidth - cropX,
    );

    const cropHeight = Math.min(
      Math.round(frameConfig.height * scaleY),
      imageHeight - cropY,
    );

    const cropped = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          crop: {
            originX: cropX,
            originY: cropY,
            width: cropWidth,
            height: cropHeight,
          },
        },
        {
          resize: {
            width: ocrType === "RECEIPT" ? 1200 : 900,
          },
        },
      ],
      {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    return cropped.base64;
  };

  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraReady || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert("오류", "이미지 데이터를 읽지 못했습니다.");
        return;
      }

      setCapturedImageUri(photo.uri);

      const imageBase64 = await cropOverlayToBase64(photo.uri);

      if (!imageBase64) {
        Alert.alert("오류", "이미지 변환 실패");
        return;
      }

      const response = await deviceService.requestOCR({
        ocr_type: ocrType,
        image_base64: imageBase64,
      });

      if (
        !response.success ||
        !response.data.is_success ||
        !response.data.result
      ) {
        Alert.alert(
          "안내",
          response.data.message ??
            "텍스트를 인식하지 못했습니다. 다시 시도해주세요.",
        );
        return;
      }

      const result = response.data.result;

      if (sourceScreen === "ItemRegisterModel") {
        if (ocrType !== "MODEL" || !result.model_name) {
          Alert.alert("안내", "모델명을 인식하지 못했습니다.");
          return;
        }

        navigation.navigate("ItemRegisterModel", {
          ocrResult: {
            ocrType: "MODEL",
            model_name: result.model_name,
          },
        });

        return;
      }

      if (sourceScreen === "ItemDetail") {
        if (ocrType === "SERIAL" && result.serial_number && itemDetailParams) {
          const ocrResult: OCRResultPayload = {
            ocrType: "SERIAL",
            serial_number: result.serial_number,
          };

          navigation.navigate("ItemDetail", {
            ...itemDetailParams,
            ocrResult,
          });
        }

        if (ocrType === "RECEIPT" && itemDetailParams) {
          const ocrResult: OCRResultPayload = {
            ocrType: "RECEIPT",
            purchase_date: result.purchase_date,
            purchase_price:
              result.purchase_price !== undefined
                ? String(result.purchase_price)
                : undefined,
            purchase_store: result.purchase_store,
          };

          navigation.navigate("ItemDetail", {
            ...itemDetailParams,
            ocrResult,
          });
        }
      }
    } catch (error) {
      console.log("OCR capture error:", error);
      Alert.alert("오류", "촬영 또는 OCR 처리 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      setCapturedImageUri(null);
    }
  };

  if (!permission) {
    return <View style={styles.loadingContainer} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>카메라 권한이 필요합니다</Text>
        <Text style={styles.permissionDescription}>
          OCR 촬영을 위해 카메라 접근 권한을 허용해주세요.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>권한 허용</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImageUri ? (
        <Image
          source={{ uri: capturedImageUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={enableTorch}
          onCameraReady={() => setIsCameraReady(true)}
        />
      )}

      <View style={{ paddingTop: insets.top, backgroundColor: "white" }}>
        <AppHeader
          title={guideText}
          leftType="back"
          rightType="none"
          onPressLeft={() => navigation.goBack()}
        />
      </View>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            top: headerHeight,
            bottom: 0,
            zIndex: 0,
          },
        ]}
      >
        <CutoutOverlay
          frameWidth={frameConfig.width}
          frameHeight={frameConfig.height}
          borderRadius={frameConfig.radius}
          frameTopRatio={frameConfig.topRatio}
        />
      </View>
      <View style={[styles.bottomArea, { bottom: insets.bottom + 10 }]}>
        <Pressable
          style={[
            styles.bottomIconButton,
            enableTorch && styles.bottomIconButtonActive,
          ]}
          onPress={() => setEnableTorch((prev) => !prev)}
        >
          <MaterialCommunityIcons
            name={enableTorch ? "flash" : "flash-off"}
            size={26}
            color={enableTorch ? "#FFFFFF" : "#1F2937"}
          />
        </Pressable>

        <Pressable
          style={styles.captureButtonOuter}
          onPress={handleCapture}
          disabled={!isCameraReady || isSubmitting}
        >
          <View style={styles.captureButtonInner}>
            {isSubmitting && <ActivityIndicator color="#2563EB" />}
          </View>
        </Pressable>

        <View style={styles.bottomIconPlaceholder} />
      </View>
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>
            {ocrType === "MODEL"
              ? "모델명을 인식 중..."
              : ocrType === "SERIAL"
                ? "시리얼 번호 인식 중..."
                : "영수증 분석 중..."}
          </Text>
        </View>
      )}
    </View>
  );
}
