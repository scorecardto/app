import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function CourseCornerButtonContainer(props: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          zIndex: 50,
          position: "absolute",
          top: insets.top + 12,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      {props.children}
    </View>
  );
}
