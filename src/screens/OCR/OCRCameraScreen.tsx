import AppHeader from "@/src/components/common/AppHeader";
import CutoutOverlay from "@/src/components/OCR/CutoutOverlay";
import { ocrStyles as styles } from "@/src/styles/OCRStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ItemStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<ItemStackParamList, "OCRCamera">;

export default function OCRCameraScreen({ navigation, route }: Props) {
  const { ocrType, sourceScreen } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableTorch, setEnableTorch] = useState(false);
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
      ? "모델명을 캡쳐해주세요"
      : ocrType === "SERIAL"
        ? "시리얼 번호를 캡쳐해주세요"
        : "구매 정보를 캡쳐해주세요";

  const headerHeight = insets.top + 65;

  const frameConfig =
    ocrType === "RECEIPT"
      ? { width: 300, height: 360, radius: 18, topRatio: 0.18 }
      : ocrType === "SERIAL"
        ? { width: 300, height: 120, radius: 18, topRatio: 0.24 }
        : { width: 300, height: 180, radius: 18, topRatio: 0.24 };

  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraReady || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.base64) {
        Alert.alert("오류", "이미지 데이터를 읽지 못했습니다.");
        return;
      }

      // 실제 API 연결 전 임시 테스트
      // console.log(photo.base64.slice(0, 50));

      // 서버 OCR 호출
      // const response = await deviceService.requestOCR({
      //   ocr_type: ocrType,
      //   image_base64: photo.base64,
      // });

      // 임시 mock 분기
      if (sourceScreen === "ItemRegisterModel") {
        navigation.navigate({
          name: "ItemRegisterModel",
          params: {
            ocrResult: {
              ocrType: "MODEL",
              model_name: "MTQN3KH/A",
            },
          },
          merge: true,
        });
      } else {
        if (ocrType === "SERIAL") {
          // navigation.navigate({
          //   name: "ItemDetail",
          //   params: {
          //     ocrResult: {
          //       ocrType: "SERIAL",
          //       serial_number: "C8QKL1234AB",
          //     },
          //   },
          //   merge: true,
          // });
        } else if (ocrType === "RECEIPT") {
          // navigation.navigate({
          //   name: "ItemDetail",
          //   params: {
          //     ocrResult: {
          //       ocrType: "RECEIPT",
          //       purchase_date: "2024-09-20",
          //       purchase_price: "1550000",
          //       purchase_store: "Apple Store 가로수길",
          //     },
          //   },
          //   merge: true,
          // });
        }
      }
    } catch (error) {
      Alert.alert("오류", "촬영 또는 OCR 처리 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={enableTorch}
        onCameraReady={() => setIsCameraReady(true)}
      />

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
      <View style={[styles.bottomArea, { bottom: insets.bottom }]}>
        <Pressable
          style={styles.bottomIconButton}
          onPress={() => setEnableTorch((prev) => !prev)}
        >
          <Text style={styles.bottomIconText}>⚡</Text>
        </Pressable>

        <Pressable
          style={styles.captureButtonOuter}
          onPress={handleCapture}
          disabled={!isCameraReady || isSubmitting}
        >
          <View style={styles.captureButtonInner}>
            {isSubmitting && <ActivityIndicator />}
          </View>
        </Pressable>

        <View style={styles.bottomIconButton} />
      </View>
    </View>
  );
}
