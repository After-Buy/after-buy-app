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
  },

  actionButtonWrap: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },

  actionButton: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 300,
  },

  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  label: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  required: {
    color: colors.danger,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  readonlyInput: {
    backgroundColor: colors.disabledBackground,
    color: colors.textSecondary,
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
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

  inputText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  readonlyInputText: {
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
    height: 200,
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
    right: spacing.xxxl,
    bottom: spacing.xxxl,
    backgroundColor: colors.icon,
    borderRadius: radius.pill,
    padding: spacing.sm,
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
  warrantyInfoWrap: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  warrantyInfoExpiry: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  warrantyInfoDday: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.primary,
  },

  warrantyPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },

  warrantyValueBox: {
    minWidth: 110,
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  warrantyValueBoxActive: {
    borderBottomColor: colors.primary,
  },

  warrantyValueText: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  warrantyUnitText: {
    fontSize: typography.subtitle,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  warrantyPlusText: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  warrantyKeypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  warrantyKey: {
    width: "30%",
    aspectRatio: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  warrantyKeyText: {
    fontSize: typography.subtitle,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  productSummarySection: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },

  productSummaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  productSummaryLabel: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  productSummaryTitle: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  productSummaryModel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  purchaseCardTopRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  purchaseCardTopCell: {
    flex: 1,
    justifyContent: "space-between",
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
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  purchaseCardValue: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  purchaseCardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  purchaseCardPriceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
    marginTop: spacing.xl,
  },

  purchaseCardInputBox: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },

  purchaseCardDateInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  purchaseCardInputText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  readonlyValueText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "500",
  },

  readonlyTextBlock: {
    paddingVertical: spacing.sm,
  },
});
