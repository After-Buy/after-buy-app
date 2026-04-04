import { typography } from "@/src/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { deviceService } from "../../services/database/deviceService";
import { itemDetailStyle as styles } from "../../styles/item/itemStyle";
import { ItemStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<ItemStackParamList, "ItemDetail">;

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
): DeviceDraft => ({
  folder_id: folderId,
  product_name: "",
  model_name: modelName,
  brand: "",
  image_url: "",
  product_link_url: "",
  purchase_date: "",
  purchase_price: "",
  purchase_store: "",
  warranty_months: "",
  serial_number: "",
  memo: "",
});

export default function ItemDetailScreen({ navigation, route }: Props) {
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
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [warrantyModalVisible, setWarrantyModalVisible] = useState(false);
  const [warrantyYears, setWarrantyYears] = useState(0);
  const [warrantyExtraMonths, setWarrantyExtraMonths] = useState(0);
  const [activeWarrantyUnit, setActiveWarrantyUnit] = useState<
    "year" | "month"
  >("year");

  useEffect(() => {
    const init = async () => {
      if (isCreateMode) {
        const folderId =
          "folderId" in route.params ? (route.params.folderId ?? null) : null;
        const modelName =
          "modelName" in route.params ? route.params.modelName : "";

        setDraft(createEmptyDraft(folderId, modelName));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const device = await deviceService.getDeviceById(deviceId as number);

        if (!device) {
          Alert.alert("오류", "아이템 정보를 찾을 수 없습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
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
        Alert.alert("오류", "아이템 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [deviceId, isCreateMode, navigation, route.params]);

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
        placeholder?: string;
        multiline?: boolean;
        keyboardType?: "default" | "numeric";
        required?: boolean;
        editable?: boolean;
      }
    >
  > = {
    product_name: {
      label: "상품명",
      placeholder: "상품명을 입력하세요",
      required: true,
    },
    model_name: {
      label: "모델명",
      required: true,
      editable: false,
    },
    brand: {
      label: "브랜드",
      placeholder: "브랜드를 입력하세요",
      required: true,
    },
    purchase_date: {
      label: "구매일",
      placeholder: "YYYY-MM-DD",
      required: true,
    },
    purchase_price: {
      label: "구매가",
      placeholder: "예: 500000",
      keyboardType: "numeric",
      required: true,
    },
    warranty_months: {
      label: "무상 보증 기간(개월)",
      placeholder: "예: 12",
      keyboardType: "numeric",
      required: true,
    },
    purchase_store: {
      label: "구매처",
      placeholder: "구매처를 입력하세요",
    },
    product_link_url: {
      label: "제품 정보 링크",
      placeholder: "링크를 입력하세요",
    },
    serial_number: {
      label: "S/N",
      placeholder: "시리얼 번호를 입력하세요",
    },
    memo: {
      label: "메모",
      placeholder: "메모를 입력하세요",
      multiline: true,
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
      Alert.alert("안내", "상품명을 입력해주세요.");
      return false;
    }

    if (!draft.model_name.trim()) {
      Alert.alert("안내", "모델명이 올바르지 않습니다.");
      return false;
    }

    if (!draft.brand.trim()) {
      Alert.alert("안내", "브랜드를 입력해주세요.");
      return false;
    }

    if (!draft.purchase_date.trim()) {
      Alert.alert("안내", "구매일을 입력해주세요.");
      return false;
    }

    if (!draft.purchase_price.trim()) {
      Alert.alert("안내", "구매가를 입력해주세요.");
      return false;
    }

    if (!draft.warranty_months.trim()) {
      Alert.alert("안내", "보증기간을 입력해주세요.");
      return false;
    }

    const price = Number(draft.purchase_price);
    const warrantyMonths = Number(draft.warranty_months);

    if (Number.isNaN(price) || price <= 0) {
      Alert.alert("안내", "구매가는 숫자로 입력해주세요.");
      return false;
    }

    if (Number.isNaN(warrantyMonths) || warrantyMonths <= 0) {
      Alert.alert("안내", "보증기간을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handlePressAction = async () => {
    if (!draft) return;

    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    if (!validateDraft()) return;

    try {
      setIsSaving(true);

      if (isCreateMode) {
        await deviceService.createDevice({
          user_id: 1,
          folder_id: draft.folder_id,
          product_name: draft.product_name.trim(),
          model_name: draft.model_name.trim(),
          brand: draft.brand.trim(),
          image_url: draft.image_url.trim(),
          product_link_url: draft.product_link_url.trim(),
          purchase_date: draft.purchase_date.trim(),
          purchase_price: Number(draft.purchase_price),
          purchase_store: draft.purchase_store.trim(),
          warranty_months: Number(draft.warranty_months),
          serial_number: draft.serial_number.trim(),
          memo: draft.memo.trim(),
        });

        Alert.alert("완료", "제품이 등록되었습니다.", [
          {
            text: "확인",
            onPress: () => navigation.pop(2),
          },
        ]);
        return;
      }

      await deviceService.updateDevice(deviceId as number, {
        folder_id: draft.folder_id,
        product_name: draft.product_name.trim(),
        brand: draft.brand.trim(),
        image_url: draft.image_url.trim(),
        product_link_url: draft.product_link_url.trim(),
        purchase_date: draft.purchase_date.trim(),
        purchase_price: Number(draft.purchase_price),
        purchase_store: draft.purchase_store.trim(),
        warranty_months: Number(draft.warranty_months),
        serial_number: draft.serial_number.trim(),
        memo: draft.memo.trim(),
      });

      setIsEditMode(false);
      Alert.alert("완료", "제품 정보가 저장되었습니다.");
    } catch (error) {
      Alert.alert("오류", "저장 중 문제가 발생했습니다.");
    } finally {
      setIsSaving(false);
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

  const removeWarrantyDigit = () => {
    if (activeWarrantyUnit === "year") {
      setWarrantyYears((prev) => Math.floor(prev / 10));
      return;
    }

    setWarrantyExtraMonths((prev) => Math.floor(prev / 10));
  };

  const renderField = (
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
      <View style={styles.card}>
        <Text style={styles.label}>
          {fieldMeta[fieldKey]?.label}
          {showRequiredMark && <Text style={styles.required}> *</Text>}
        </Text>

        {isPressable ? (
          <Pressable
            onPress={() => {
              if (isPressable) openFieldModal(fieldKey);
            }}
            style={[
              styles.input,
              !isEditable && styles.readonlyInput,
              options?.multiline && styles.multilineInput,
            ]}
          >
            <Text
              style={[
                styles.inputText,
                !isEditable && styles.readonlyInputText,
                !value && styles.placeholderText,
              ]}
              numberOfLines={options?.multiline ? 4 : 1}
            >
              {value || options?.placeholder || ""}
            </Text>
          </Pressable>
        ) : (
          <View
            style={options?.multiline ? styles.readonlyTextBlock : undefined}
          >
            <Text
              style={[
                styles.readonlyValueText,
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
      <View style={styles.card}>
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
                    styles.purchaseCardInputText,
                    !purchaseDate && styles.placeholderText,
                  ]}
                >
                  {purchaseDate || "YYYY-MM-DD"}
                </Text>
                <Text> </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            ) : (
              <Text
                style={[
                  styles.purchaseCardValue,
                  !purchaseDate && styles.placeholderText,
                ]}
              >
                {purchaseDate || "YYYY-MM-DD"}
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
              >
                {purchasePrice
                  ? `${Number(purchasePrice).toLocaleString()}원`
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
        style={[styles.card, { height: 80, justifyContent: "center" }]}
        onPress={() => console.log("인근 서비스센터 조회")}
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
              color={colors.textSecondary}
            />
            <Text
              style={{
                fontSize: typography.body,
                color: colors.textPrimary,
                fontWeight: "600",
              }}
            >
              가까운 서비스 센터
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderWarrantyField = () => {
    const display = getWarrantyDisplay(draft?.warranty_months ?? "");
    const warrantyInfo = getWarrantyInfo();

    return (
      <View style={styles.card}>
        <Text style={styles.label}>
          무상 보증 기간{isEditMode && <Text style={styles.required}> *</Text>}
        </Text>

        {isEditMode ? (
          <Pressable onPress={openWarrantyModal} style={styles.input}>
            <Text
              style={[
                styles.inputText,
                !display.hasValue && styles.placeholderText,
              ]}
            >
              {display.hasValue ? display.text : "보증 기간을 선택하세요"}
            </Text>
          </Pressable>
        ) : (
          <Text
            style={[
              styles.readonlyValueText,
              !display.hasValue && styles.placeholderText,
            ]}
          >
            {display.hasValue ? display.text : "보증 기간을 선택하세요"}
          </Text>
        )}

        {warrantyInfo && (
          <View style={styles.warrantyInfoWrap}>
            <Text style={styles.warrantyInfoExpiry}>
              {warrantyInfo.expiryText}
            </Text>
            <Text style={styles.warrantyInfoDday}>{warrantyInfo.ddayText}</Text>
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
            onPress={() => setImageActionVisible(true)}
            style={styles.cameraButton}
          >
            <MaterialCommunityIcons
              name="camera-plus"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    updateField("image_url", asset.uri); // 🔥 핵심
    setImageActionVisible(false);
  };
  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    updateField("image_url", asset.uri);
    setImageActionVisible(false);
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
          rightText={isSaving ? "저장 중..." : buttonLabel}
          isEditing={isEditMode}
          onPressLeft={() => navigation.goBack()}
          onPressRight={handlePressAction}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderImageCard()}
        {renderProductSummarySection()}

        {renderField("brand", draft.brand, {
          required: true,
          placeholder: "브랜드를 입력하세요",
        })}

        {renderWarrantyField()}

        {renderPurchaseInfoCard()}

        {renderField("product_link_url", draft.product_link_url, {
          placeholder: "링크를 입력하세요",
        })}

        {renderField("serial_number", draft.serial_number, {
          placeholder: "시리얼 번호를 입력하세요",
        })}

        {renderField("memo", draft.memo, {
          placeholder: "메모를 입력하세요",
          multiline: true,
        })}

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
        onRequestClose={closeFieldModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeFieldModal} />

          <View style={styles.modalCard}>
            <Text style={styles.modalLabel}>
              {selectedField ? fieldMeta[selectedField]?.label : ""}
            </Text>

            <TextInput
              value={modalValue}
              onChangeText={setModalValue}
              autoFocus
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
              style={[
                styles.modalInput,
                selectedField &&
                  fieldMeta[selectedField]?.multiline &&
                  styles.modalMultilineInput,
              ]}
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={closeFieldModal}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>

              <Pressable
                style={styles.modalConfirmButton}
                onPress={applyFieldModal}
              >
                <Text style={styles.modalConfirmText}>적용</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        visible={imageActionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageActionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setImageActionVisible(false)}
          />

          <View style={styles.imageActionContainer}>
            <Pressable
              style={styles.imageActionButton}
              onPress={handlePickFromGallery}
            >
              <Text style={styles.imageActionText}>갤러리에서 선택</Text>
            </Pressable>

            <Pressable
              style={styles.imageActionButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.imageActionText}>직접 촬영</Text>
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

          <View style={styles.modalCard}>
            <Text style={styles.modalLabel}>무상 보증 기간</Text>

            <View style={styles.warrantyPickerRow}>
              <Pressable
                style={[
                  styles.warrantyValueBox,
                  activeWarrantyUnit === "year" &&
                    styles.warrantyValueBoxActive,
                ]}
                onPress={() => setActiveWarrantyUnit("year")}
              >
                <Text style={styles.warrantyValueText}>
                  {pad2(warrantyYears)}
                </Text>
                <Text style={styles.warrantyUnitText}>년</Text>
              </Pressable>

              <Text style={styles.warrantyPlusText}>+</Text>

              <Pressable
                style={[
                  styles.warrantyValueBox,
                  activeWarrantyUnit === "month" &&
                    styles.warrantyValueBoxActive,
                ]}
                onPress={() => setActiveWarrantyUnit("month")}
              >
                <Text style={styles.warrantyValueText}>
                  {pad2(warrantyExtraMonths)}
                </Text>
                <Text style={styles.warrantyUnitText}>개월</Text>
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

              <Pressable
                style={styles.warrantyKey}
                onPress={removeWarrantyDigit}
              >
                <Text style={styles.warrantyKeyText}>←</Text>
              </Pressable>

              <Pressable
                style={styles.warrantyKey}
                onPress={() => appendWarrantyDigit(0)}
              >
                <Text style={styles.warrantyKeyText}>0</Text>
              </Pressable>

              <Pressable
                style={styles.warrantyKey}
                onPress={applyWarrantyModal}
              >
                <Text style={styles.warrantyKeyText}>확인</Text>
              </Pressable>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={clearWarrantyModal}
              >
                <Text style={styles.modalCancelText}>제거</Text>
              </Pressable>

              <Pressable
                style={styles.modalConfirmButton}
                onPress={applyWarrantyModal}
              >
                <Text style={styles.modalConfirmText}>적용</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
