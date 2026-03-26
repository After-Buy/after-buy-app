import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";

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
