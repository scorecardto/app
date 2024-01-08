import { View, Text } from "react-native";
import React from "react";

export default function LargeGradeText(props: {
  grade: string;
  backgroundColor: string;
  textColor: string;
}) {
  return (
    <View
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 2,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: props.textColor,
          fontFamily: "AnekKannada_400Regular",
        }}
      >
        {props.grade}
      </Text>
    </View>
  );
}
