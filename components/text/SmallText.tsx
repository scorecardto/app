import { View, Text, StyleProp, TextStyle } from "react-native";
import React from "react";

export default function SmallText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
}) {
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
