import { View, Text } from "react-native";
import React from "react";
import MediumText from "../../text/MediumText";

export default function BottomSheetHeader(props: { children: string }) {
  return (
    <MediumText
      style={{
        textAlign: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: "100%",
        fontSize: 18,
      }}
    >
      {props.children}
    </MediumText>
  );
}
