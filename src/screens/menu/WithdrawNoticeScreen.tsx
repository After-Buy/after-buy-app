import { runUnauthorizedHandler } from "@/src/services/api/api";
import { authApi } from "@/src/services/api/authapi";
import { clearAllAuthData } from "@/src/utils/authStorage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { withdrawStyles } from "../../styles/menu/menuStyle";

export default function WithdrawNoticeScreen() {
  const navigation = useNavigation<any>();
  const [agreed, setAgreed] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const handlePressWithdraw = () => {
    if (!agreed) return;
    setConfirmVisible(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      setIsWithdrawing(true);

      await authApi.withdraw();

      setConfirmVisible(false);
    } catch (error) {
      console.log("[WITHDRAW_ERROR]", error);
      setConfirmVisible(false);
      setErrorVisible(true);
      return;
    } finally {
      setIsWithdrawing(false);
    }

    await clearAllAuthData();

    setTimeout(() => {
      runUnauthorizedHandler();
    }, 500);
  };

  return (
    <View style={withdrawStyles.screen}>
      <View style={withdrawStyles.headerArea}>
        <AppHeader title="회원탈퇴" leftType="back" rightType="none" />
      </View>

      <ScrollView
        contentContainerStyle={withdrawStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={withdrawStyles.profileCard}>
          <View style={withdrawStyles.profileIconWrap}>
            <MaterialCommunityIcons
              name="account-outline"
              size={26}
              color={colors.primaryDark}
            />
          </View>

          <Text style={withdrawStyles.profileName}>김진우</Text>
          <Text style={withdrawStyles.profileEmail}>gachon@gachon.ac.kr</Text>
        </View>

        <View style={withdrawStyles.noticeCard}>
          <Text style={withdrawStyles.noticeTitle}>
            탈퇴 전 꼭 확인해주세요
          </Text>

          <View style={withdrawStyles.noticeItem}>
            <View style={withdrawStyles.noticeBullet} />
            <Text style={withdrawStyles.noticeText}>
              회원 탈퇴 시 등록된 전자기기 정보와 서비스 이용 기록이 삭제됩니다.
            </Text>
          </View>

          <View style={withdrawStyles.noticeItem}>
            <View style={withdrawStyles.noticeBullet} />
            <Text style={withdrawStyles.noticeText}>
              삭제된 데이터는 복구할 수 없습니다.
            </Text>
          </View>

          <View style={withdrawStyles.noticeItem}>
            <View style={withdrawStyles.noticeBullet} />
            <Text style={withdrawStyles.noticeText}>
              추후 동일 계정으로 다시 가입하더라도 기존 정보는 복원되지
              않습니다.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={withdrawStyles.agreeRow}
          onPress={() => setAgreed((prev) => !prev)}
        >
          <View
            style={[
              withdrawStyles.checkbox,
              agreed && withdrawStyles.checkboxChecked,
            ]}
          >
            {agreed && (
              <MaterialCommunityIcons
                name="check"
                size={16}
                color={colors.white}
              />
            )}
          </View>

          <Text style={withdrawStyles.agreeText}>
            회원 탈퇴 유의사항을 확인했으며 탈퇴에 동의합니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            withdrawStyles.withdrawButton,
            !agreed && withdrawStyles.withdrawButtonDisabled,
          ]}
          onPress={handlePressWithdraw}
          disabled={!agreed}
        >
          <Text
            style={[
              withdrawStyles.withdrawButtonText,
              !agreed && withdrawStyles.withdrawButtonTextDisabled,
            ]}
          >
            회원탈퇴
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={withdrawStyles.modalOverlay}>
          <Pressable
            style={withdrawStyles.modalBackdrop}
            onPress={() => setConfirmVisible(false)}
          />

          <View style={withdrawStyles.confirmCard}>
            <View style={withdrawStyles.confirmIconWrap}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={colors.danger}
              />
            </View>

            <Text style={withdrawStyles.confirmTitle}>
              정말 탈퇴하시겠어요?
            </Text>

            <Text style={withdrawStyles.confirmDescription}>
              탈퇴가 완료되면 계정 정보와 연결된 데이터는 복구할 수 없습니다.
            </Text>

            <View style={withdrawStyles.confirmButtonRow}>
              <Pressable
                style={withdrawStyles.cancelButton}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={withdrawStyles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable
                style={withdrawStyles.confirmButton}
                onPress={handleConfirmWithdraw}
                disabled={isWithdrawing}
              >
                <Text style={withdrawStyles.confirmButtonText}>
                  {isWithdrawing ? "탈퇴 중..." : "탈퇴하기"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={errorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorVisible(false)}
      >
        <View style={withdrawStyles.modalOverlay}>
          <Pressable
            style={withdrawStyles.modalBackdrop}
            onPress={() => setErrorVisible(false)}
          />

          <View style={withdrawStyles.confirmCard}>
            <View style={withdrawStyles.confirmIconWrap}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={colors.danger}
              />
            </View>

            <Text style={withdrawStyles.confirmTitle}>탈퇴 실패</Text>

            <Text style={withdrawStyles.confirmDescription}>
              회원탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            </Text>

            <View style={withdrawStyles.confirmButtonRow}>
              <Pressable
                style={withdrawStyles.confirmButton}
                onPress={() => setErrorVisible(false)}
              >
                <Text style={withdrawStyles.confirmButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
