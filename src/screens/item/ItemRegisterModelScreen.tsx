import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { itemRegisterModelStyle as styles } from "../../styles/item/itemStyle";
import { ItemStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<ItemStackParamList, "ItemRegisterModel">;

export default function ItemRegisterModelScreen({ navigation, route }: Props) {
  const { folderId = null, folderName = "전체 자산" } = route.params || {};
  const [modelName, setModelName] = useState("");

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
        <View style={styles.ocrRow}>
          <Text style={styles.ocrText}>OCR로 입력하기</Text>
        </View>

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

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
