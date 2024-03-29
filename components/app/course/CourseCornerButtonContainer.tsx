import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
export default function CourseCornerButtonContainer(props: {
  onPress: () => void;
  type: "BACK" | "NOTIFICATIONS";
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
          justifyContent: props.type === "BACK" ? "flex-start" : "flex-end",
          alignItems: "center",
        },
      ]}
    >
      <CourseCornerButton
        side={
          props.type === "BACK"
            ? "left"
            : props.type === "NOTIFICATIONS"
            ? "right"
            : "left"
        }
        icon={
          props.type === "BACK"
            ? "chevron-left"
            : props.type === "NOTIFICATIONS"
            ? "notifications"
            : "chevron-left"
        }
        iconPadding={
          props.type === "BACK" ? 8 : props.type === "NOTIFICATIONS" ? 16 : 8
        }
        iconSize={30}
        onPress={() => props.onPress()}
      />
    </View>
  );
}
