import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

const PRODUCT_COL_WIDTH = 168;
const DDAY_COL_WIDTH = 110;
const COLUMN_GAP = 12;
const CONTENT_ROW_WIDTH = PRODUCT_COL_WIDTH + DDAY_COL_WIDTH + COLUMN_GAP;

export const notificationStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxl,
    backgroundColor: colors.background,
  },

  topBarRow: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  toggleGroup: {
    alignItems: "center",
  },

  toggleLabel: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },

  tableHeader: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  tableHeaderInner: {
    width: CONTENT_ROW_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: COLUMN_GAP,
  },

  tableHeaderProduct: {
    width: PRODUCT_COL_WIDTH,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    color: colors.textSecondary,
  },

  tableHeaderDday: {
    width: DDAY_COL_WIDTH,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    color: colors.textSecondary,
  },

  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxxl,
    gap: spacing.sm,
  },

  notificationCard: {
    height: 130,
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },

    elevation: 0,
    borderWidth: 1,
    borderColor: "#E7ECF3",
  },

  notificationCardRead: {
    backgroundColor: "#F8FAFC",
    opacity: 0.92,
  },

  cardContentRow: {
    width: CONTENT_ROW_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: COLUMN_GAP,
    alignSelf: "center",
  },

  leftSection: {
    width: PRODUCT_COL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },

  centerSection: {
    width: DDAY_COL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },

  imageBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F7FB",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  productName: {
    marginTop: spacing.sm,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },

  ddayText: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: colors.primaryDark,
  },

  ddayTextRead: {
    color: colors.textMuted,
  },

  unreadBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  unreadBadgeText: {
    display: "none",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textSecondary,
    textAlign: "center",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },

  errorText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  retryButton: {
    minWidth: 100,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.icon,
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "700",
  },

  deleteAction: {
    width: 88,
    height: 130,
    marginLeft: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteActionText: {
    color: colors.white,
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
  },

  headerToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerToggleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 0,
    marginRight: 0,
  },
});
