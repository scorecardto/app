import { View, Text } from "react-native";
import React from "react";
import useAccents from "../../core/theme/useAccents";
import { RadialGradient } from "react-native-gradients";

export default function CourseScreenGradient() {
  const accents = useAccents();

  const colorList = [
    { offset: "0%", color: accents.gradientCenter, opacity: "1" },
    { offset: "100%", color: accents.gradientCenter, opacity: "0.5" },
  ];
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <View style={{ height: "100%" }}>
        <RadialGradient
          rx="50%"
          ry="50%"
          x="50%"
          y="0"
          colorList={colorList}
        ></RadialGradient>
      </View>
    </View>
  );
}
