import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { radius } from "../constants/radius";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export const headerStyles = StyleSheet.create({
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

  textButton: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  textButtonLabel: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.white,
  },
});
