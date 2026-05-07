import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import AppHeader from "../../components/common/AppHeader";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ServiceCenterMap">;

type Place = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string;
  y: string;
  distance: string;
  place_url: string;
};

export default function ServiceCenterMapScreen({ route }: Props) {
  const { brand, productName } = route.params;

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const keyword = useMemo(() => `${brand} 서비스센터`, [brand]);

  useEffect(() => {
    loadServiceCenters();
  }, []);

  const loadServiceCenters = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "위치 권한이 필요합니다",
          "현재 위치 주변의 서비스 센터를 찾기 위해 위치 권한이 필요합니다.",
          [
            { text: "취소", style: "cancel" },
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
          ],
        );
        setErrorMessage(
          "위치 권한이 없어 주변 서비스 센터를 찾을 수 없습니다.",
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = current.coords.latitude;
      const lng = current.coords.longitude;

      setLocation({ lat, lng });

      const params = new URLSearchParams({
        query: keyword,
        x: String(lng),
        y: String(lat),
        radius: "20000",
        sort: "distance",
        size: "15",
      });

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`KAKAO_LOCAL_ERROR_${response.status}`);
      }

      const json = await response.json();
      setPlaces(json.documents ?? []);

      if (!json.documents || json.documents.length === 0) {
        setErrorMessage("근처 서비스 센터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.log("[ServiceCenterMap] 검색 실패", error);
      setErrorMessage("네트워크 연결이 불안정합니다.");
    } finally {
      setLoading(false);
    }
  };

  // 그대로 복붙하세요

  const mapHtml = useMemo(() => {
    if (!location) return "";

    const markerData = JSON.stringify(
      places.map((place) => ({
        name: place.place_name,
        lat: Number(place.y),
        lng: Number(place.x),
      })),
    );

    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
html, body {
  margin:0;
  padding:0;
  width:100%;
  height:100%;
}

#map {
  width:100%;
  height:100%;
}

/* 🔥 앱 스타일 맞춘 오버레이 */
.mapOverlay {
  min-width:120px;
  max-width:200px;
  background:#ffffff;
  border:1px solid #DCEBFA;
  border-radius:14px;
  padding:10px 12px;
  box-shadow:0 8px 20px rgba(15,23,42,0.18);
}

.mapOverlay::after {
  content:"";
  position:absolute;
  left:50%;
  bottom:-6px;
  width:10px;
  height:10px;
  background:#ffffff;
  border-right:1px solid #DCEBFA;
  border-bottom:1px solid #DCEBFA;
  transform:translateX(-50%) rotate(45deg);
}

.mapOverlay.current {
  border-color:#42A5F5;
}

.overlayTitle {
  font-size:13px;
  font-weight:800;
  color:#0f172a;
}

.overlaySub {
  font-size:11px;
  color:#64748b;
  margin-top:2px;
}

/* 현재 위치 버튼 */
.currentBtn {
  position:absolute;
  right:12px;
  bottom:12px;
  z-index:10;
  height:42px;
  padding:0 14px;
  border:none;
  border-radius:21px;
  background:#ffffff;
  color:#1e293b;
  font-size:13px;
  font-weight:700;
  box-shadow:0 4px 12px rgba(15,23,42,0.18);
}
</style>

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAP_JS_KEY}&autoload=false"></script>
</head>

<body>
<div id="map"></div>

