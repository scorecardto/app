import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import useColors from "../../core/theme/useColors";

export default function ClubSocialMediaIcon(props: {
  label: string;
  children: any;
  background?: string;
  onPress?(): void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: props.background,
            height: 64,
            width: 64,
            borderRadius: 64,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 24,
          }}
        >
          {props.children}
        </View>
        <Text
          style={{
            color: colors.text,
            marginTop: 4,
          }}
        >
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
