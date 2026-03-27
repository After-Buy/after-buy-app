import { spacing } from "@/src/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { folderService } from "../../services/database/folderService";
import { itemListStyle as styles } from "../../styles/item/itemStyle";
import { Device, Folder } from "../../types/database";

export default function ItemListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { folderId = null, folderName = "전체 자산" } = route.params || {};

  const [folders, setFolders] = useState<Folder[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const loadData = async () => {
    // user_id는 임시로 1 설정
    const { folders, devices } = await folderService.getFolderContents(
      1,
      folderId,
    );
    setFolders(folders);
    setDevices(devices);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [folderId]);

  const renderItem = ({ item }: { item: any }) => {
    const isFolder = !("device_id" in item);

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          isFolder
            ? navigation.push("ItemList", {
                folderId: item.folder_id,
                folderName: item.folder_name,
              })
            : navigation.navigate("ItemDetail", {
                deviceId: item.device_id,
                mode: "view",
              })
        }
      >
        <View style={styles.thumbnailBox}>
          <Ionicons
            name={isFolder ? "folder-outline" : "image-outline"}
            size={32}
            color="#667085"
          />
        </View>

        <View style={styles.textContainer}>
          {!isFolder && (
            <Text style={styles.codeText}>{item.product_code}</Text>
          )}

          <Text style={styles.titleText}>
            {isFolder ? item.folder_name : item.product_name}
          </Text>

          {isFolder ? (
            <Text style={styles.folderCountText}>
              {item.device_count ?? 0}개
            </Text>
          ) : (
            <Text style={styles.subtitleText}>
              {item.brand} | {item.model_name}
            </Text>
          )}
        </View>

        <View style={styles.rightIconWrapper}>
          <Ionicons
            name={isFolder ? "ellipsis-vertical" : "ellipsis-vertical"}
            size={18}
            color="#667085"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AppHeader
          title="아이템"
          leftType={folderId !== null ? "back" : "menu"}
          rightType="search"
          onPressLeft={() => {
            if (folderId !== null) {
              navigation.goBack();
            } else {
              console.log("메뉴 버튼 클릭");
            }
          }}
          onPressRight={() => {
            console.log("검색 버튼 클릭");
          }}
        />
      </View>
      <FlatList
        data={[...folders, ...devices]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          folders.length === 0 && devices.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>등록된 항목이 없습니다.</Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: spacing.xxxxl }]}
        onPress={() => navigation.navigate("ItemRegisterModel", { folderId })}
      >
        <Ionicons name="add" size={28} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}
