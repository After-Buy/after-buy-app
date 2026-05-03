import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#F2F3F5",
  },

  topSpacer: {
    height: height * 0.06,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  logoSection: {
    marginBottom: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  logoWrapper: {
    width: 180,
    height: 180,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  logoStatic: {
    width: 180,
    height: 180,
    position: "absolute",
  },

  logoArrowRotateLayer: {
    width: 180,
    height: 180,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  logoArrow: {
    width: 180,
    height: 180,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#5B6578",
    letterSpacing: -0.6,
    marginBottom: 18,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: "#667085",
    textAlign: "center",
    letterSpacing: -0.3,
  },

  bottomSection: {
    width: "100%",
    paddingBottom: 100,
  },

  kakaoImageButton: {
    width: "100%",
    height: 90,
  },

  kakaoButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#FEE500",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  kakaoButtonText: {
    flex: 1,
    textAlign: "center",
    color: "#191919",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 24,
    letterSpacing: -0.3,
  },

  kakaoIconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  kakaoIconCircle: {
    width: 18,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#000000",
    position: "absolute",
    top: 3,
  },

  kakaoIconTail: {
    position: "absolute",
    left: 5,
    bottom: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 2,
    borderTopWidth: 6,
    borderLeftColor: "#000000",
    borderRightColor: "transparent",
    borderTopColor: "#000000",
    transform: [{ rotate: "18deg" }],
  },

  kakaoRightSpace: {
    width: 24,
  },
});
