import { View, Text, StyleProp, TextStyle } from "react-native";
import React from "react";

export default function TinyText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
}) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontFamily: "DMSans_300Regular",
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
