import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function BottomSheetBackdrop({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.3],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "#000",
        zIndex: 90,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
}
