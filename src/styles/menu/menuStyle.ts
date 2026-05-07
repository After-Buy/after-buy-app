import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

const { height } = Dimensions.get("window");

export const menuStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxxl,
    gap: spacing.xl,
  },

  errorContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },

  profileCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primary,

    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.22)",
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  profileTextWrapper: {
    flex: 1,
  },

  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },

  profileEmail: {
    fontSize: typography.caption,
    color: "rgba(255,255,255,0.82)",
  },

  profileChevron: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    marginLeft: spacing.md,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: "800",
    color: colors.primaryDark,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },

  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",

    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  menuItem: {
    minHeight: 82,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },

  menuIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: "#CFE5FF",
  },

  menuTextWrapper: {
    flex: 1,
  },

  menuTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },

  menuSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  logoutButton: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#F3D1D1",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,

    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  logoutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.danger,
  },
});

export const profileEditStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxxl,
    gap: spacing.xl,
  },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    alignItems: "center",

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  avatarOuter: {
    position: "relative",
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.primaryLight,
    borderWidth: 4,
    borderColor: colors.primarySurface,
  },

  avatarEditFab: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  heroEmail: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  imageEditButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#CFE5FF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },

  imageEditText: {
    fontSize: typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: "800",
    color: colors.primaryDark,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  infoTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  infoLabelWrap: {
    flex: 1,
    marginRight: spacing.md,
  },

  infoLabel: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: 4,
  },

  infoHelper: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  infoValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  infoValueDisabled: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMuted,
  },

  editBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#CFE5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  readonlyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },

  readonlyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  dangerSection: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  dangerTitle: {
    fontSize: typography.caption,
    fontWeight: "800",
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },

  withdrawButton: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#F3D1D1",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,

    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  withdrawIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },

  withdrawText: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.danger,
  },

  withdrawDescription: {
    paddingHorizontal: spacing.lg,
    fontSize: typography.small,
    lineHeight: 18,
    color: colors.textSecondary,
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
    marginBottom: spacing.xxxxl,
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
});

export const guideListStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.sm,
  },

  helperText: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxxl,
    gap: spacing.md,
  },

  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.10)",
    marginBottom: spacing.md,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF6FF",
    marginRight: spacing.md,
  },

  textArea: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },

  preview: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  date: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },

  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  emptyListContent: {
    justifyContent: "center",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  emptyDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export const guideDetailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
  },

  scrollContent: {
    paddingBottom: spacing.xxxxl,
  },

  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  guideCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    overflow: "hidden",
  },

  topSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#CFE2FF",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: spacing.sm,
  },

  date: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginHorizontal: spacing.xl,
  },

  contentSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  content: {
    fontSize: 16,
    lineHeight: 27,
    color: colors.textPrimary,
    fontWeight: "400",
  },
});

export const noticeListStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.sm,
  },

  categoryWrap: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  categoryChip: {
    paddingHorizontal: spacing.lg,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#DCEBFA",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryChipSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDark,
  },

  categoryTextSelected: {
    color: colors.white,
  },

  helperText: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  topDivider: {
    height: 0,
  },

  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxxl,
    gap: spacing.md,
  },

  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.10)",
    marginBottom: spacing.md,
  },

  noticeCardRead: {
    opacity: 0.92,
  },

  noticeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  categoryBadge: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  categoryBadgeInfo: {
    backgroundColor: "#E8F3FF",
    borderColor: "#BFDFFF",
  },

  categoryBadgeInspect: {
    backgroundColor: "#FFF4E5",
    borderColor: "#FFD8A8",
  },

  categoryBadgeUpdate: {
    backgroundColor: "#EAFBF2",
    borderColor: "#B7F0D2",
  },

  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  categoryBadgeTextInfo: {
    color: "#2F80ED",
  },
  categoryBadgeTextInspect: {
    color: "#E67E22",
  },
  categoryBadgeTextUpdate: {
    color: "#27AE60",
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primaryDark,
  },

  noticeTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    letterSpacing: -0.2,
  },

  noticeTitleRead: {
    color: "#5B6573",
  },

  noticeBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  noticeDate: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "600",
  },

  noticeArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -height * 0.08 }],
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  emptyDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  paginationWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 18,
    paddingBottom: 30,
  },

  pageButton: {
    minWidth: 70,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  pageButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  pageButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },

  pageText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  newText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },

  emptyListContent: {
    justifyContent: "center",
  },

  fixedPaginationArea: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    height: 64,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },

  pageButtonTextDisabled: {
    color: "#94A3B8",
  },

  pageIndicator: {
    minWidth: 78,
    height: 42,
    paddingHorizontal: spacing.md,
    borderRadius: 21,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  pageCurrentText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryDark,
  },

  pageSlashText: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#CBD5E1",
  },

  pageTotalText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textMuted,
  },
});

export const noticeDetailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerArea: {
    paddingTop: spacing.xxxl,
  },

  scrollContent: {
    paddingBottom: spacing.xxxxl,
  },

  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  noticeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    overflow: "hidden",
  },

  topSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: spacing.sm,
  },

  date: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginHorizontal: spacing.xl,
  },

  contentSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  content: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.textPrimary,
    fontWeight: "400",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

export const withdrawStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxxl,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.10)",
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },

  profileIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  profileEmail: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "500",
  },

  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F3D4D4",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },

  noticeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.danger,
    marginBottom: spacing.md,
  },

  noticeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  noticeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
    marginTop: 8,
    marginRight: spacing.sm,
  },

  noticeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    marginBottom: spacing.xl,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C9D4E0",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  checkboxChecked: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },

  agreeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  withdrawButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },

  withdrawButtonDisabled: {
    backgroundColor: "#F4C7C7",
  },

  withdrawButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },

  withdrawButtonTextDisabled: {
    color: "#FFF8F8",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },

  confirmCard: {
    width: "84%",
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  confirmIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.md,
  },

  confirmTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  confirmDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },

  confirmButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
  },
});
