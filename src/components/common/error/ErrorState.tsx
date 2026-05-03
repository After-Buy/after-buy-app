import React from "react";
import { Pressable, Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyle";

interface Props {
  title: string;
  buttonText: string;
  onPress: () => void;
}

export default function ErrorState({ title, buttonText, onPress }: Props) {
  return (
    <View style={homeStyles.errorWrap}>
      <Text style={homeStyles.errorTitle}>{title}</Text>
      <Pressable style={homeStyles.errorButton} onPress={onPress}>
        <Text style={homeStyles.errorButtonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}
