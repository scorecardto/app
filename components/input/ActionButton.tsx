import { View, Text, TouchableHighlight } from "react-native";
import React from "react";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

export default function ActionButton(props: {
  type: "BLACK" | "WHITE" | "DISABLED";
  children: string;
  onPress?: () => void;
}) {
  const backgroundColor =
    props.type === "BLACK"
      ? "#2B2426"
      : props.type === "WHITE"
      ? "white"
      : "#EFEFEF";

  const color =
    props.type === "BLACK"
      ? "white"
      : props.type === "WHITE"
      ? "black"
      : "#B3B3B3";

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.type === "DISABLED"}
    >
      <View
        style={{
          backgroundColor: backgroundColor,
          paddingVertical: 12,
          paddingHorizontal: 64,
          borderRadius: 100,
          alignSelf: "flex-end",
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: color,
          }}
        >
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
