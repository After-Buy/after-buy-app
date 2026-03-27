import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { headerStyles as styles } from "../../styles/headerStyle";
import { AppHeaderProps } from "../../types/common";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function AppHeader({
  title,
  leftType = "none",
  rightType = "none",
  rightText,
  onPressLeft,
  onPressRight,
}: AppHeaderProps) {
  const navigation = useNavigation();

  const renderLeft = () => {
    if (leftType === "none") return null;

    const iconName: IconName = leftType === "back" ? "chevron-left" : "menu";

    return (
      <TouchableOpacity
        onPress={
          onPressLeft ??
          (leftType === "back" ? () => navigation.goBack() : undefined)
        }
        style={styles.iconButton}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    );
  };

  const renderRight = () => {
    if (rightText) {
      return (
        <TouchableOpacity onPress={onPressRight} style={styles.textButton}>
          <Text style={styles.textButtonLabel}>{rightText}</Text>
        </TouchableOpacity>
      );
    }

    if (rightType === "none") return null;

    const iconName: IconName =
      rightType === "search" ? "magnify" : "dots-vertical";

    return (
      <TouchableOpacity onPress={onPressRight} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>{renderLeft()}</View>

      <View style={styles.titleSection}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>{renderRight()}</View>
    </View>
  );
}
