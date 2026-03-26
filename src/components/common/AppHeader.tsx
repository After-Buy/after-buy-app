import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
interface AppHeaderProps {
  title: string;
  leftType?: "none" | "back" | "menu";
  rightType?: "none" | "search";
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

export default function AppHeader({
  title,
  leftType = "none",
  rightType = "none",
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },

  titleSection: {
    flex: 4,
    alignItems: "center",
  },

  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },

  headerTitle: {
    fontSize: typography.subtitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  iconButton: {
    padding: spacing.sm,
  },
});
