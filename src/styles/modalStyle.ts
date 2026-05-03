import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { radius } from "../constants/radius";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export const modalStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },

  keyboardSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  keyboardCenterContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.32)",
  },

  profileImageSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D5DCE5",
    marginBottom: spacing.lg,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  sheetDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
  },

  sheetActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#DCEBFA",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },

  sheetActionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#CFE5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  sheetActionTextWrap: {
    flex: 1,
  },

  sheetActionTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },

  sheetActionSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  nicknameModalCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  nicknameModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  nicknameModalDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  nicknameInput: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E2EE",
    backgroundColor: "#FAFCFF",
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  nicknameMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  nicknameErrorText: {
    flex: 1,
    fontSize: 12,
    color: colors.danger,
    marginRight: spacing.sm,
  },

  nicknameLengthText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  nicknameModalButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  nicknameCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  nicknameCancelText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  nicknameConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark,
  },

  nicknameConfirmText: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.white,
  },

  inputModalCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  inputModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  inputModalDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  inputModalInput: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E2EE",
    backgroundColor: "#FAFCFF",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlignVertical: "top",
  },

  inputModalMultiline: {
    minHeight: 132,
  },

  inputModalMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  inputModalHint: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },

  inputModalLength: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  inputModalButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  inputModalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  inputModalCancelText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  inputModalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  inputModalConfirmText: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.white,
  },

  pickerModalCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pickerModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  pickerModalDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: spacing.xl,
  },

  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  confirmBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },

  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 23,
    marginTop: 15,
    marginBottom: 15,
  },

  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  confirmCancelButton: {
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },

  confirmConfirmButton: {
    backgroundColor: colors.primaryDark,
    marginLeft: 8,
  },

  confirmCancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  confirmConfirmText: {
    color: "white",
    fontWeight: "700",
  },

  confirmTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
});
