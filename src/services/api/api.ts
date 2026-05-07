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
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 403 &&
      !originalRequest.url?.includes("/auth/logout") &&
      !originalRequest.url?.includes("/auth/withdraw")
    ) {
      console.log("[AUTH] 403 발생 → 강제 로그아웃");

      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      onUnauthorized?.();

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/token/refresh")
    ) {
      console.log("[INTERCEPTOR] 401 발생 → refresh 시도");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("refreshToken 없음");
        }

        console.log("[REFRESH] 토큰 재발급 요청");

        console.log("[REFRESH REQUEST BODY]", {
          refreshToken,
        });

        const res = await axios.post(`${BASE}/api/auth/token/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        console.log("[REFRESH] 성공");
        console.log("[REFRESH RESPONSE FULL]", res.data);

        await AsyncStorage.setItem("accessToken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError: any) {
        console.log("[REFRESH] 실패 → 로그아웃 처리");
        console.log("[REFRESH ERROR STATUS]", refreshError.response?.status);
        console.log("[REFRESH ERROR DATA]", refreshError.response?.data);
        console.log("[REFRESH ERROR URL]", refreshError.config?.url);
        console.log("[REFRESH ERROR METHOD]", refreshError.config?.method);

        processQueue(refreshError, null);

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        onUnauthorized?.();
        console.log("[AUTH] 강제 로그아웃 실행");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const runUnauthorizedHandler = () => {
  onUnauthorized?.();
};
