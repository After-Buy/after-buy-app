import { Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff" }}>{title}</Text>
    </TouchableOpacity>
  );
}
