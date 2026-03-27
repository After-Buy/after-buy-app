import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

export const itemListStyle = StyleSheet.create({
  headerArea: {
    paddingTop: spacing.xxl,
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: colors.white,
  },

  thumbnailBox: {
    width: 72,
    height: 72,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    backgroundColor: "#F8FAFC",
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  codeText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },

  subtitleText: {
    fontSize: 14,
    color: "#6B7280",
  },

  folderCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 4,
  },

  rightIconWrapper: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 48,
    textAlign: "center",
    fontSize: 15,
    color: "#9CA3AF",
  },

  fab: {
    position: "absolute",
    right: spacing.xl,

    width: spacing.xxxl * 2,
    height: spacing.xxxl * 2,
    borderRadius: radius.pill,

    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#64748B",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
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
    paddingBottom: spacing.xxxl,
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
    paddingBottom: 600,
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
    color: "#EF4444",
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
    backgroundColor: "#F3F4F6",
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
});
