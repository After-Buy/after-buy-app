import { authService } from "@/src/services/database/authService";
import { modalStyles } from "@/src/styles/modalStyle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
import { profileEditStyles } from "../../styles/menu/menuStyle";

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const [imageActionVisible, setImageActionVisible] = useState(false);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const [isSubmittingNickname, setIsSubmittingNickname] = useState(false);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      const profile = await authService.getMyProfile();

      if (!profile) return;

      setNickname(profile.nickname);
      setTempNickname(profile.nickname);
      setProfileImageUri(profile.profile_image_url);
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
    await authService.patchMyProfile({
      profile_image_url: asset.uri,
    });
    setProfileImageUri(asset.uri);
    setImageActionVisible(false);
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
    await authService.patchMyProfile({
      profile_image_url: asset.uri,
    });
    setProfileImageUri(asset.uri);
    setImageActionVisible(false);
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

      // TODO: 실제 API 연결 전 임시 반영
      await authService.patchMyProfile({ nickname: trimmed });
      setNickname(trimmed);

      // 실제 연결 시 예시
      // await userService.updateMe({ nickname: trimmed });

      setNicknameModalVisible(false);
      setNicknameError("");
    } catch (error) {
      Alert.alert("오류", "닉네임 수정 중 문제가 발생했습니다.");
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
          <Text style={profileEditStyles.heroEmail}>gachon@gachon.ac.kr</Text>

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

            <Text style={profileEditStyles.infoValueDisabled}>
              gachon@gachon.ac.kr
            </Text>
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
        <View style={modalStyles.modalOverlay}>
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
        onRequestClose={() => setNicknameModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={modalStyles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={modalStyles.modalBackdrop}
            onPress={() => setNicknameModalVisible(false)}
          />

          <View style={modalStyles.nicknameModalCard}>
            <Text style={modalStyles.nicknameModalTitle}>닉네임 수정</Text>
            <Text style={modalStyles.nicknameModalDescription}>
              서비스에서 표시되는 이름을 변경할 수 있어요.
            </Text>

            <TextInput
              value={tempNickname}
              onChangeText={handleChangeNickname}
              autoFocus
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
