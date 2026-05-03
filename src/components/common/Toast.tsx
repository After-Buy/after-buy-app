import React, { useEffect, useState } from "react";
import { Animated, Text } from "react-native";

export default function Toast({ visible, message }: any) {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        backgroundColor: "rgba(0,0,0,0.75)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignSelf: "center",
        opacity,
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontSize: 14,
          fontWeight: "500",
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
