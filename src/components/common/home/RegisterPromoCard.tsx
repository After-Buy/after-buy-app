import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import { homeStyles } from "../../../styles/homeStyle";

interface Props {
  onPress: () => void;
}

export default function RegisterPromoCard({ onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.975,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.timing(translateY, {
        toValue: 2,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 6,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <Animated.View
      style={{
        transform: [{ scale }, { translateY }],
      }}
    >
      <Pressable
        style={homeStyles.promoCard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View style={homeStyles.promoIconWrap}>
          <MaterialCommunityIcons
            name="cube-outline"
            size={24}
            color={colors.white}
          />
        </View>

        <View style={homeStyles.promoTextWrap}>
          <Text style={homeStyles.promoLabel}>빠른 등록</Text>
          <Text style={homeStyles.promoTitle}>
            전자기기를 간편하게 추가해보세요
          </Text>
        </View>

        <View style={homeStyles.promoArrow}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={colors.primaryDark}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}
