import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { radius } from "../constants/radius";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export const headerStyles = StyleSheet.create({
  headerContainer: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  leftSection: {
    width: 96,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  titleSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  rightSection: {
    width: 96,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  textButtonEditing: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  textButtonSaved: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.softBlue,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  textButtonLabelEditing: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.white,
  },

  textButtonLabelSaved: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.primaryDark,
  },
});
