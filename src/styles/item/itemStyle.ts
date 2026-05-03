import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

export const itemListStyle = StyleSheet.create({
  headerArea: {
    paddingTop: spacing.xxl,
  },

  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },

  menuCard: {
    position: "absolute",
    top: 72,
    left: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    minWidth: 140,
    zIndex: 20,
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  menuItemButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  menuItemText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  moveModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
  },

  moveModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  moveModalCard: {
    width: "86%",
    height: "70%",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: "hidden",
  },

  moveModalBreadcrumbContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FCFCFD",
  },

  moveModalBreadcrumbDivider: {
    marginHorizontal: spacing.sm,
    color: colors.placeholder,
  },

  moveModalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },

  moveModalFooterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },

  moveModalCancelText: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  moveModalConfirmText: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    backgroundColor: colors.white,
  },

  listContent: {
    paddingBottom: 140,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },

  listSeparator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 20, // 썸네일 왼쪽 맞춤 (중요)
  },

  folderCard: {
    backgroundColor: "#FCFDFE",
  },

  deviceCard: {
    backgroundColor: colors.white,
  },

  folderThumbnailBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
  },

  deviceThumbnailBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#EEF2F7",
  },

  folderTextContainer: {
    paddingRight: spacing.sm,
  },

  deviceTextContainer: {
    paddingRight: spacing.sm,
  },

  folderTitleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  deviceTitleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  thumbnailBox: {
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingRight: spacing.sm,
  },

  codeText: {
    fontSize: 12,
    color: "#98A2B3",
    marginBottom: 4,
    fontWeight: "500",
  },

  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  subtitleText: {
    fontSize: 13,
    color: "#6B7280",
  },

  folderCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#667085",
    marginTop: 4,
  },

  rightIconWrapper: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.34,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: spacing.xs,
    textAlign: "center",
    fontSize: 15,
    color: "#9CA3AF",
    lineHeight: 22,
  },

  emptyTitle: {
    marginTop: spacing.md,
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  emptyDescription: {
    marginTop: spacing.xs,
    textAlign: "center",
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  headerMenuModalOverlay: {
    flex: 1,
  },

  headerMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  headerMenuCard: {
    position: "absolute",
    top: spacing.xl,
    left: spacing.xl,
  },

  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xxxxl,

    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: colors.primary, // ⭐ 핵심
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  selectionHeaderButton: {
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  selectionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  selectionCircleActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  headerTextButton: {
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  breadcrumbContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 4,
  },

  breadcrumbText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },

  breadcrumbTextActive: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },

  breadcrumbDivider: {
    marginHorizontal: 2,
    color: "#CBD5E1",
    fontSize: 18,
  },

  itemSelectToggle: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },

  itemSelectToggleActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  folderCardSelected: {
    backgroundColor: "#F0F7FF",
  },

  deviceCardSelected: {
    backgroundColor: "#F8FAFC",
  },

  bottomActionBar: {
    minHeight: 72,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: spacing.sm,
  },

  bottomActionButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  bottomActionLabel: {
    marginTop: 6,
    fontSize: 15,
    color: "#475467",
  },

  highlightText: {
    backgroundColor: "#FFF3B0",
    color: colors.textPrimary,
    fontWeight: "700",
  },

  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },

  searchBackButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  searchInputWrapper: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  actionModalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  actionModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  actionModalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
  },

  actionPreviewCard: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
  },

  actionMenuButton: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  actionMenuButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  actionMenuDeleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },

  renameModalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  renameModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  renameModalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },

  renameModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  renameModalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 16,
  },

  renameModalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  renameModalCancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },

  renameModalConfirmButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  renameModalCancelText: {
    fontSize: 15,
    color: "#6B7280",
  },

  renameModalConfirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});

export const itemRegisterModelStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  ocrRow: {
    alignItems: "flex-end",
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },

  ocrText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  ocrLoadingText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },

  titleWrap: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: spacing.xxxl,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },

  bottomArea: {
    paddingHorizontal: spacing.lg,
  },

  nextButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  nextButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "700",
  },
});

export const itemDetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(66, 165, 245, 0.08)",
  },

  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxxl + 20,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.08)",
  },

  infoGroupCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.08)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  compactFieldRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15, 23, 42, 0.06)",
  },

  compactFieldRowMultiline: {
    alignItems: "flex-start",
  },

  compactLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
  },

  compactValueBox: {
    minHeight: 44,
    justifyContent: "center",
  },

  compactReadonlyBox: {
    minHeight: 44,
    justifyContent: "center",
  },

  compactValueBoxMultiline: {
    minHeight: 88,
    paddingTop: 2,
  },

  compactValueText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  warrantyInlineBox: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.softBlue,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.18)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  warrantyInlineExpiry: {
    fontSize: 13,
    color: colors.primaryDark,
  },

  warrantyInlineDday: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  purchaseSectionInner: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },

  required: {
    color: colors.danger,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  placeholderText: {
    color: colors.placeholder,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },

  modalCard: {
    width: "86%",
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },

  modalLabel: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  modalInput: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  modalMultilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.lg,
    gap: spacing.md,
  },

  modalCancelButton: {
    minWidth: 72,
    height: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.cancelButton,
    alignItems: "center",
    justifyContent: "center",
  },

  modalConfirmButton: {
    minWidth: 72,
    height: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
  },

  modalCancelText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  modalConfirmText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.white,
  },

  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.md,
  },

  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.disabledBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraButton: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    height: 46,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },

  cameraIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  imageActionContainer: {
    width: "95%",
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.md,
  },

  imageActionButton: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
  },

  imageActionText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "600",
  },

  warrantyPickerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  warrantyValueCard: {
    flex: 1,
    minHeight: 96,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7E2EE",
    backgroundColor: "#F8FBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  warrantyValueCardActive: {
    borderColor: colors.primaryDark,
    backgroundColor: "#EEF6FF",
  },

  warrantyValueNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 36,
  },

  warrantyValueLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  warrantyKeypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 20,
  },

  warrantyKey: {
    width: "30%",
    height: 72,
    borderRadius: 22,
    backgroundColor: "#F7FBFF",
    borderWidth: 1,
    borderColor: "#D6E9FB",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  warrantyKeyPlaceholder: {
    width: "30%",
  },

  warrantyKeyText: {
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.primaryDark,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  productSummarySection: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },

  productSummaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  productSummaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  productSummaryTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.4,
  },

  productSummaryModel: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  purchaseCardTopRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  purchaseCardTopCell: {
    flex: 1,
    justifyContent: "space-between",
    minWidth: 0,
  },

  purchaseCardDivider: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },

  purchaseCardBottomBlock: {
    marginTop: spacing.xl,
  },

  purchaseCardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
  },

  purchaseCardValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  purchaseCardInputBox: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E2EE",
    backgroundColor: "#FAFCFF",
    paddingLeft: 14,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  purchaseCardInputText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    flexShrink: 1,
  },

  purchaseCardDateInput: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E2EE",
    backgroundColor: "#FAFCFF",
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  purchaseCardDateText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginRight: 8,
  },

  purchaseCardDateIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  nearCenterCard: {
    backgroundColor: colors.softBlue,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.12)",

    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  textButtonLabelEditing: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryDark,
  },

  textButtonLabelSaved: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
