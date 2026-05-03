import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../styles/auth/loginStyle";

interface KakaoLoginButtonProps {
  onPress: () => void;
}

export default function KakaoLoginButton({ onPress }: KakaoLoginButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.kakaoButton}
    >
      <View style={styles.kakaoIconWrap}>
        <View style={styles.kakaoIconCircle} />
        <View style={styles.kakaoIconTail} />
      </View>

      <Text style={styles.kakaoButtonText}>카카오 로그인</Text>

      <View style={styles.kakaoRightSpace} />
    </TouchableOpacity>
  );
}
