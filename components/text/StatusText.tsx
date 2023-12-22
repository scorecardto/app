import { View, Text } from "react-native";
import React from "react";

export default function StatusText(props) {
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
