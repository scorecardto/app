import { View, Text } from "react-native";
import React from "react";

export default function MediumText(props) {
  return (
    <Text
      style={{
        fontSize: 20,
        fontFamily: "DMSans_500Medium",
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
