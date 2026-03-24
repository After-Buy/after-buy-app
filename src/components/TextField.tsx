import { TextInput } from "react-native";
import { colors } from "../constants/colors";

export default function TextField(props: any) {
  return (
    <TextInput
      {...props}
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        borderRadius: 10,
      }}
    />
  );
}
