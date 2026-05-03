import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { radius } from "../constants/radius";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  sectionCard: {
    backgroundColor: "#F0F7FF",
    borderRadius: radius.xl,
    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.divider,

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    elevation: 2, // android
  },

  headerTitle: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.icon,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  emptyBoxWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: spacing.lg,
    backgroundColor: "#F8FBFF",
    borderColor: "#E3EEFB",
  },

  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "#D8E9FF",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  emptyDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },

  emptyHintBox: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: "#EDF6FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  emptyHintText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: spacing.xl,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  summaryNumber: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: typography.caption,
    fontWeight: "500",
    color: colors.textSecondary,
  },

  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },

  recentThumbnail: {
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

  recentThumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  recentItemInfo: {
    flex: 1,
  },

  recentItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  recentItemCode: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },

  detailButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.softBlue,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },

  detailButtonPressed: {
    opacity: 0.55,
  },

  viewAllButton: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
  },

  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },

  viewAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  promoCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: radius.xl,
    shadowOffset: { width: 0, height: 6 },

    elevation: 3,
  },

  promoIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  promoTextWrap: {
    flex: 1,
    justifyContent: "center",
  },

  promoLabel: {
    fontSize: typography.caption,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },

  promoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
    lineHeight: 23,
  },

  promoArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accentYellow,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },

  warrantyTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  warrantyTitleWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },

  warrantyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },

  warrantyButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  warrantyActionButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#FFE4A3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  warrantyActionButtonPressed: {
    opacity: 0.8,
  },

  warrantyActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B7791F",
  },

  errorWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },

  errorTitle: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  errorButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },

  errorButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: typography.body,
  },

  warrantyBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  warrantyBadgeEmoji: {
    fontSize: 24,
  },

  warrantyLabel: {
    fontSize: typography.small,
    fontWeight: "600",
    color: colors.primaryDark,
    marginBottom: 4,
  },

  warrantyHeadline: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
});
