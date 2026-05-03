import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

type Props = {
  frameWidth: number;
  frameHeight: number;
  borderRadius?: number;
  overlayOpacity?: number;
  frameTopRatio?: number;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CutoutOverlay({
  frameWidth,
  frameHeight,
  borderRadius = 18,
  overlayOpacity = 0.55,
  frameTopRatio = 0.28,
}: Props) {
  const overlayHeight = SCREEN_HEIGHT;

  const frameX = (SCREEN_WIDTH - frameWidth) / 2;
  const frameY = overlayHeight * frameTopRatio;

  const safeFrameY = Math.max(16, frameY);
  const safeFrameBottom = safeFrameY + frameHeight;

  const adjustedFrameY =
    safeFrameBottom > SCREEN_HEIGHT - 24
      ? SCREEN_HEIGHT - 24 - frameHeight
      : safeFrameY;

  const outerPath = `M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`;

  const innerRoundedRectPath = [
    `M${frameX + borderRadius} ${adjustedFrameY}`,
    `H${frameX + frameWidth - borderRadius}`,
    `Q${frameX + frameWidth} ${adjustedFrameY} ${frameX + frameWidth} ${adjustedFrameY + borderRadius}`,
    `V${adjustedFrameY + frameHeight - borderRadius}`,
    `Q${frameX + frameWidth} ${adjustedFrameY + frameHeight} ${frameX + frameWidth - borderRadius} ${adjustedFrameY + frameHeight}`,
    `H${frameX + borderRadius}`,
    `Q${frameX} ${adjustedFrameY + frameHeight} ${frameX} ${adjustedFrameY + frameHeight - borderRadius}`,
    `V${adjustedFrameY + borderRadius}`,
    `Q${frameX} ${adjustedFrameY} ${frameX + borderRadius} ${adjustedFrameY}`,
    `Z`,
  ].join(" ");

  const cutoutPath = `${outerPath} ${innerRoundedRectPath}`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Path
          d={cutoutPath}
          fill={`rgba(0,0,0,${overlayOpacity})`}
          fillRule="evenodd"
        />

        <Rect
          x={frameX}
          y={adjustedFrameY}
          width={frameWidth}
          height={frameHeight}
          rx={borderRadius}
          ry={borderRadius}
          fill="transparent"
          stroke="white"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
