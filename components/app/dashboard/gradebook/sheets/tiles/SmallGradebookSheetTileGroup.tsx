import { View, Text } from "react-native";
import React from "react";

export default function SmallGradebookSheetTileGroup(props: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <View
      style={{
        flexShrink: 1,
        flexGrow: 0,
        flexBasis: "100%",
        width: "100%",
        display: "flex",
        marginHorizontal: 8,
      }}
    >
      {props.children}
    </View>
  );
}
