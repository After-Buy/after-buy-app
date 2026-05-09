import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  onLogin: () => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
const KAKAO_REDIRECT_URI = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI!;

export default function KakaoLoginWebView({ onLogin }: Props) {
  const alreadyHandled = useRef(false);
  const [loading, setLoading] = useState(false);
  const [webLoading, setWebLoading] = useState(true);

  const kakaoAuthUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;

  const requestLoginToBackend = async (url: string) => {
    if (alreadyHandled.current) return;

    alreadyHandled.current = true;

    try {
      setLoading(true);

      const codeMatch = url.match(/[?&]code=([^&]+)/);
      const errorMatch = url.match(/[?&]error=([^&]+)/);

      if (errorMatch) {
        throw new Error(
          `카카오 로그인 오류: ${decodeURIComponent(errorMatch[1])}`,
        );
      }

      const authCode = codeMatch ? decodeURIComponent(codeMatch[1]) : null;

      if (!authCode) {
        throw new Error("인가 코드를 받지 못했습니다.");
      }

      console.log("카카오 redirect URL:", url);
      console.log("백엔드로 보낼 authCode:", authCode);
      console.log("백엔드로 보낼 redirectUri:", KAKAO_REDIRECT_URI);

      const response = await axios.post(`${API_URL}/api/auth/kakao/login`, {
        authCode,
        redirectUri: KAKAO_REDIRECT_URI,
      });

      const loginData = response.data.data;

      console.log("accessToken:", loginData.accessToken);
      console.log("refreshToken:", loginData.refreshToken);
      console.log("user 정보:", loginData.user);

      await AsyncStorage.setItem("accessToken", loginData.accessToken);
      await AsyncStorage.setItem("refreshToken", loginData.refreshToken);

      onLogin();
    } catch (error) {
      console.log("카카오 로그인 실패:", error);
      Alert.alert("로그인 실패", "카카오 로그인 중 문제가 발생했습니다.");
      alreadyHandled.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {(loading || webLoading) && (
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <ActivityIndicator size="large" color="#FEE500" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 15,
              fontWeight: "600",
              color: "#222222",
            }}
          >
            카카오 로그인 중입니다...
          </Text>
        </View>
      )}

      <WebView
        source={{ uri: kakaoAuthUrl }}
        incognito
        cacheEnabled={false}
        thirdPartyCookiesEnabled={false}
        sharedCookiesEnabled={false}
        startInLoadingState={false}
        onLoadStart={() => setWebLoading(true)}
        onLoadEnd={() => setWebLoading(false)}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;

          if (url.startsWith(KAKAO_REDIRECT_URI)) {
            requestLoginToBackend(url);
            return false;
          }

          return true;
        }}
      />
    </View>
  );
}
