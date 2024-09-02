import { View, Text } from "react-native";
import React from "react";
import useAccents from "../../core/theme/useAccents";
import { RadialGradient } from "react-native-gradients";
import Color from "color";
import useColors from "../../core/theme/useColors";
export default function ClubScreenGradient(props: { color: string }) {
  const colors = useColors();
  const color = Color(props.color).mix(Color(colors.background), 0.7).hex();
  const colorList = [
    { offset: "0%", color: color, opacity: "1" },
    { offset: "100%", color: color, opacity: "0.5" },
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
