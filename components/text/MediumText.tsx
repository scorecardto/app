import { View, Text, StyleProp } from "react-native";
import React from "react";

export default function MediumText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
}) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: "DMSans_500Medium",
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