<script>
function initMap(){
  const currentLat = ${location.lat};
  const currentLng = ${location.lng};
  const places = ${markerData};

  const container = document.getElementById("map");
  const center = new kakao.maps.LatLng(currentLat, currentLng);

  const map = new kakao.maps.Map(container, {
    center:center,
    level:5
  });

  // 현재 위치 마커
  const currentMarker = new kakao.maps.Marker({
    map:map,
    position:center
  });

  // 현재 위치 오버레이
  const currentOverlay = new kakao.maps.CustomOverlay({
    position:center,
    yAnchor:1.4,
    content:\`
      <div class="mapOverlay current">
        <div class="overlayTitle">현재 위치</div>
        <div class="overlaySub">내 위치 기준</div>
      </div>
    \`
  });

  let openedOverlay = null;
  let openedMarker = null;

  // 현재 위치 클릭
  kakao.maps.event.addListener(currentMarker, "click", function(){
    if(openedOverlay && openedMarker === currentMarker){
      openedOverlay.setMap(null);
      openedOverlay = null;
      openedMarker = null;
      return;
    }

    if(openedOverlay){
      openedOverlay.setMap(null);
    }

    currentOverlay.setMap(map);
    openedOverlay = currentOverlay;
    openedMarker = currentMarker;
  });

  const bounds = new kakao.maps.LatLngBounds();
  bounds.extend(center);

  // 서비스센터 마커
  places.forEach(function(place){
    const position = new kakao.maps.LatLng(place.lat, place.lng);

    const marker = new kakao.maps.Marker({
      map:map,
      position:position
    });

    const overlay = new kakao.maps.CustomOverlay({
      position:position,
      yAnchor:1.4,
      content:\`
        <div class="mapOverlay">
          <div class="overlayTitle">\${place.name}</div>
          <div class="overlaySub">서비스 센터</div>
        </div>
      \`
    });

    kakao.maps.event.addListener(marker, "click", function(){
      if(openedOverlay && openedMarker === marker){
        openedOverlay.setMap(null);
        openedOverlay = null;
        openedMarker = null;
        return;
      }

      if(openedOverlay){
        openedOverlay.setMap(null);
      }

      overlay.setMap(map);
      openedOverlay = overlay;
      openedMarker = marker;
    });

    bounds.extend(position);
  });

  if(places.length > 0){
    map.setBounds(bounds);
  }

  // 현재 위치 버튼
  const btn = document.createElement("button");
  btn.className = "currentBtn";
  btn.innerText = "현재 위치";

  btn.onclick = function(){
    map.setLevel(4);
    map.panTo(center);

    if(openedOverlay){
      openedOverlay.setMap(null);
    }

    currentOverlay.setMap(map);
    openedOverlay = currentOverlay;
    openedMarker = currentMarker;
  };

  container.appendChild(btn);

  setTimeout(function(){
    map.relayout();
  },300);
}

kakao.maps.load(initMap);
</script>

</body>
</html>
`;
  }, [location, places]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <AppHeader title="서비스 센터 찾기" leftType="back" />
      </View>

      <View style={styles.summaryArea}>
        <Text style={styles.title}>{brand} 서비스 센터</Text>
        {!!productName && <Text style={styles.subtitle}>{productName}</Text>}
      </View>

      <View style={styles.mapCard}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primaryDark} />
            <Text style={styles.loadingText}>
              주변 서비스 센터를 찾는 중이에요
            </Text>
          </View>
        ) : location && mapHtml ? (
          <WebView
            style={styles.webView}
            originWhitelist={["*"]}
            source={{ html: mapHtml, baseUrl: "https://dev.after-buy.r-e.kr" }}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            setSupportMultipleWindows={false}
            onMessage={(event) => {
              console.log("[KAKAO_MAP_WEBVIEW]", event.nativeEvent.data);
            }}
            onError={(event) => {
              console.log("[KAKAO_MAP_WEBVIEW_ERROR]", event.nativeEvent);
            }}
            onHttpError={(event) => {
              console.log("[KAKAO_MAP_WEBVIEW_HTTP_ERROR]", event.nativeEvent);
            }}
          />
        ) : (
          <View style={styles.loadingBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>

      {!loading && (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? (
            <Text style={styles.emptyText}>{errorMessage}</Text>
          ) : (
            places.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.85}
                onPress={() => Linking.openURL(place.place_url)}
                style={styles.placeCard}
              >
                <View style={styles.placeTopRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={18}
                    color={colors.primaryDark}
                  />

                  <Text style={styles.placeName} numberOfLines={1}>
                    {place.place_name}
                  </Text>

                  {!!place.distance && (
                    <Text style={styles.distanceText}>
                      {(Number(place.distance) / 1000).toFixed(1)}km
                    </Text>
                  )}
                </View>

                <Text style={styles.addressText}>
                  {place.road_address_name || place.address_name}
                </Text>

                {!!place.phone && (
                  <Text style={styles.phoneText}>{place.phone}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerArea: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.sm,
  },

  summaryArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  subtitle: {
    marginTop: 4,
    fontSize: typography.small,
    color: colors.textSecondary,
  },

  mapCard: {
    height: 360,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: "#EEF3F8",
    borderWidth: 1,
    borderColor: "#DCEBFA",
  },

  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.small,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxxl,
    gap: spacing.sm,
  },

  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: typography.small,
  },

  placeCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E6EDF5",
  },

  placeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  placeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  distanceText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },

  addressText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 19,
  },

  phoneText: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
});
