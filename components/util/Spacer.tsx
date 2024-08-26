import { View, Text } from "react-native";
import React from "react";

export default function Spacer(props: { h: number }) {
  return (
    <View
      style={{
        height: props.h,
      }}
    ></View>
  );
}
