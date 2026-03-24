import { View } from "react-native";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <PrimaryButton
        title="카카오 로그인"
        onPress={() => navigation.navigate("Main")}
      />
    </View>
  );
}
