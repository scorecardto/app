import { View, Text, StyleProp } from "react-native";
import React from "react";

export default function StatusText(props: {
  children: React.ReactNode;
  style?: StyleProp<any>;
}) {
  return (
    <Text
      style={{
        fontSize: 16,
        ...props.style,
      }}
    >
      {props.children}
    </Text>
  );
}
