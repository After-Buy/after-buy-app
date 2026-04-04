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
    paddingBottom: 100,
    gap: spacing.lg,
  },

  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    padding: spacing.lg,
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
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  emptyDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },

  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },

  summaryValue: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  recentThumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  recentThumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.sm,
  },

  recentItemInfo: {
    flex: 1,
  },

  recentItemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.icon,
    marginBottom: spacing.xs,
  },

  recentItemCode: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
  },

  viewAllButton: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
  },

  viewAllText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
  },

  promoText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginLeft: spacing.lg,
  },

  warrantyTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },

  warrantyTitleWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },

  warrantyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  warrantyDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },

  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.lg,
  },

  actionButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },

  actionDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },

  actionText: {
    fontSize: typography.body,
    color: colors.icon,
    fontWeight: "500",
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
});
