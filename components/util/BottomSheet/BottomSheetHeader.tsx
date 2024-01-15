import { View, Text } from "react-native";
import React from "react";
import MediumText from "../../text/MediumText";
import { useTheme } from "@react-navigation/native";
export default function BottomSheetHeader(props: { children: string }) {
  const { colors } = useTheme();
  return (
    <MediumText
      style={{
        textAlign: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: "100%",
        fontSize: 18,
        color: colors.primary,
      }}
    >
      {props.children}
    </MediumText>
  );
}
