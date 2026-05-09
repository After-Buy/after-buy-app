import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager from "@react-native-cookies/cookies";

export const clearAllAuthData = async () => {
  await AsyncStorage.multiRemove([
    "accessToken",
    "refreshToken",
    "profileUpdated",
  ]);

  await CookieManager.clearAll(true);
};
