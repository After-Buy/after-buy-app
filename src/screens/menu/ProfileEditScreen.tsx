import { authApi } from "@/src/services/api/authapi";
import { modalStyles } from "@/src/styles/modalStyle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
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
import { profileEditStyles } from "../../styles/menu/menuStyle";

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const [imageActionVisible, setImageActionVisible] = useState(false);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const [isSubmittingNickname, setIsSubmittingNickname] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const nicknameInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
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
    const load = async () => {
      const profile = await authApi.getMyProfile();
      console.log("[PROFILE LOAD]", profile);

      if (!profile) return;

      setNickname(profile.nickname);
      setTempNickname(profile.nickname);
      setProfileImageUri(profile.profileImageUrl);
      setEmail(profile.email);
    };

    load();
  }, []);

  const handleEditImage = () => {
    setImageActionVisible(true);
  };

  const handleEditNickname = () => {
    setTempNickname(nickname);
    setNicknameError("");
    setNicknameModalVisible(true);
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    console.log("[STEP1] asset", {
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileName: asset.fileName,
    });

    try {
      const ext = asset.uri.split(".").pop();

      console.log("[STEP2] ext", ext);

      const { presigned_url, image_url } =
        await authApi.getProfileImagePresignedUrl(ext!);

      console.log("[STEP3] presigned", {
        presigned_url,
        image_url,
      });

      const blob = await (await fetch(asset.uri)).blob();

      console.log("[STEP4] blob", {
        type: blob.type,
        size: blob.size,
      });

      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: {
          "Content-Type": blob.type || "image/jpeg",
        },
        body: blob,
      });

      console.log("[STEP5] upload result", {
        status: uploadRes.status,
        ok: uploadRes.ok,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        console.log("[STEP5 ERROR BODY]", text);
        throw new Error("S3 upload failed");
      }

      await authApi.updateMyProfile({
        profileImageUrl: image_url,
      });

      setProfileImageUri(image_url);
      setImageActionVisible(false);
    } catch (error: any) {
      console.log(
        "[PROFILE_IMAGE_UPLOAD_ERROR_STATUS]",
        error.response?.status,
      );
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_DATA]", error.response?.data);
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_MESSAGE]", error.message);
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_FULL]", error);

      showErrorModal("이미지 업로드에 실패했습니다.");
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    console.log("[STEP1] asset", {
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileName: asset.fileName,
    });

    try {
      const ext = asset.uri.split(".").pop()?.toLowerCase() || "jpg";

      console.log("[STEP2] ext", ext);

      const { presigned_url, image_url } =
        await authApi.getProfileImagePresignedUrl(ext);

      console.log("[STEP3] presigned", {
        presigned_url,
        image_url,
      });

      const blob = await (await fetch(asset.uri)).blob();

      console.log("[STEP4] blob", {
        type: blob.type,
        size: blob.size,
      });

      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: {
          "Content-Type": blob.type || "image/jpeg",
        },
        body: blob,
      });

      console.log("[STEP5] upload result", {
        status: uploadRes.status,
        ok: uploadRes.ok,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        console.log("[STEP5 ERROR BODY]", text);
        throw new Error("S3 upload failed");
      }

      await authApi.updateMyProfile({
        profileImageUrl: image_url,
      });

      setProfileImageUri(image_url);
      setImageActionVisible(false);
    } catch (error: any) {
      console.log(
        "[PROFILE_IMAGE_UPLOAD_ERROR_STATUS]",
        error.response?.status,
      );
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_DATA]", error.response?.data);
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_MESSAGE]", error.message);
      console.log("[PROFILE_IMAGE_UPLOAD_ERROR_FULL]", error);

      showErrorModal("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSaveNickname = async () => {
    const trimmed = tempNickname.trim();

    if (!trimmed) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    if (trimmed.length > 50) {
      setNicknameError("닉네임은 최대 50자까지 입력 가능합니다.");
      return;
    }

    try {
      setIsSubmittingNickname(true);

      const updated = await authApi.updateMyProfile({ nickname: trimmed });
      setNickname(updated.nickname);

      setNicknameModalVisible(false);
      setNicknameError("");
    } catch (error) {
      showErrorModal("닉네임 수정 중 문제가 발생했습니다.");
    } finally {
      setIsSubmittingNickname(false);
    }
  };

  const handleChangeNickname = (text: string) => {
    setTempNickname(text);
    if (nicknameError) setNicknameError("");
  };

  const handleWithdraw = () => {
    navigation.navigate("WithdrawNotice");
  };

  return (
    <View style={profileEditStyles.screen}>
      <View style={profileEditStyles.headerArea}>
        <AppHeader title="프로필" leftType="back" rightType="none" />
      </View>

      <ScrollView
        contentContainerStyle={profileEditStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={profileEditStyles.heroCard}>
          <View style={profileEditStyles.avatarOuter}>
            <Image
              source={
                profileImageUri
                  ? { uri: profileImageUri }
                  : { uri: "https://via.placeholder.com/300x300.png?text=K" }
              }
              style={profileEditStyles.avatar}
            />
          </View>

          <Text style={profileEditStyles.heroName}>{nickname}</Text>
          <Text style={profileEditStyles.heroEmail}>{email}</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={profileEditStyles.imageEditButton}
            onPress={handleEditImage}
          >
            <MaterialCommunityIcons
              name="image-edit-outline"
              size={18}
              color={colors.primaryDark}
            />
            <Text style={profileEditStyles.imageEditText}>
              프로필 이미지 변경
            </Text>
          </TouchableOpacity>
        </View>

        <View style={profileEditStyles.section}>
          <Text style={profileEditStyles.sectionTitle}>프로필 관리</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={profileEditStyles.infoCard}
            onPress={handleEditNickname}
          >
            <View style={profileEditStyles.infoTopRow}>
              <View style={profileEditStyles.infoLabelWrap}>
                <Text style={profileEditStyles.infoLabel}>사용자 닉네임</Text>
                <Text style={profileEditStyles.infoHelper}>
                  서비스에서 표시되는 이름
                </Text>
              </View>

              <View style={profileEditStyles.editBadge}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color={colors.primaryDark}
                />
              </View>
            </View>

            <Text style={profileEditStyles.infoValue}>{nickname}</Text>
          </TouchableOpacity>

          <View style={profileEditStyles.infoCard}>
            <View style={profileEditStyles.infoTopRow}>
              <View style={profileEditStyles.infoLabelWrap}>
                <Text style={profileEditStyles.infoLabel}>e-mail</Text>
                <Text style={profileEditStyles.infoHelper}>
                  카카오 계정 연동 이메일
                </Text>
              </View>

              <View style={profileEditStyles.readonlyBadge}>
                <Text style={profileEditStyles.readonlyBadgeText}>
                  읽기 전용
                </Text>
              </View>
            </View>

            <Text style={profileEditStyles.infoValueDisabled}>{email}</Text>
          </View>
        </View>

        <View style={profileEditStyles.dangerSection}>
          <Text style={profileEditStyles.dangerTitle}>계정 관리</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={profileEditStyles.withdrawButton}
            onPress={handleWithdraw}
          >
            <View style={profileEditStyles.withdrawIconWrap}>
              <MaterialCommunityIcons
                name="account-remove-outline"
                size={18}
                color={colors.danger}
              />
            </View>
            <Text style={profileEditStyles.withdrawText}>회원탈퇴</Text>
          </TouchableOpacity>

          <Text style={profileEditStyles.withdrawDescription}>
            탈퇴 시 계정 정보와 연결된 데이터가 모두 삭제되며 복구할 수
            없습니다.
          </Text>
        </View>
      </ScrollView>
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

            <Text style={modalStyles.sheetTitle}>프로필 이미지 변경</Text>
            <Text style={modalStyles.sheetDescription}>
              갤러리에서 이미지를 선택하거나 직접 촬영할 수 있어요.
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
                  카메라로 새 프로필 사진을 촬영합니다
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={nicknameModalVisible}
        transparent
        animationType="fade"
        onShow={() => {
          Keyboard.dismiss();

          setTimeout(() => {
            nicknameInputRef.current?.focus();
          }, 300);

          setTimeout(() => {
            nicknameInputRef.current?.focus();
          }, 600);
        }}
        onRequestClose={() => setNicknameModalVisible(false)}
      >
        <View style={modalStyles.modalRoot}>
          <Pressable
            style={modalStyles.modalBackdrop}
            onPress={() => setNicknameModalVisible(false)}
          />
          <View
            style={[
              modalStyles.keyboardSheetContainer,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <View
              style={[
                modalStyles.nicknameModalCard,
                {
                  marginBottom:
                    keyboardHeight > 0
                      ? keyboardHeight + 55
                      : insets.bottom + 16,
                },
              ]}
            >
              <Text style={modalStyles.nicknameModalTitle}>닉네임 수정</Text>
              <Text style={modalStyles.nicknameModalDescription}>
                서비스에서 표시되는 이름을 변경할 수 있어요.
              </Text>

              <TextInput
                ref={nicknameInputRef}
                value={tempNickname}
                onChangeText={handleChangeNickname}
                showSoftInputOnFocus
                maxLength={50}
                placeholder="닉네임을 입력하세요"
                style={modalStyles.nicknameInput}
              />

              <View style={modalStyles.nicknameMetaRow}>
                <Text style={modalStyles.nicknameErrorText}>
                  {nicknameError || " "}
                </Text>
                <Text style={modalStyles.nicknameLengthText}>
                  {tempNickname.length}/50
                </Text>
              </View>

              <View style={modalStyles.nicknameModalButtonRow}>
                <Pressable
                  style={modalStyles.nicknameCancelButton}
                  onPress={() => setNicknameModalVisible(false)}
                >
                  <Text style={modalStyles.nicknameCancelText}>취소</Text>
                </Pressable>

                <Pressable
                  style={modalStyles.nicknameConfirmButton}
                  onPress={handleSaveNickname}
                  disabled={isSubmittingNickname}
                >
                  <Text style={modalStyles.nicknameConfirmText}>
                    {isSubmittingNickname ? "저장 중..." : "저장"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={errorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={modalStyles.confirmOverlay}>
          <View style={modalStyles.confirmBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={30}
              color={colors.danger}
              style={{ alignSelf: "center" }}
            />

            <Text style={modalStyles.confirmTitle}>오류 발생</Text>

            <Text style={modalStyles.confirmText}>{errorMessage}</Text>

            <View style={modalStyles.confirmButtons}>
              <Pressable
                style={[
                  modalStyles.confirmButton,
                  modalStyles.confirmConfirmButton,
                  { marginLeft: 0 },
                ]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={modalStyles.confirmConfirmText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
