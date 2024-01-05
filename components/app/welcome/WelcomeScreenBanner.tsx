import { View, Text } from "react-native";
import React from "react";
import * as Svg from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";

const icon = require("../../../assets/icon.svg");
export default function WelcomeScreenBanner(props: { height: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: props.height,
        width: "100%",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          zIndex: 100,
        }}
      >
        <Image
          source={icon}
          style={{
            height: "40%",
            aspectRatio: 1,
          }}
        />
      </View>
      <Svg.Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Svg.Circle cx="-10" cy="0" r="65" fill={colors.secondary} />
        <Svg.Circle cx="125" cy="0" r="100" fill={colors.secondary} />
      </Svg.Svg>
    </View>
  );
}
