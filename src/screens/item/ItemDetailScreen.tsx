import { typography } from "@/src/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { deviceService } from "../../services/database/deviceService";
import { itemDetailStyle as styles } from "../../styles/item/itemStyle";
import { modalStyles } from "../../styles/modalStyle";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ItemDetail">;

type DeviceDraft = {
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

const createEmptyDraft = (
  folderId: number | null,
  modelName: string,
  productInfo?: {
    product_name?: string;
    model_name?: string;
    brand?: string;
    image_url?: string;
    product_link_url?: string;
  },
): DeviceDraft => ({
  folder_id: folderId,
  product_name: productInfo?.product_name ?? "",
  model_name: productInfo?.model_name ?? modelName,
  brand: productInfo?.brand ?? "",
  image_url: productInfo?.image_url ?? "",
  product_link_url: productInfo?.product_link_url ?? "",
  purchase_date: "",
  purchase_price: "",
  purchase_store: "",
  warranty_months: "",
  serial_number: "",
  memo: "",
});

export default function ItemDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isCreateMode = !("deviceId" in route.params) || !route.params.deviceId;
  const deviceId =
    "deviceId" in route.params ? route.params.deviceId : undefined;
  const initialMode = route.params.mode ?? "view";

  const [isLoading, setIsLoading] = useState<boolean>(!isCreateMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(initialMode === "edit");
  const [draft, setDraft] = useState<DeviceDraft | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<keyof DeviceDraft | null>(
    null,
  );
  const [modalValue, setModalValue] = useState("");
  const [imageActionVisible, setImageActionVisible] = useState(false);
  const [imageActionMode, setImageActionMode] = useState<
    "IMAGE" | "RECEIPT" | "SERIAL"
  >("IMAGE");
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [warrantyModalVisible, setWarrantyModalVisible] = useState(false);
  const [warrantyYears, setWarrantyYears] = useState(0);
  const [warrantyExtraMonths, setWarrantyExtraMonths] = useState(0);
  const [activeWarrantyUnit, setActiveWarrantyUnit] = useState<
    "year" | "month"
  >("year");

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const noticeActionRef = useRef<(() => void) | null>(null);

  const handleCopyProductLink = async () => {
    const link = draft?.product_link_url?.trim();

    if (!link) {
      openNotice("안내", "복사할 제품 정보 링크가 없습니다.");
      return;
    }

    await Clipboard.setStringAsync(link);
    openNotice("완료", "제품 정보 링크가 복사되었습니다.");
  };

  const openNotice = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setNoticeTitle(title);
    setNoticeMessage(message);
    noticeActionRef.current = onConfirm ?? null;
    setNoticeVisible(true);
  };

  const closeNotice = () => {
    setNoticeVisible(false);

    const action = noticeActionRef.current;
    noticeActionRef.current = null;

    if (action) {
      action();
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      if (isCreateMode) {
        const folderId =
          "folderId" in route.params ? (route.params.folderId ?? null) : null;
        const modelName =
          "modelName" in route.params ? route.params.modelName : "";

        const productInfo =
          "productInfo" in route.params ? route.params.productInfo : undefined;

        setDraft(createEmptyDraft(folderId, modelName, productInfo));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const device = await deviceService.getDeviceById(deviceId as number);

        if (!device) {
          openNotice("오류", "아이템 정보를 찾을 수 없습니다.", () => {
            navigation.goBack();
          });
          return;
        }

        setDraft({
          folder_id: device.folder_id ?? null,
          product_name: device.product_name ?? "",
          model_name: device.model_name ?? "",
          brand: device.brand ?? "",
          image_url: device.image_url ?? "",
          product_link_url: device.product_link_url ?? "",
          purchase_date: device.purchase_date ?? "",
          purchase_price:
            device.purchase_price !== null &&
            device.purchase_price !== undefined
              ? String(device.purchase_price)
              : "",
          purchase_store: device.purchase_store ?? "",
          warranty_months:
            device.warranty_months !== null &&
            device.warranty_months !== undefined
              ? String(device.warranty_months)
              : "",
          serial_number: device.serial_number ?? "",
          memo: device.memo ?? "",
        });
      } catch (error) {
        openNotice("오류", "아이템 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [deviceId, isCreateMode, navigation, route.params]);

  useEffect(() => {
    console.log("[ItemDetail] route.params", route.params);
  }, []);

  useEffect(() => {
    const ocrResult =
      "ocrResult" in route.params ? route.params.ocrResult : undefined;

    if (!ocrResult) return;

    setDraft((prev) => {
      if (!prev) return prev;

      if (ocrResult.ocrType === "RECEIPT") {
        return {
          ...prev,
          purchase_date: ocrResult.purchase_date ?? prev.purchase_date,
          purchase_price: ocrResult.purchase_price ?? prev.purchase_price,
          purchase_store: ocrResult.purchase_store ?? prev.purchase_store,
        };
      }

      if (ocrResult.ocrType === "SERIAL") {
        return {
          ...prev,
          serial_number: ocrResult.serial_number ?? prev.serial_number,
        };
      }

      return prev;
    });
  }, [route.params]);

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

  const buttonLabel = useMemo(() => {
    return isEditMode ? "저장" : "수정";
  }, [isEditMode]);

  const fieldMeta: Partial<
    Record<
      keyof DeviceDraft,
      {
        label: string;
        description?: string;
        placeholder?: string;
        multiline?: boolean;
        keyboardType?: "default" | "numeric";
        required?: boolean;
        editable?: boolean;
        maxLength?: number;
      }
    >
  > = {
    product_name: {
      label: "상품명",
      description: "서비스에서 표시될 제품 이름입니다.",
      placeholder: "상품명을 입력하세요",
      required: true,
      maxLength: 200,
    },
    model_name: {
      label: "모델명",
      description: "OCR 또는 직접 입력된 모델명입니다.",
      required: true,
      editable: false,
      maxLength: 100,
    },
    brand: {
      label: "브랜드",
      description: "브랜드명을 입력해주세요.",
      placeholder: "브랜드를 입력하세요",
      required: true,
      maxLength: 100,
    },
    purchase_date: {
      label: "구매일",
      description: "제품을 실제로 구매한 날짜를 선택해주세요.",
      placeholder: "YYYY-MM-DD",
      required: true,
      maxLength: 10,
    },
    purchase_price: {
      label: "구매가",
      description: "구매 가격을 숫자로 입력해주세요.",
      placeholder: "예: 500000",
      keyboardType: "numeric",
      required: true,
      maxLength: 12,
    },
    warranty_months: {
      label: "무상 보증 기간(개월)",
      description: "무상 보증 기간을 개월 수로 저장합니다.",
      placeholder: "예: 12",
      keyboardType: "numeric",
      required: true,
      maxLength: 3,
    },
    purchase_store: {
      label: "구매처",
      description: "온라인몰, 오프라인 매장명 등을 입력할 수 있어요.",
      placeholder: "구매처를 입력하세요",
      maxLength: 100,
    },
    product_link_url: {
      label: "제품 정보 링크",
      description: "제품 정보 링크를 기록해보세요.",
      placeholder: "링크를 입력하세요",
      maxLength: 500,
    },
    serial_number: {
      label: "S/N",
      description: "제품 시리얼 번호를 입력해주세요.",
      placeholder: "시리얼 번호를 입력하세요",
      maxLength: 100,
    },
    memo: {
      label: "메모",
      description: "제품과 관련된 메모를 자유롭게 남길 수 있어요.",
      placeholder: "메모를 입력하세요",
      multiline: true,
      maxLength: 1000,
    },
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const pad2 = (value: number) => String(value).padStart(2, "0");

  const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    const originalDate = result.getDate();

    result.setMonth(result.getMonth() + months);

    if (result.getDate() !== originalDate) {
      result.setDate(0);
    }

    return result;
  };

  const formatCompactPrice = (priceText: string) => {
    const price = Number(priceText);

    if (!priceText || Number.isNaN(price)) {
      return "예: 500000";
    }

    if (price < 10000) {
      return `${price.toLocaleString()}원`;
    }

    const units = [
      { value: 1000000000000, label: "조" },
      { value: 100000000, label: "억" },
      { value: 10000, label: "만" },
    ];

    for (const unit of units) {
      if (price >= unit.value) {
        const compact = price / unit.value;

        const formatted =
          compact >= 100
            ? Math.floor(compact).toLocaleString()
            : Number(compact.toFixed(1)).toString();

        return `${formatted}${unit.label} 원`;
      }
    }

    return `${price.toLocaleString()}원`;
  };

  const getWarrantyDisplay = (totalMonthsText: string) => {
    const totalMonths = Number(totalMonthsText || "0");

    if (!totalMonths || Number.isNaN(totalMonths)) {
      return {
        years: 0,
        months: 0,
        text: "보증 기간을 선택하세요",
        hasValue: false,
      };
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return {
      years,
      months,
      text: `${years}년 ${months}개월`,
      hasValue: true,
    };
  };

  const getWarrantyInfo = () => {
    if (!draft?.purchase_date || !draft?.warranty_months) return null;

    const [year, month, day] = draft.purchase_date.split("-").map(Number);
    const totalMonths = Number(draft.warranty_months);

    if (
      !year ||
      !month ||
      !day ||
      Number.isNaN(totalMonths) ||
      totalMonths <= 0
    ) {
      return null;
    }

    const purchaseDate = new Date(year, month - 1, day);
    const expiryDate = addMonths(purchaseDate, totalMonths);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffMs = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const expiryText = `${expiryDate.getFullYear()} / ${pad2(expiryDate.getMonth() + 1)} / ${pad2(expiryDate.getDate())} 에 종료`;

    let ddayText = "";
    if (diffDays > 0) ddayText = `D-${diffDays}`;
    else if (diffDays === 0) ddayText = "D-Day";
    else ddayText = `D+${Math.abs(diffDays)}`;

    return {
      expiryText,
      ddayText,
    };
  };

  const updateField = (key: keyof DeviceDraft, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const validateDraft = () => {
    if (!draft) return false;

    if (!draft.product_name.trim()) {
      openNotice("안내", "상품명을 입력해주세요.");
      return false;
    }

    if (!draft.model_name.trim()) {
      openNotice("안내", "모델명이 올바르지 않습니다.");
      return false;
    }

    if (!draft.brand.trim()) {
      openNotice("안내", "브랜드를 입력해주세요.");
      return false;
    }

    if (!draft.purchase_date.trim()) {
      openNotice("안내", "구매일을 입력해주세요.");
      return false;
    }

    if (!draft.purchase_price.trim()) {
      openNotice("안내", "구매가를 입력해주세요.");
      return false;
    }

    if (!draft.warranty_months.trim()) {
      openNotice("안내", "보증기간을 입력해주세요.");
      return false;
    }

    const price = Number(draft.purchase_price);
    const warrantyMonths = Number(draft.warranty_months);

    if (Number.isNaN(price) || price <= 0) {
      openNotice("안내", "구매가는 숫자로 입력해주세요.");
      return false;
    }

    if (Number.isNaN(warrantyMonths) || warrantyMonths <= 0) {
      openNotice("안내", "보증기간을 입력해주세요.");
      return false;
    }

    return true;
  };

  const getFileExtension = (uri: string) => {
    const cleanUri = uri.split("?")[0];
    const extension = cleanUri.split(".").pop()?.toLowerCase();

    if (!extension) return "jpg";

    if (extension === "jpeg") return "jpeg";
    if (extension === "png") return "png";
    if (extension === "webp") return "webp";
    if (extension === "jpg") return "jpg";

    return "jpg";
  };

  const isLocalImageUri = (uri: string) => {
    return uri.startsWith("file://") || uri.startsWith("content://");
  };

  const uploadImageIfNeeded = async (imageUri: string) => {
    if (!imageUri) return "";

    if (!isLocalImageUri(imageUri)) {
      return imageUri;
    }

    const fileExtension = getFileExtension(imageUri);

    const { presigned_url, image_url } =
      await deviceService.getDeviceImagePresignedUrl(fileExtension);

    await deviceService.uploadImageToS3(presigned_url, imageUri);

    return image_url;
  };

  const getOCRModifiedFields = () => {
    if (!draft) return [];

    const ocrOriginalResult =
      "ocrOriginalResult" in route.params
        ? route.params.ocrOriginalResult
        : null;

    if (!ocrOriginalResult) return [];

    const modifiedFields: string[] = [];

    if (
      ocrOriginalResult.model_name &&
      ocrOriginalResult.model_name !== draft.model_name.trim()
    ) {
      modifiedFields.push("model_name");
    }

    if (
      ocrOriginalResult.purchase_date &&
      ocrOriginalResult.purchase_date !== draft.purchase_date.trim()
    ) {
      modifiedFields.push("purchase_date");
    }

    if (
      ocrOriginalResult.purchase_price !== undefined &&
      Number(ocrOriginalResult.purchase_price) !== Number(draft.purchase_price)
    ) {
      modifiedFields.push("purchase_price");
    }

    if (
      ocrOriginalResult.purchase_store &&
      ocrOriginalResult.purchase_store !== draft.purchase_store.trim()
    ) {
      modifiedFields.push("purchase_store");
    }

    if (
      ocrOriginalResult.serial_number &&
      ocrOriginalResult.serial_number !== draft.serial_number.trim()
    ) {
      modifiedFields.push("serial_number");
    }

    return modifiedFields;
  };

  const handlePressAction = async () => {
    if (!draft) return;

    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    if (!validateDraft()) return;

    try {
      console.log("[ItemDetail] 저장 시작", {
        isCreateMode,
        deviceId,
        draft,
      });

      setIsUploadingImage(true);

      console.log("[ItemDetail] 이미지 업로드 필요 여부 확인", {
        imageUri: draft.image_url,
      });

      const uploadedImageUrl = await uploadImageIfNeeded(
        draft.image_url.trim(),
      );

      console.log("[ItemDetail] 이미지 업로드 완료", {
        uploadedImageUrl,
      });

      setIsUploadingImage(false);
      setIsSaving(true);

      const payload = {
        folder_id: draft.folder_id,
        product_name: draft.product_name.trim(),
        model_name: draft.model_name.trim(),
        brand: draft.brand.trim(),
        image_url: uploadedImageUrl || null,
        product_link_url: draft.product_link_url.trim(),
        purchase_date: draft.purchase_date.trim(),
        purchase_price: Number(draft.purchase_price),
        purchase_store: draft.purchase_store.trim(),
        warranty_months: Number(draft.warranty_months),
        serial_number: draft.serial_number.trim(),
        memo: draft.memo.trim(),
      };

      console.log("[ItemDetail] 저장 요청 payload", payload);

      if (isCreateMode) {
        const result = await deviceService.createDevice(payload);
        console.log("[ItemDetail] 제품 등록 성공", result);

        const ocrLogId =
          "ocrLogId" in route.params ? route.params.ocrLogId : null;

        const modifiedFields = getOCRModifiedFields();

        console.log("[OCR Modified] ocrLogId", ocrLogId);
        console.log("[OCR Modified] modifiedFields", modifiedFields);

        if (ocrLogId && modifiedFields.length > 0) {
          console.log("[OCR Modified] 기록 API 호출 시작", {
            ocrLogId,
            deviceId: result.device_id,
            modifiedFields,
          });
          try {
            await deviceService.recordOCRModifiedFields({
              ocrLogId,
              deviceId: result.device_id,
              modifiedFields,
            });

            console.log("[ItemDetail] OCR 오인식 필드 기록 성공", {
              ocrLogId,
              deviceId: result.device_id,
              modifiedFields,
            });
          } catch (error) {
            console.log("[ItemDetail] OCR 오인식 필드 기록 실패", error);
          }
        }

        openNotice("완료", "제품이 등록되었습니다.", () => {
          navigation.pop(2);
        });
        return;
      }

      const result = await deviceService.updateDevice(
        deviceId as number,
        payload,
      );
      console.log("[ItemDetail] 제품 수정 성공", result);

      setIsEditMode(false);
      openNotice("완료", "제품 정보가 저장되었습니다.");
    } catch (error: any) {
      console.log("[ItemDetail] 저장 실패", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        config: {
          url: error?.config?.url,
          method: error?.config?.method,
          baseURL: error?.config?.baseURL,
          data: error?.config?.data,
        },
      });

      if (
        error?.message?.includes("S3") ||
        error?.message === "UPLOAD_FAILED"
      ) {
        openNotice("오류", "이미지 업로드에 실패했습니다.");
      } else {
        openNotice("오류", "저장 중 문제가 발생했습니다.");
      }
    } finally {
      setIsSaving(false);
      setIsUploadingImage(false);
    }
  };

  const openFieldModal = (key: keyof DeviceDraft) => {
    if (!draft) return;
    if (!isEditMode) return;

    const meta = fieldMeta[key];
    if (!meta) return;
    if (meta.editable === false) return;

    setSelectedField(key);
    setModalValue(String(draft[key] ?? ""));
    setModalVisible(true);
  };

  const closeFieldModal = () => {
    setModalVisible(false);
    setSelectedField(null);
    setModalValue("");
  };

  const applyFieldModal = () => {
    if (!selectedField) return;
    updateField(selectedField, modalValue);
    closeFieldModal();
  };

  const openPurchaseDateModal = () => {
    if (!draft) return;
    if (!isEditMode) return;

    if (draft.purchase_date) {
      const [year, month, day] = draft.purchase_date.split("-").map(Number);

      if (year && month && day) {
        setSelectedDate(new Date(year, month - 1, day));
      } else {
        setSelectedDate(new Date());
      }
    } else {
      setSelectedDate(new Date());
    }

    setDateModalVisible(true);
  };

  const openWarrantyModal = () => {
    if (!draft) return;
    if (!isEditMode) return;

    const totalMonths = Number(draft.warranty_months || "0");

    if (!Number.isNaN(totalMonths) && totalMonths > 0) {
      setWarrantyYears(Math.floor(totalMonths / 12));
      setWarrantyExtraMonths(totalMonths % 12);
    } else {
      setWarrantyYears(0);
      setWarrantyExtraMonths(0);
    }

    setActiveWarrantyUnit("year");
    setWarrantyModalVisible(true);
  };

  const applyWarrantyModal = () => {
    const totalMonths = warrantyYears * 12 + warrantyExtraMonths;
    updateField("warranty_months", String(totalMonths));
    setWarrantyModalVisible(false);
  };

  const clearWarrantyModal = () => {
    setWarrantyYears(0);
    setWarrantyExtraMonths(0);
  };

  const appendWarrantyDigit = (digit: number) => {
    if (activeWarrantyUnit === "year") {
      setWarrantyYears((prev) => {
        const next = Number(`${prev}${digit}`);
        return Math.min(next, 99);
      });
      return;
    }

    setWarrantyExtraMonths((prev) => {
      const next = Number(`${prev}${digit}`);
      return Math.min(next, 11);
    });
  };

  const openOCRActionSheet = (ocrType: "RECEIPT" | "SERIAL") => {
    if (!isEditMode) return;

    setImageActionMode(ocrType);
    setImageActionVisible(true);
  };

  const goOCRCamera = (ocrType: "RECEIPT" | "SERIAL") => {
    if (!isEditMode) return;

    navigation.navigate("OCRCamera", {
      ocrType,
      sourceScreen: "ItemDetail",
      itemDetailParams: {
        ...route.params,
        mode: "edit",
      },
    });
  };

  const removeWarrantyDigit = () => {
    if (activeWarrantyUnit === "year") {
      setWarrantyYears((prev) => Math.floor(prev / 10));
      return;
    }

    setWarrantyExtraMonths((prev) => Math.floor(prev / 10));
  };

  const renderCompactField = (
    fieldKey: keyof DeviceDraft,
    value: string,
    options?: {
      required?: boolean;
      editable?: boolean;
      placeholder?: string;
      multiline?: boolean;
      keyboardType?: "default" | "numeric";
    },
  ) => {
    const isEditable = options?.editable ?? isEditMode;
    const required = options?.required ?? false;
    const showRequiredMark = required && isEditMode;
    const displayValue = value || options?.placeholder || "";
    const isPressable = isEditMode && isEditable;

    return (
      <View
        style={[
          styles.compactFieldRow,
          options?.multiline && styles.compactFieldRowMultiline,
        ]}
      >
        <Text style={styles.compactLabel}>
          {fieldMeta[fieldKey]?.label}
          {showRequiredMark && <Text style={styles.required}> *</Text>}
        </Text>

        {isPressable ? (
          <Pressable
            onPress={() => {
              if (isPressable) openFieldModal(fieldKey);
            }}
            style={[
              styles.compactValueBox,
              options?.multiline && styles.compactValueBoxMultiline,
            ]}
          >
            <Text
              style={[
                styles.compactValueText,
                !value && styles.placeholderText,
              ]}
              numberOfLines={options?.multiline ? 4 : 1}
            >
              {displayValue}
            </Text>
          </Pressable>
        ) : (
          <View
            style={[
              styles.compactReadonlyBox,
              options?.multiline && styles.compactValueBoxMultiline,
            ]}
          >
            <Text
              style={[
                styles.compactValueText,
                !value && styles.placeholderText,
              ]}
              numberOfLines={options?.multiline ? 4 : 1}
            >
              {displayValue}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductSummarySection = () => {
    return (
      <View style={styles.productSummarySection}>
        <View style={styles.productSummaryLabelRow}>
          <MaterialCommunityIcons
            name="gift-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.productSummaryLabel}>
            상품명{isEditMode && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (isEditMode) openFieldModal("product_name");
          }}
        >
          <Text style={styles.productSummaryTitle}>
            {draft?.product_name || "상품명을 입력하세요"}
          </Text>
        </Pressable>

        <Text
          style={[
            styles.productSummaryModel,
            !draft?.model_name && styles.placeholderText,
          ]}
        >
          모델명: {draft?.model_name || "모델명이 없습니다"}
        </Text>
      </View>
    );
  };

  const renderPurchaseInfoCard = () => {
    const purchaseDate = draft?.purchase_date ?? "";
    const purchasePrice = draft?.purchase_price ?? "";
    const purchaseStore = draft?.purchase_store ?? "";

    return (
      <View style={styles.purchaseSectionInner}>
        <View style={styles.purchaseCardTopRow}>
          <View style={styles.purchaseCardTopCell}>
            <Text style={styles.purchaseCardLabel}>
              구매일{isEditMode && <Text style={styles.required}> *</Text>}
            </Text>

            {isEditMode ? (
              <Pressable
                onPress={openPurchaseDateModal}
                style={styles.purchaseCardDateInput}
              >
                <Text
                  style={[
                    styles.purchaseCardDateText,
                    !purchaseDate && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {purchaseDate || "구매일 선택"}
                </Text>
              </Pressable>
            ) : (
              <Text
                style={[
                  styles.purchaseCardValue,
                  !purchaseDate && styles.placeholderText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {purchaseDate || "정보 없음"}
              </Text>
            )}
          </View>

          <View style={styles.purchaseCardDivider} />

          <View style={styles.purchaseCardTopCell}>
            <Text style={styles.purchaseCardLabel}>
              구매가{isEditMode && <Text style={styles.required}> *</Text>}
            </Text>

            {isEditMode ? (
              <Pressable
                onPress={() => openFieldModal("purchase_price")}
                style={styles.purchaseCardInputBox}
              >
                <Text
                  style={[
                    styles.purchaseCardInputText,
                    !purchasePrice && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {purchasePrice
                    ? `${Number(purchasePrice).toLocaleString()}원`
                    : "예: 500000"}
                </Text>
              </Pressable>
            ) : (
              <Text
                style={[
                  styles.purchaseCardValue,
                  !purchasePrice && styles.placeholderText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {purchasePrice
                  ? formatCompactPrice(purchasePrice)
                  : "예: 500000"}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.purchaseCardBottomBlock}>
          <Text style={styles.purchaseCardLabel}>구매처</Text>

          {isEditMode ? (
            <Pressable
              onPress={() => openFieldModal("purchase_store")}
              style={styles.purchaseCardInputBox}
            >
              <Text
                style={[
                  styles.purchaseCardInputText,
                  !purchaseStore && styles.placeholderText,
                ]}
              >
                {purchaseStore || "구매처를 입력하세요"}
              </Text>
            </Pressable>
          ) : (
            <Text
              style={[
                styles.purchaseCardValue,
                !purchaseStore && styles.placeholderText,
              ]}
            >
              {purchaseStore || "구매처를 입력하세요"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderNearCenterButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.nearCenterCard,
          { height: 80, justifyContent: "center" },
        ]}
        onPress={handleFindServiceCenter}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={22}
              color={colors.primaryDark}
            />
            <Text
              style={{
                fontSize: typography.body,
                color: colors.primaryDark,
                fontWeight: "600",
              }}
            >
              가까운 서비스 센터 찾기
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={colors.primaryDark}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderWarrantyFieldCompact = () => {
    const display = getWarrantyDisplay(draft?.warranty_months ?? "");
    const warrantyInfo = getWarrantyInfo();

    return (
      <View style={styles.compactFieldRow}>
        <Text style={styles.compactLabel}>
          무상 보증 기간{isEditMode && <Text style={styles.required}> *</Text>}
        </Text>

        {isEditMode ? (
          <Pressable onPress={openWarrantyModal} style={styles.compactValueBox}>
            <Text
              style={[
                styles.compactValueText,
                !display.hasValue && styles.placeholderText,
              ]}
            >
              {display.hasValue ? display.text : "보증 기간을 선택하세요"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.compactReadonlyBox}>
            <Text
              style={[
                styles.compactValueText,
                !display.hasValue && styles.placeholderText,
              ]}
            >
              {display.hasValue ? display.text : "보증 기간을 선택하세요"}
            </Text>
          </View>
        )}

        {warrantyInfo && (
          <View style={styles.warrantyInlineBox}>
            <Text style={styles.warrantyInlineExpiry}>
              {warrantyInfo.expiryText}
            </Text>
            <Text style={styles.warrantyInlineDday}>
              {warrantyInfo.ddayText}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderImageCard = () => {
    const hasImage = !!draft?.image_url;

    return (
      <View style={styles.card}>
        {hasImage ? (
          <Image
            source={{ uri: draft.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              제품 이미지를 추가해주세요
            </Text>
          </View>
        )}

        {isEditMode && (
          <TouchableOpacity
            onPress={() => {
              setImageActionMode("IMAGE");
              setImageActionVisible(true);
            }}
            style={styles.cameraButton}
            activeOpacity={0.85}
          >
            <View style={styles.cameraIconWrap}>
              <MaterialCommunityIcons
                name="camera-plus"
                size={18}
                color={colors.primaryDark}
              />
            </View>
            <Text style={styles.cameraButtonText}>
              {draft?.image_url ? "사진 변경" : "사진 등록"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const requestOCRFromImage = async (
    ocrType: "RECEIPT" | "SERIAL",
    imageBase64: string,
  ) => {
    try {
      setIsUploadingImage(true);

      const response = await deviceService.requestOCR({
        ocr_type: ocrType,
        image_base64: imageBase64,
      });

      if (
        !response.success ||
        !response.data.is_success ||
        !response.data.result
      ) {
        openNotice(
          "안내",
          response.data.message ??
            "텍스트를 인식하지 못했습니다. 다시 시도해주세요.",
        );
        return;
      }

      const result = response.data.result;

      if (ocrType === "RECEIPT") {
        setDraft((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            purchase_date: result.purchase_date ?? prev.purchase_date,
            purchase_price:
              result.purchase_price !== undefined
                ? String(result.purchase_price)
                : prev.purchase_price,
            purchase_store: result.purchase_store ?? prev.purchase_store,
          };
        });

        openNotice("완료", "구매 정보가 자동 입력되었습니다.");
        return;
      }

      if (ocrType === "SERIAL") {
        if (!result.serial_number) {
          openNotice("안내", "시리얼 번호를 인식하지 못했습니다.");
          return;
        }

        updateField("serial_number", result.serial_number);
        openNotice("완료", "시리얼 번호가 자동 입력되었습니다.");
      }
    } catch (error) {
      console.log("[ItemDetail OCR] 실패", error);
      openNotice("오류", "OCR 처리 중 문제가 발생했습니다.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      base64: imageActionMode !== "IMAGE",
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (imageActionMode === "IMAGE") {
      updateField("image_url", asset.uri);
      setImageActionVisible(false);
      return;
    }

    if (!asset.base64) {
      setImageActionVisible(false);
      openNotice("오류", "이미지 데이터를 읽지 못했습니다.");
      return;
    }

    await requestOCRFromImage(imageActionMode, asset.base64);
    setImageActionVisible(false);
  };

  const handleTakePhoto = async () => {
    if (imageActionMode !== "IMAGE") {
      setImageActionVisible(false);

      navigation.navigate("OCRCamera", {
        ocrType: imageActionMode,
        sourceScreen: "ItemDetail",
        itemDetailParams: {
          ...route.params,
          mode: "edit",
        },
      });

      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    updateField("image_url", asset.uri);
    setImageActionVisible(false);
  };

  const handleFindServiceCenter = () => {
    const brand = draft?.brand?.trim();

    if (!brand) {
      openNotice(
        "안내",
        "브랜드 정보가 없어 서비스 센터를 검색할 수 없습니다.",
      );
      return;
    }

    navigation.navigate("ServiceCenterMap", {
      brand,
      productName: draft?.product_name,
    });
  };

  if (isLoading || !draft) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.icon} />
        <Text style={styles.loadingText}>정보를 확인 중이에요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AppHeader
          title="세부 정보"
          leftType="back"
          isEditing={isEditMode}
          rightComponent={
            <TouchableOpacity
              onPress={handlePressAction}
              disabled={isSaving || isUploadingImage}
              style={{
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSaving || isUploadingImage ? (
                <ActivityIndicator size="small" color={colors.primaryDark} />
              ) : (
                <Text
                  style={
                    isEditMode
                      ? styles.textButtonLabelEditing
                      : styles.textButtonLabelSaved
                  }
                >
                  {buttonLabel}
                </Text>
              )}
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderImageCard()}
        {renderProductSummarySection()}

        <View style={styles.infoGroupCard}>
          {renderCompactField("brand", draft.brand, {
            required: true,
            placeholder: "브랜드를 입력하세요",
          })}
          {renderWarrantyFieldCompact()}
        </View>

        <View style={styles.infoGroupCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>구매 정보</Text>

            {isEditMode && (
              <TouchableOpacity
                style={styles.ocrMiniButton}
                activeOpacity={0.85}
                onPress={() => openOCRActionSheet("RECEIPT")}
              >
                <MaterialCommunityIcons
                  name="text-recognition"
                  size={16}
                  color={colors.primaryDark}
                />
                <Text style={styles.ocrMiniButtonText}>OCR</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderPurchaseInfoCard()}
        </View>

        <View style={styles.infoGroupCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text style={styles.compactLabel}>제품 정보 링크</Text>

            <TouchableOpacity
              onPress={handleCopyProductLink}
              activeOpacity={0.85}
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={14}
                color={colors.primaryDark}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.primaryDark,
                  fontWeight: "500",
                }}
              >
                복사
              </Text>
            </TouchableOpacity>
          </View>

          {isEditMode ? (
            <Pressable
              onPress={() => openFieldModal("product_link_url")}
              style={styles.compactValueBox}
            >
              <Text
                style={[
                  styles.compactValueText,
                  !draft.product_link_url && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {draft.product_link_url || "링크를 입력하세요"}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.compactReadonlyBox}>
              <Text
                style={[
                  styles.compactValueText,
                  !draft.product_link_url && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {draft.product_link_url || "링크를 입력하세요"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoGroupCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>시리얼 넘버</Text>

            {isEditMode && (
              <TouchableOpacity
                style={styles.ocrMiniButton}
                activeOpacity={0.85}
                onPress={() => openOCRActionSheet("SERIAL")}
              >
                <MaterialCommunityIcons
                  name="text-recognition"
                  size={16}
                  color={colors.primaryDark}
                />
                <Text style={styles.ocrMiniButtonText}>OCR</Text>
              </TouchableOpacity>
            )}
          </View>

          {renderCompactField("serial_number", draft.serial_number, {
            placeholder: "시리얼 번호를 입력하세요",
          })}
        </View>

        <View style={styles.infoGroupCard}>
          {renderCompactField("memo", draft.memo, {
            placeholder: "메모를 입력하세요",
            multiline: true,
          })}
        </View>

        {!isEditMode && renderNearCenterButton()}
      </ScrollView>
      {dateModalVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, date) => {
            if (date) {
              updateField("purchase_date", formatDate(date));
              setSelectedDate(date);
            }
            setDateModalVisible(false);
          }}
        />
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onShow={() => {
          Keyboard.dismiss();

          setTimeout(() => {
            inputRef.current?.focus();
          }, 250);
        }}
        onRequestClose={closeFieldModal}
      >
        <View style={modalStyles.modalRoot}>
          <Pressable
            style={modalStyles.modalBackdrop}
            onPress={closeFieldModal}
          />
          <View
            pointerEvents="box-none"
            style={modalStyles.keyboardSheetContainer}
          >
            <View
              style={[
                modalStyles.inputModalCard,
                {
                  marginBottom:
                    keyboardHeight > 0
                      ? keyboardHeight + 60
                      : insets.bottom + 16,
                },
              ]}
            >
              <Text style={modalStyles.inputModalTitle}>
                {selectedField ? fieldMeta[selectedField]?.label : ""}
                {selectedField && fieldMeta[selectedField]?.required && (
                  <Text style={{ color: colors.danger }}> *</Text>
                )}
              </Text>

              <Text style={modalStyles.inputModalDescription}>
                {selectedField
                  ? fieldMeta[selectedField]?.description ||
                    "정보를 입력해주세요."
                  : ""}
              </Text>

              <TextInput
                ref={inputRef}
                value={modalValue}
                onChangeText={setModalValue}
                onFocus={() => console.log("input focused")}
                showSoftInputOnFocus={true}
                editable={true}
                placeholder={
                  selectedField ? fieldMeta[selectedField]?.placeholder : ""
                }
                keyboardType={
                  selectedField
                    ? (fieldMeta[selectedField]?.keyboardType ?? "default")
                    : "default"
                }
                multiline={
                  selectedField ? fieldMeta[selectedField]?.multiline : false
                }
                maxLength={
                  selectedField
                    ? fieldMeta[selectedField]?.maxLength
                    : undefined
                }
                style={[
                  modalStyles.inputModalInput,
                  selectedField &&
                    fieldMeta[selectedField]?.multiline &&
                    modalStyles.inputModalMultiline,
                ]}
              />

              <View style={modalStyles.inputModalMetaRow}>
                {!!selectedField && fieldMeta[selectedField]?.maxLength && (
                  <Text style={modalStyles.inputModalLength}>
                    {modalValue.length}/{fieldMeta[selectedField]?.maxLength}
                  </Text>
                )}
              </View>

              <View style={modalStyles.inputModalButtonRow}>
                <Pressable
                  style={modalStyles.inputModalCancelButton}
                  onPress={closeFieldModal}
                >
                  <Text style={modalStyles.inputModalCancelText}>취소</Text>
                </Pressable>

                <Pressable
                  style={modalStyles.inputModalConfirmButton}
                  onPress={applyFieldModal}
                >
                  <Text style={modalStyles.inputModalConfirmText}>적용</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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

            <Text style={modalStyles.sheetTitle}>
              {imageActionMode === "IMAGE"
                ? "아이템 이미지 변경"
                : imageActionMode === "RECEIPT"
                  ? "구매 정보 OCR"
                  : "시리얼 넘버 OCR"}
            </Text>

            <Text style={modalStyles.sheetDescription}>
              {imageActionMode === "IMAGE"
                ? "갤러리에서 이미지를 선택하거나 직접 촬영할 수 있어요."
                : imageActionMode === "RECEIPT"
                  ? "영수증 사진을 선택하거나 컷 오버레이에 맞춰 직접 촬영해주세요."
                  : "시리얼 넘버가 적힌 제품 라벨 사진을 선택하거나 직접 촬영해주세요."}
            </Text>

            <Pressable
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
                  앨범에 저장된 사진을 불러옵니다
                </Text>
              </View>
            </Pressable>

            <Pressable
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
                  {imageActionMode === "IMAGE"
                    ? "카메라로 새 제품 사진을 촬영합니다"
                    : "카메라 화면에서 인식 영역에 맞춰 촬영합니다"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={warrantyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWarrantyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setWarrantyModalVisible(false)}
          />

          <View style={modalStyles.pickerModalCard}>
            <Text style={modalStyles.pickerModalTitle}>무상 보증 기간</Text>
            <Text style={modalStyles.pickerModalDescription}>
              년 / 개월 단위로 입력해주세요.
            </Text>

            <View style={styles.warrantyPickerRow}>
              <Pressable
                style={[
                  styles.warrantyValueCard,
                  activeWarrantyUnit === "year" &&
                    styles.warrantyValueCardActive,
                ]}
                onPress={() => setActiveWarrantyUnit("year")}
              >
                <Text style={styles.warrantyValueNumber}>
                  {pad2(warrantyYears)}
                </Text>
                <Text style={styles.warrantyValueLabel}>년</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.warrantyValueCard,
                  activeWarrantyUnit === "month" &&
                    styles.warrantyValueCardActive,
                ]}
                onPress={() => setActiveWarrantyUnit("month")}
              >
                <Text style={styles.warrantyValueNumber}>
                  {pad2(warrantyExtraMonths)}
                </Text>
                <Text style={styles.warrantyValueLabel}>개월</Text>
              </Pressable>
            </View>

            <View style={styles.warrantyKeypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Pressable
                  key={num}
                  style={styles.warrantyKey}
                  onPress={() => appendWarrantyDigit(num)}
                >
                  <Text style={styles.warrantyKeyText}>{num}</Text>
                </Pressable>
              ))}

              <View style={styles.warrantyKeyPlaceholder} />

              <Pressable
                style={styles.warrantyKey}
                onPress={() => appendWarrantyDigit(0)}
              >
                <Text style={styles.warrantyKeyText}>0</Text>
              </Pressable>

              <Pressable
                style={styles.warrantyKey}
                onPress={removeWarrantyDigit}
              >
                <MaterialCommunityIcons
                  name="backspace-outline"
                  size={22}
                  color={colors.textPrimary}
                />
              </Pressable>
            </View>

            <View style={modalStyles.inputModalButtonRow}>
              <Pressable
                style={modalStyles.inputModalCancelButton}
                onPress={clearWarrantyModal}
              >
                <Text style={modalStyles.inputModalCancelText}>제거</Text>
              </Pressable>

              <Pressable
                style={modalStyles.inputModalConfirmButton}
                onPress={applyWarrantyModal}
              >
                <Text style={modalStyles.inputModalConfirmText}>적용</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={noticeVisible} transparent animationType="fade">
        <View style={modalStyles.confirmOverlay}>
          <View style={modalStyles.confirmBox}>
            <Text style={modalStyles.confirmTitle}>{noticeTitle}</Text>

            <Text style={modalStyles.confirmText}>{noticeMessage}</Text>

            <View style={modalStyles.confirmButtons}>
              <TouchableOpacity
                style={[
                  modalStyles.confirmButton,
                  modalStyles.confirmConfirmButton,
                ]}
                onPress={closeNotice}
              >
                <Text style={modalStyles.confirmConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
