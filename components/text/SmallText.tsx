import { View, Text } from "react-native";
import React from "react";

export default function SmallText(props) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontFamily: "DMSans_400Regular",
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
