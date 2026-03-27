import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
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

  const buttonLabel = useMemo(() => {
    return isEditMode ? "저장" : "수정";
  }, [isEditMode]);

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
      Alert.alert("안내", "보증기간은 개월 수로 입력해주세요.");
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
          purchase_date: draft.purchase_date.trim(),
          purchase_price: Number(draft.purchase_price),
          purchase_store: draft.purchase_store.trim(),
          warranty_months: Number(draft.warranty_months),
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

  const renderField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
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

    return (
      <View style={styles.card}>
        <Text style={styles.label}>
          {label}
          {showRequiredMark && <Text style={styles.required}> *</Text>}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={isEditable}
          placeholder={options?.placeholder}
          multiline={options?.multiline}
          keyboardType={options?.keyboardType ?? "default"}
          style={[
            styles.input,
            !isEditable && styles.readonlyInput,
            options?.multiline && styles.multilineInput,
          ]}
        />
      </View>
    );
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
          onPressLeft={() => navigation.goBack()}
          onPressRight={handlePressAction}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderField(
          "상품명",
          draft.product_name,
          (text) => updateField("product_name", text),
          {
            required: true,
            placeholder: "상품명을 입력하세요",
          },
        )}

        {renderField("모델명", draft.model_name, () => {}, {
          required: true,
          editable: false,
        })}

        {renderField(
          "브랜드",
          draft.brand,
          (text) => updateField("brand", text),
          {
            required: true,
            placeholder: "브랜드를 입력하세요",
          },
        )}

        {renderField(
          "구매일",
          draft.purchase_date,
          (text) => updateField("purchase_date", text),
          {
            required: true,
            placeholder: "YYYY-MM-DD",
          },
        )}

        {renderField(
          "구매가",
          draft.purchase_price,
          (text) => updateField("purchase_price", text),
          {
            required: true,
            placeholder: "예: 500000",
            keyboardType: "numeric",
          },
        )}

        {renderField(
          "무상 보증 기간(개월)",
          draft.warranty_months,
          (text) => updateField("warranty_months", text),
          {
            required: true,
            placeholder: "예: 12",
            keyboardType: "numeric",
          },
        )}

        {renderField(
          "구매처",
          draft.purchase_store,
          (text) => updateField("purchase_store", text),
          {
            placeholder: "구매처를 입력하세요",
          },
        )}

        {renderField(
          "제품 정보 링크",
          draft.product_link_url,
          (text) => updateField("product_link_url", text),
          {
            placeholder: "링크를 입력하세요",
          },
        )}

        {renderField(
          "S/N",
          draft.serial_number,
          (text) => updateField("serial_number", text),
          {
            placeholder: "시리얼 번호를 입력하세요",
          },
        )}

        {renderField("메모", draft.memo, (text) => updateField("memo", text), {
          placeholder: "메모를 입력하세요",
          multiline: true,
        })}
      </ScrollView>
    </View>
  );
}
