import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import ErrorState from "../../components/common/error/ErrorState";
import HomeAssetSection from "../../components/common/home/HomeAssetSection";
import RegisterPromoCard from "../../components/common/home/RegisterPromoCard";
import WarrantyAlertCard from "../../components/common/home/WarrantyAlertCard";
import { deviceService } from "../../services/database/deviceService";
import { homeStyles } from "../../styles/homeStyle";
import { HomeData, HomeStatus } from "../../types/home";
import { HomeScreenProps } from "../../types/navigation";

const emptyHomeData: HomeData = {
  summary: {
    assetCount: 0,
    totalValue: 0,
    expiringSoonCount: 0,
  },
  recentItems: [],
  warrantyAlert: null,
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [status, setStatus] = useState<HomeStatus>("loaded");
  const [homeData, setHomeData] = useState<HomeData>(emptyHomeData);
  const rootNavigation = useNavigation<any>();

  const loadHomeData = async () => {
    try {
      const data = await deviceService.getHomeData(1);
      setHomeData(data);

      const isEmpty =
        data.summary.assetCount === 0 &&
        data.recentItems.length === 0 &&
        !data.warrantyAlert;

      setStatus(isEmpty ? "empty" : "loaded");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadHomeData);
    return unsubscribe;
  }, [navigation]);

  if (status === "error") {
    return (
      <View style={homeStyles.screen}>
        <View style={homeStyles.scrollContent}>
          <Text style={homeStyles.headerTitle}>홈</Text>
          <ErrorState
            title="정보를 불러오지 못했습니다"
            buttonText="다시 시도"
            onPress={loadHomeData}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={homeStyles.screen}>
      <View style={homeStyles.headerArea}>
        <AppHeader title="홈" leftType="none" rightType="none" />
      </View>

      <ScrollView contentContainerStyle={homeStyles.scrollContent}>
        <HomeAssetSection
          summary={homeData.summary}
          recentItems={homeData.recentItems}
          onPressViewAll={() =>
            navigation.navigate("아이템", { screen: "ItemList" })
          }
          onPressItem={(id) => {
            rootNavigation.navigate("ItemDetail", {
              deviceId: id,
              mode: "view",
            });
          }}
        />

        <RegisterPromoCard
          onPress={() => {
            setTimeout(() => {
              rootNavigation.navigate("ItemRegisterModel", {
                folderId: null,
                folderName: "전체 자산",
              });
            }, 300);
          }}
        />

        <WarrantyAlertCard
          item={homeData.warrantyAlert}
          onPressProductLink={() => {
            if (homeData.warrantyAlert?.productLink) {
              console.log(
                "제품 정보 링크 이동:",
                homeData.warrantyAlert.productLink,
              );
            }
          }}
          onPressServiceCenter={() => {
            console.log("가까운 서비스 센터 이동");
          }}
          onPressItem={(id) => {
            rootNavigation.navigate("ItemDetail", {
              deviceId: id,
              mode: "view",
            });
          }}
        />
      </ScrollView>
    </View>
  );
}
