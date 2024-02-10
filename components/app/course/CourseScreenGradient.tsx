import { View, Text } from "react-native";
import React from "react";
import useAccents from "../../core/theme/useAccents";
import { RadialGradient } from "react-native-gradients";

export default function CourseScreenGradient() {
  const accents = useAccents();

  const colorList = [
    { offset: "0%", color: accents.gradientCenter, opacity: "1" },
    { offset: "100%", color: accents.gradientCenter, opacity: "0" },
  ];
  return (
    <RadialGradient
      x="50%"
      y="0"
      rx="384"
      ry="288"
      colorList={colorList}
    ></RadialGradient>
  );
}
