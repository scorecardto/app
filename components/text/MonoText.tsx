import { View, Text, StyleProp } from "react-native";
import React from "react";

export default function MonoText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
}) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: "IBMPlexMono_400Regular",
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
