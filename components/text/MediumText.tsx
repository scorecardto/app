import { View, Text, StyleProp } from "react-native";
import React from "react";

export default function MediumText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: "DMSans_500Medium",
        ...props.style,
      }}
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
    >
      {props.children}
    </Text>
  );
}
