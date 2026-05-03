import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!BASE) {
  throw new Error("EXPO_PUBLIC_API_URL이 설정되지 않았습니다.");
}

export const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  console.log("accessToken exists:", !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
