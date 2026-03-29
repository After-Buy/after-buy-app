import { spacing } from "@/src/constants/spacing";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { Fragment, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { folderService } from "../../services/database/folderService";
import { itemListStyle as styles } from "../../styles/item/itemStyle";
import { BreadcrumbItem, Device, Folder } from "../../types/database";

export default function ItemListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {
    folderId = null,
    folderName = "전체 자산",
    selectionMode: initialSelectionMode = false,
    selectedFolders: initialSelectedFoldersParam,
    selectedDevices: initialSelectedDevicesParam,
  } = route.params || {};

  const initialSelectedFolders = initialSelectedFoldersParam ?? [];
  const initialSelectedDevices = initialSelectedDevicesParam ?? [];

  const [folders, setFolders] = useState<Folder[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [selectionMode, setSelectionMode] = useState(initialSelectionMode);
  const [selectedFolders, setSelectedFolders] = useState<number[]>(
    initialSelectedFolders,
  );
  const [selectedDevices, setSelectedDevices] = useState<number[]>(
    initialSelectedDevices,
  );

  const setTabBarVisible = (visible: boolean) => {
    const parent = navigation.getParent();

    if (!parent) return;

    parent.setOptions({
      tabBarStyle: visible ? undefined : { display: "none" },
    });
  };

  const loadData = async () => {
    const { folders, devices, breadcrumbs } =
      await folderService.getFolderContents(1, folderId);

    setFolders(folders);
    setDevices(devices);
    setBreadcrumbs(breadcrumbs);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [folderId]);

  useEffect(() => {
    setSelectionMode(initialSelectionMode);
    setSelectedFolders(initialSelectedFoldersParam ?? []);
    setSelectedDevices(initialSelectedDevicesParam ?? []);
  }, [
    initialSelectionMode,
    initialSelectedFoldersParam,
    initialSelectedDevicesParam,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      setTabBarVisible(!selectionMode);

      return () => {
        setTabBarVisible(true);
      };
    }, [selectionMode]),
  );

  const breadcrumbItems: BreadcrumbItem[] = [
    { folder_id: null, folder_name: "root" },
    ...breadcrumbs,
  ];

  const handlePressBreadcrumb = (item: BreadcrumbItem) => {
    if (item.folder_id === null) {
      moveToFolder(null, "전체 자산");
      return;
    }

    moveToFolder(item.folder_id, item.folder_name);
  };

  const moveToFolder = (
    nextFolderId: number | null,
    nextFolderName: string,
  ) => {
    if (selectionMode) {
      navigation.replace("ItemList", {
        folderId: nextFolderId,
        folderName: nextFolderName,
        selectionMode: true,
        selectedFolders,
        selectedDevices,
      });
      return;
    }

    navigation.push("ItemList", {
      folderId: nextFolderId,
      folderName: nextFolderName,
    });
  };

  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      Alert.alert("안내", "폴더명을 입력해주세요.");
      return;
    }

    try {
      setIsCreatingFolder(true);

      await folderService.createFolder({
        userId: 1,
        folderName: trimmedName,
        parentFolderId: folderId,
      });

      setNewFolderName("");
      setFolderModalVisible(false);
      setMenuVisible(false);

      await loadData();
    } catch (error) {
      Alert.alert("오류", "폴더를 생성하지 못했습니다.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedFolders([]);
    setSelectedDevices([]);

    navigation.setParams({
      selectionMode: false,
      selectedFolders: [],
      selectedDevices: [],
    });
  };

  const allFolderIds = folders.map((folder) => folder.folder_id);
  const allDeviceIds = devices.map((device) => device.device_id);

  const isAllSelected =
    [...allFolderIds, ...allDeviceIds].length > 0 &&
    selectedFolders.length === allFolderIds.length &&
    selectedDevices.length === allDeviceIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedFolders([]);
      setSelectedDevices([]);

      navigation.setParams({
        selectedFolders: [],
        selectedDevices: [],
      });
      return;
    }

    setSelectedFolders(allFolderIds);
    setSelectedDevices(allDeviceIds);

    navigation.setParams({
      selectedFolders: allFolderIds,
      selectedDevices: allDeviceIds,
    });
  };

  const toggleSelection = (item: any) => {
    const isFolder = !("device_id" in item);

    if (isFolder) {
      setSelectedFolders((prev) => {
        const next = prev.includes(item.folder_id)
          ? prev.filter((id) => id !== item.folder_id)
          : [...prev, item.folder_id];

        navigation.setParams({
          selectedFolders: next,
          selectedDevices,
        });

        return next;
      });
      return;
    }

    setSelectedDevices((prev) => {
      const next = prev.includes(item.device_id)
        ? prev.filter((id) => id !== item.device_id)
        : [...prev, item.device_id];

      navigation.setParams({
        selectedFolders,
        selectedDevices: next,
      });

      return next;
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isFolder = !("device_id" in item);
    const isSelected = isFolder
      ? selectedFolders.includes(item.folder_id)
      : selectedDevices.includes(item.device_id);

    const handlePressCard = () => {
      if (selectionMode) {
        if (isFolder) {
          moveToFolder(item.folder_id, item.folder_name);
          return;
        }

        toggleSelection(item);
        return;
      }

      if (isFolder) {
        moveToFolder(item.folder_id, item.folder_name);
      } else {
        navigation.navigate("ItemDetail", {
          deviceId: item.device_id,
          mode: "view",
        });
      }
    };

    return (
      <TouchableOpacity style={styles.itemCard} onPress={handlePressCard}>
        {selectionMode && (
          <TouchableOpacity
            onPress={() => {
              toggleSelection(item);
            }}
            style={[
              styles.itemSelectToggle,
              isSelected && styles.itemSelectToggleActive,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </TouchableOpacity>
        )}

        <View style={styles.thumbnailBox}>
          {isFolder ? (
            <Ionicons name="folder-outline" size={32} color={colors.icon} />
          ) : item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color={colors.icon} />
          )}
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
          <Ionicons name="ellipsis-vertical" size={18} color="#667085" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AppHeader
          title="아이템"
          leftType={selectionMode ? "none" : "menu"}
          rightType={selectionMode ? "none" : "search"}
          leftComponent={
            selectionMode ? (
              <TouchableOpacity
                onPress={toggleSelectAll}
                style={styles.selectionHeaderButton}
              >
                <View
                  style={[
                    styles.selectionCircle,
                    isAllSelected && styles.selectionCircleActive,
                  ]}
                >
                  {isAllSelected && (
                    <Ionicons name="checkmark" size={18} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ) : undefined
          }
          rightComponent={
            selectionMode ? (
              <TouchableOpacity
                onPress={exitSelectionMode}
                style={styles.headerTextButton}
              >
                <Text style={styles.headerTextButtonLabel}>취소</Text>
              </TouchableOpacity>
            ) : undefined
          }
          onPressLeft={() => {
            setMenuVisible((prev) => !prev);
          }}
          onPressRight={() => {
            console.log("검색 버튼 클릭");
          }}
        />
        {menuVisible && (
          <>
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
              }}
              onPress={() => setMenuVisible(false)}
            />

            <View
              style={{
                position: "absolute",
                top: 72,
                left: 20,
                backgroundColor: "white",
                borderRadius: 12,
                paddingVertical: 8,
                minWidth: 140,
                zIndex: 20,
                elevation: 6,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                onPress={() => {
                  setMenuVisible(false);
                  setSelectedFolders([]);
                  setSelectedDevices([]);
                  setSelectionMode(true);

                  navigation.setParams({
                    selectionMode: true,
                    selectedFolders: [],
                    selectedDevices: [],
                  });
                }}
              >
                <Text style={{ fontSize: 15, color: "#111827" }}>선택</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                onPress={() => {
                  setMenuVisible(false);
                  setFolderModalVisible(true);
                }}
              >
                <Text style={{ fontSize: 15, color: "#111827" }}>
                  폴더 추가
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.breadcrumbContainer}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <Fragment key={`${item.folder_id}-${index}`}>
              <TouchableOpacity
                disabled={isLast}
                onPress={() => handlePressBreadcrumb(item)}
              >
                {item.folder_id === null ? (
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={18}
                    color={isLast ? colors.textPrimary : colors.textSecondary}
                    style={{ marginRight: 2 }}
                  />
                ) : (
                  <Text
                    style={[
                      styles.breadcrumbIcon,
                      {
                        color: isLast
                          ? colors.textPrimary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {item.folder_name}
                  </Text>
                )}
              </TouchableOpacity>

              {!isLast && <Text style={styles.breadcrumbDivider}>{">"}</Text>}
            </Fragment>
          );
        })}
      </View>
      <FlatList
        data={[...folders, ...devices]}
        keyExtractor={(item) =>
          "device_id" in item
            ? `device-${item.device_id}`
            : `folder-${item.folder_id}`
        }
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          folders.length === 0 && devices.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>등록된 항목이 없습니다.</Text>
        }
      />

      {!selectionMode && (
        <TouchableOpacity
          style={[styles.fab, { bottom: spacing.xxxxl }]}
          onPress={() => navigation.navigate("ItemRegisterModel", { folderId })}
        >
          <Ionicons name="add" size={28} color={colors.icon} />
        </TouchableOpacity>
      )}

      {selectionMode && (
        <View style={styles.bottomActionBar}>
          <TouchableOpacity
            onPress={() => {
              console.log("이동 클릭");
            }}
            style={[
              styles.bottomActionButton,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md },
            ]}
          >
            <MaterialCommunityIcons
              name="folder-move"
              size={24}
              color="black"
            />
            <Text style={styles.bottomActionLabel}>이동</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("삭제 클릭");
            }}
            style={[
              styles.bottomActionButton,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md },
            ]}
          >
            <MaterialCommunityIcons name="trash-can" size={24} color="black" />
            <Text style={styles.bottomActionLabel}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={folderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFolderModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={() => setFolderModalVisible(false)}
          />

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              폴더 추가
            </Text>

            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="폴더명을 입력하세요"
              autoFocus
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                color: "#111827",
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginRight: 8,
                }}
                onPress={() => {
                  setFolderModalVisible(false);
                  setNewFolderName("");
                }}
              >
                <Text style={{ fontSize: 15, color: "#6B7280" }}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 10 }}
                disabled={isCreatingFolder}
                onPress={handleCreateFolder}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {isCreatingFolder ? "생성 중..." : "생성"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
