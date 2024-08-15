import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
export default function CourseCornerButtonContainer(props: {
  onPressLeft: () => void;
  onPressRight: () => void;
  hideRight?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const accents = useAccents();
  const colors = useColors();
  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          zIndex: 50,
          paddingTop: 32,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <CourseCornerButton
        side={"left"}
        icon={"chevron-left"}
        iconPadding={0}
        iconSize={36}
        onPress={() => props.onPressLeft()}
      />
      {!props.hideRight && (
        <View>
          <View
            style={{
              backgroundColor: accents.gradientCenter,
              borderRadius: 99,
            }}
          >
            <CourseCornerButton
              side={"right"}
              icon={"edit"}
              iconColor={"#FFFFFF"}
              iconPadding={12}
              iconSize={24}
              onPress={() => props.onPressRight()}
            />
          </View>
        </View>
      )}
    </View>
  );
}
