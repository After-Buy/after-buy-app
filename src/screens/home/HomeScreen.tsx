import { Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="홈" />
      <Text>홈 화면</Text>
    </View>
  );
}
