import { spacing } from "@/src/constants/spacing";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
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
import { deviceService } from "../../services/database/deviceService";
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

  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState<number | null>(
    null,
  );
  const [moveTargetFolderName, setMoveTargetFolderName] = useState("전체 자산");
  const [moveTargetFolders, setMoveTargetFolders] = useState<Folder[]>([]);
  const [moveTargetDevices, setMoveTargetDevices] = useState<Device[]>([]);
  const [moveTargetBreadcrumbs, setMoveTargetBreadcrumbs] = useState<
    BreadcrumbItem[]
  >([]);

  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [selectionMode, setSelectionMode] = useState(initialSelectionMode);
  const [selectedFolders, setSelectedFolders] = useState<number[]>(
    initialSelectedFolders,
  );
  const [selectedDevices, setSelectedDevices] = useState<number[]>(
    initialSelectedDevices,
  );

  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useLayoutEffect(() => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle:
        selectionMode || searchMode ? { display: "none" } : undefined,
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation, searchMode, selectionMode]);

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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredFolders = searchMode
    ? folders.filter((folder) =>
        folder.folder_name.toLowerCase().includes(normalizedQuery),
      )
    : folders;

  const filteredDevices = searchMode
    ? devices.filter((device) =>
        device.product_name.toLowerCase().includes(normalizedQuery),
      )
    : devices;

  const displayData =
    searchMode && normalizedQuery.length > 0
      ? [...filteredFolders, ...filteredDevices]
      : [...folders, ...devices];

  const breadcrumbItems: BreadcrumbItem[] = [
    { folder_id: null, folder_name: "root" },
    ...breadcrumbs,
  ];

  const isSearching = searchMode && normalizedQuery.length > 0;
  const hasNoSearchResult = isSearching && displayData.length === 0;
  const hasNoDefaultData =
    !searchMode && folders.length === 0 && devices.length === 0;

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) {
      return <Text style={styles.titleText}>{text}</Text>;
    }

    const escapedQuery = escapeRegExp(query.trim());
    const regex = new RegExp(`(${escapedQuery})`, "ig");
    const parts = text.split(regex);

    return (
      <Text style={styles.titleText}>
        {parts.map((part, index) => {
          const isMatch = part.toLowerCase() === query.trim().toLowerCase();

          return (
            <Text
              key={`${part}-${index}`}
              style={isMatch ? styles.highlightText : undefined}
            >
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

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

  const loadMoveModalData = async (
    targetFolderId: number | null,
    targetFolderName: string,
  ) => {
    const { folders, devices, breadcrumbs } =
      await folderService.getFolderContents(1, targetFolderId);

    setMoveTargetFolderId(targetFolderId);
    setMoveTargetFolderName(targetFolderName);
    setMoveTargetFolders(folders);
    setMoveTargetDevices(devices);
    setMoveTargetBreadcrumbs([
      { folder_id: null, folder_name: "root" },
      ...breadcrumbs,
    ]);
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) {
      Alert.alert("안내", "삭제할 항목을 선택해주세요.");
      return;
    }

    Alert.alert("삭제 확인", "선택한 항목을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            for (const folderId of selectedFolders) {
              await folderService.deleteFolder(folderId);
            }

            for (const deviceId of selectedDevices) {
              await deviceService.deleteDevice(deviceId);
            }

            await loadData();
            exitSelectionMode();

            Alert.alert("완료", "삭제되었습니다.");
          } catch (error) {
            Alert.alert("오류", "삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleOpenMoveModal = async () => {
    if (selectedCount === 0) {
      Alert.alert("안내", "이동할 항목을 선택해주세요.");
      return;
    }

    try {
      await loadMoveModalData(folderId, folderName);
      setMoveModalVisible(true);
    } catch (error) {
      Alert.alert("오류", "이동 위치를 불러오지 못했습니다.");
    }
  };

  const handlePressMoveFolder = async (folder: Folder) => {
    await loadMoveModalData(folder.folder_id, folder.folder_name);
  };

  const handlePressMoveBreadcrumb = async (item: BreadcrumbItem) => {
    if (item.folder_id === null) {
      await loadMoveModalData(null, "전체 자산");
      return;
    }

    await loadMoveModalData(item.folder_id, item.folder_name);
  };

  const handleConfirmMove = async () => {
    if (selectedCount === 0) {
      Alert.alert("안내", "이동할 항목을 선택해주세요.");
      return;
    }

    try {
      for (const selectedFolderId of selectedFolders) {
        const isInvalid = await folderService.isDescendantFolder(
          selectedFolderId,
          moveTargetFolderId,
        );

        if (isInvalid) {
          Alert.alert(
            "안내",
            "폴더는 자기 자신 또는 하위 폴더로 이동할 수 없습니다.",
          );
          return;
        }
      }

      await folderService.bulkMoveItems({
        folderIds: selectedFolders,
        deviceIds: selectedDevices,
        targetFolderId: moveTargetFolderId,
      });

      setMoveModalVisible(false);
      await loadData();
      exitSelectionMode();

      Alert.alert("완료", "항목이 이동되었습니다.");
    } catch (error) {
      Alert.alert("오류", "이동 중 문제가 발생했습니다.");
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

  const selectedCount = selectedFolders.length + selectedDevices.length;

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

  const renderListCard = ({
    item,
    selectable = false,
    isSelected = false,
    onPress,
    onPressSelect,
    showRightIcon = true,
  }: {
    item: Folder | Device;
    selectable?: boolean;
    isSelected?: boolean;
    onPress: () => void;
    onPressSelect?: () => void;
    showRightIcon?: boolean;
  }) => {
    const isFolder = !("device_id" in item);

    return (
      <TouchableOpacity style={styles.itemCard} onPress={onPress}>
        {selectable && onPressSelect && (
          <TouchableOpacity
            onPress={onPressSelect}
            style={[
              styles.itemSelectToggle,
              isSelected && styles.itemSelectToggleActive,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={18} color={colors.white} />
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
          {!isFolder && <Text style={styles.codeText}>{item.model_name}</Text>}

          {renderHighlightedText(
            isFolder ? item.folder_name : item.product_name,
            searchQuery,
          )}

          {isFolder ? (
            <Text style={styles.folderCountText}>
              {item.device_count ?? 0}개
            </Text>
          ) : (
            <Text style={styles.subtitleText}>{item.brand}</Text>
          )}
        </View>

        {showRightIcon && (
          <View style={styles.rightIconWrapper}>
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={colors.textSecondary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
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

    return renderListCard({
      item,
      selectable: selectionMode,
      isSelected,
      onPress: handlePressCard,
      onPressSelect: () => toggleSelection(item),
      showRightIcon: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        {searchMode ? (
          <View style={[styles.searchHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity
              onPress={() => {
                setSearchMode(false);
                setSearchQuery("");
              }}
              style={styles.searchBackButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.searchInputWrapper}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="폴더 또는 아이템 검색"
                autoFocus
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
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
              setMenuVisible(false);
              setSearchMode(true);
              setSearchQuery("");
            }}
          />
        )}
        {menuVisible && (
          <>
            <Pressable
              style={styles.menuBackdrop}
              onPress={() => setMenuVisible(false)}
            />

            <View style={styles.menuCard}>
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
                <Text style={styles.menuItemText}>선택</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItemButton}
                onPress={() => {
                  setMenuVisible(false);
                  setFolderModalVisible(true);
                }}
              >
                <Text style={styles.menuItemText}>폴더 추가</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {!searchMode && (
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
                      name="home"
                      style={[
                        isLast
                          ? styles.breadcrumbTextActive
                          : styles.breadcrumbText,
                        { fontSize: 25 },
                      ]}
                    />
                  ) : (
                    <Text
                      style={
                        isLast
                          ? styles.breadcrumbTextActive
                          : styles.breadcrumbText
                      }
                    >
                      {item.folder_name}
                    </Text>
                  )}
                </TouchableOpacity>

                {!isLast && (
                  <MaterialCommunityIcons
                    name="arrow-right-drop-circle"
                    style={styles.breadcrumbDivider}
                  />
                )}
              </Fragment>
            );
          })}
        </View>
      )}
      <FlatList
        data={displayData}
        keyExtractor={(item) =>
          "device_id" in item
            ? `device-${item.device_id}`
            : `folder-${item.folder_id}`
        }
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          displayData.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          hasNoSearchResult ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="magnify-close"
                size={48}
                color="#9CA3AF"
              />
              <Text style={styles.emptyTitle}>검색 결과가 없습니다.</Text>
              <Text style={styles.emptyDescription}>
                다른 키워드로 다시 검색해보세요.
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>등록된 항목이 없습니다.</Text>
          )
        }
      />

      {!selectionMode && !searchMode && (
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
            onPress={handleOpenMoveModal}
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
              handleDeleteSelected();
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
      <Modal
        visible={moveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoveModalVisible(false)}
      >
        <View style={styles.moveModalOverlay}>
          <Pressable
            style={styles.moveModalBackdrop}
            onPress={() => setMoveModalVisible(false)}
          />

          <View style={styles.moveModalCard}>
            <View style={styles.moveModalBreadcrumbContainer}>
              {moveTargetBreadcrumbs.map((item, index) => {
                const isLast = index === moveTargetBreadcrumbs.length - 1;

                return (
                  <Fragment key={`${item.folder_id}-${index}`}>
                    <TouchableOpacity
                      disabled={isLast}
                      onPress={() => handlePressMoveBreadcrumb(item)}
                    >
                      {item.folder_id === null ? (
                        <MaterialCommunityIcons
                          name="home"
                          style={[
                            isLast
                              ? styles.breadcrumbTextActive
                              : styles.breadcrumbText,
                            { fontSize: 25 },
                          ]}
                        />
                      ) : (
                        <Text
                          style={
                            isLast
                              ? styles.breadcrumbTextActive
                              : styles.breadcrumbText
                          }
                        >
                          {item.folder_name}
                        </Text>
                      )}
                    </TouchableOpacity>

                    {!isLast && (
                      <MaterialCommunityIcons
                        name="arrow-right-drop-circle"
                        style={styles.breadcrumbDivider}
                      />
                    )}
                  </Fragment>
                );
              })}
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={[...moveTargetFolders, ...moveTargetDevices]}
                keyExtractor={(item) =>
                  "device_id" in item
                    ? `move-device-${item.device_id}`
                    : `move-folder-${item.folder_id}`
                }
                renderItem={({ item }) => {
                  const isFolder = !("device_id" in item);

                  return renderListCard({
                    item,
                    selectable: false,
                    onPress: () => {
                      if (isFolder) {
                        handlePressMoveFolder(item);
                      }
                    },
                    showRightIcon: false,
                  });
                }}
              />
            </View>

            <View style={styles.moveModalFooter}>
              <TouchableOpacity
                style={styles.moveModalFooterButton}
                onPress={() => setMoveModalVisible(false)}
              >
                <Text style={styles.moveModalCancelText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moveModalFooterButton}
                onPress={handleConfirmMove}
              >
                <Text style={styles.moveModalConfirmText}>여기로 이동</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
