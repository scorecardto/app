import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import useAccents from "../core/theme/useAccents";
import useColors from "../core/theme/useColors";

export default function LargeGradeText(props: {
  grade: string;
  colorType: "SECONDARY" | "PRIMARY";
  // animated?: boolean;
}) {
  // const useAnimatedNumber = props.animated && !isNaN(Number(props.grade));

  const accents = useAccents();
  const colors = useColors();

  const backgroundColor =
    props.colorType === "PRIMARY" ? accents.primary : accents.secondary;
  const textColor = props.colorType === "PRIMARY" ? "#FFFFFF" : colors.text;
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 2,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: textColor,
          fontFamily: "AnekKannada_400Regular",
        }}
      >
        {props.grade}
      </Text>
    </View>
  );
}
