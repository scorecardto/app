import { View, Text, StyleProp, TextProps } from "react-native";
import React from "react";

export default function LargeText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
  textProps?: TextProps;
}) {
  return (
    <Text
      style={{
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: "DMSans_700Bold",
        ...props.style,
      }}
      {...props.textProps}
    >
      {props.children}
    </Text>
  );
}
