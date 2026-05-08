import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../components/common/AppHeader";
import ErrorState from "../../components/common/error/ErrorState";
import HomeAssetSection from "../../components/common/home/HomeAssetSection";
import RegisterPromoCard from "../../components/common/home/RegisterPromoCard";
import WarrantyAlertCard from "../../components/common/home/WarrantyAlertCard";
import { deviceService } from "../../services/database/deviceService";
import { homeStyles } from "../../styles/homeStyle";
import { modalStyles } from "../../styles/modalStyle";
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
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadHomeData();
    } finally {
      setRefreshing(false);
    }
  };

  const openNotice = (title: string, message: string) => {
    setNoticeTitle(title);
    setNoticeMessage(message);
    setNoticeVisible(true);
  };

  const closeNotice = () => {
    setNoticeVisible(false);
  };

  const loadHomeData = async () => {
    try {
      const data = await deviceService.getHomeData();

      console.log("[HOME DATA]", data);
      console.log("[HOME WARRANTY ALERT AFTER LOAD]", data.warrantyAlert);

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

  const handlePressWarrantyServiceCenter = async () => {
    try {
      const item = homeData.warrantyAlert;

      if (!item?.id) {
        openNotice("안내", "서비스 센터를 검색할 제품 정보가 없습니다.");
        return;
      }

      const detail = await deviceService.getDeviceById(item.id);

      const brand = detail?.brand?.trim();

      if (!brand) {
        openNotice(
          "안내",
          "브랜드 정보가 없어 서비스 센터를 검색할 수 없습니다.",
        );
        return;
      }

      rootNavigation.navigate("ServiceCenterMap", {
        brand,
        productName: detail?.product_name ?? item.name,
      });
    } catch (error) {
      console.log("[HOME_SERVICE_CENTER_ERROR]", error);
      openNotice("안내", "서비스 센터 정보를 불러오지 못했습니다.");
    }
  };

  const handleCopyProductLink = async () => {
    console.log("[HOME WARRANTY ALERT]", homeData.warrantyAlert);

    const link = homeData.warrantyAlert?.productLink?.trim();

    if (!link) {
      openNotice("안내", "복사할 제품 정보 링크가 없습니다.");
      return;
    }

    await Clipboard.setStringAsync(link);
    openNotice("완료", "제품 정보 링크가 복사되었습니다.");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (hasLoadedRef.current) return;

      hasLoadedRef.current = true;
      loadHomeData();
    });

    return unsubscribe;
  }, [navigation]);

  if (status === "error") {
    return (
      <View style={homeStyles.screen}>
        <View style={homeStyles.headerArea}>
          <AppHeader title="홈" leftType="none" rightType="none" />
        </View>

        <View style={homeStyles.errorWrap}>
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

      <ScrollView
        contentContainerStyle={homeStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          onPressProductLink={handleCopyProductLink}
          onPressServiceCenter={handlePressWarrantyServiceCenter}
          onPressItem={(id) => {
            rootNavigation.navigate("ItemDetail", {
              deviceId: id,
              mode: "view",
            });
          }}
        />
      </ScrollView>
      <Modal visible={noticeVisible} transparent animationType="fade">
        <View style={modalStyles.confirmOverlay}>
          <View style={modalStyles.confirmBox}>
            <Text style={modalStyles.confirmTitle}>{noticeTitle}</Text>

            <Text style={modalStyles.confirmText}>{noticeMessage}</Text>

            <View style={modalStyles.confirmButtons}>
              <TouchableOpacity
                style={[
                  modalStyles.confirmButton,
                  modalStyles.confirmConfirmButton,
                ]}
                onPress={closeNotice}
              >
                <Text style={modalStyles.confirmConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
