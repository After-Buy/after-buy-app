import React from "react";
import { Pressable, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";

interface Props {
  onPress: () => void;
}

export default function RegisterPromoCard({ onPress }: Props) {
  return (
    <Pressable style={homeStyles.promoCard} onPress={onPress}>
      <Text style={{ fontSize: 52 }}>🎁</Text>
      <Text style={homeStyles.promoText}>편리하게 전자기기를 등록해보세요</Text>
    </Pressable>
  );
}
