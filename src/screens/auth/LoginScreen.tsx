import React from "react";
import { View } from "react-native";
import PrimaryButton from "../../components/common/PrimaryButton";
import { LoginScreenProps } from "../../types/navigation";

interface Props extends LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <PrimaryButton title="카카오 로그인" onPress={onLogin} />
    </View>
  );
}
