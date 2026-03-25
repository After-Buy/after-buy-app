import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import ErrorState from "../../components/common/error/ErrorState";
import HomeAssetSection from "../../components/common/home/HomeAssetSection";
import RegisterPromoCard from "../../components/common/home/RegisterPromoCard";
import WarrantyAlertCard from "../../components/common/home/WarrantyAlertCard";
import { emptyHomeMock, loadedHomeMock } from "../../mocks/homeMock";
import { homeStyles } from "../../styles/homeStyle";
import { HomeStatus } from "../../types/home";
import { HomeScreenProps } from "../../types/navigation";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [status, setStatus] = useState<HomeStatus>("loaded");

  if (status === "error") {
    return (
      <View style={homeStyles.screen}>
        <View style={homeStyles.scrollContent}>
          <Text style={homeStyles.headerTitle}>홈</Text>
          <ErrorState
            title="정보를 불러오지 못했습니다"
            buttonText="다시 시도"
            onPress={() => setStatus("loaded")}
          />
        </View>
      </View>
    );
  }

  const homeData = status === "empty" ? emptyHomeMock : loadedHomeMock;

  return (
    <View style={homeStyles.screen}>
      <ScrollView contentContainerStyle={homeStyles.scrollContent}>
        <AppHeader title="홈" />

        <HomeAssetSection
          summary={homeData.summary}
          recentItems={homeData.recentItems}
          onPressViewAll={() => navigation.navigate("아이템")}
          onPressItem={(id) => {
            console.log("아이템 상세 이동:", id);
          }}
        />

        <RegisterPromoCard onPress={() => navigation.navigate("아이템")} />

        <WarrantyAlertCard
          item={homeData.warrantyAlert}
          onPressProductLink={() => {
            console.log("제품 정보 링크 이동");
          }}
          onPressServiceCenter={() => {
            console.log("가까운 서비스 센터 이동");
          }}
          onPressItem={(id) => {
            console.log("보증 임박 아이템 상세 이동:", id);
          }}
        />
      </ScrollView>
    </View>
  );
}
