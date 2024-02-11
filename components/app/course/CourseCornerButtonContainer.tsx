import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
export default function CourseCornerButtonContainer(props: {
  onPress: () => void;
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
      <CourseCornerButton
        side="left"
        icon="chevron-left"
        iconSize={30}
        onPress={() => props.onPress()}
      />
    </View>
  );
}
