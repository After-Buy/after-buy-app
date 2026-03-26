import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";
import { deviceService } from "../../services/database/deviceService";
import { Device } from "../../types/database";

const ItemDetailScreen = ({ route }: any) => {
  const { deviceId } = route.params;
  const [isEdit, setIsEdit] = useState(false);
  const [item, setItem] = useState<Device | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    deviceService.getDeviceById(deviceId).then((data) => {
      setItem(data);
      setForm(data);
    });
  }, [deviceId]);

  const handleSave = async () => {
    await deviceService.updateDevice(deviceId, form);
    setItem(form);
    setIsEdit(false);
  };

  if (!item)
    return (
      <View style={styles.container}>
        <Text>로드 중...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <AppHeader
        title={isEdit ? "정보 수정" : item.product_name}
        rightElement={
          <TouchableOpacity
            onPress={() => (isEdit ? handleSave() : setIsEdit(true))}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.body,
                fontWeight: "600",
              }}
            >
              {isEdit ? "저장" : "수정"}
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>상품명</Text>
          {isEdit ? (
            <TextInput
              style={styles.input}
              value={form.product_name}
              onChangeText={(t) => setForm({ ...form, product_name: t })}
            />
          ) : (
            <Text style={styles.valueTitle}>{item.product_name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>브랜드 / 모델명</Text>
          <Text style={styles.valueBody}>
            {item.brand} / {item.model_name}
          </Text>
          {isEdit && (
            <Text style={styles.helperText}>
              * 모델명은 시스템 보호를 위해 수정할 수 없습니다.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>구매일</Text>
          <Text style={styles.valueBody}>{item.purchase_date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>보증 만료일</Text>
          <Text style={[styles.valueBody, { color: colors.danger }]}>
            {item.warranty_expiry_date}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  section: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  valueTitle: {
    fontSize: typography.subtitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  valueBody: { fontSize: typography.body, color: colors.textPrimary },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.xs,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  helperText: {
    fontSize: typography.small,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

export default ItemDetailScreen;
