import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

export default function AssignmentTileTextInputFrame(props: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.borderNeutral,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: "flex-start",
        borderRadius: 8,
      }}
    >
      {props.children}
    </View>
  );
}
