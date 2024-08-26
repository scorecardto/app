import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import CourseCornerButton from "../course/CourseCornerButton";
import MediumText from "../../text/MediumText";
export default function ClubPostArrayContainer(props: {
  onPressLeft: () => void;
  onPressRight: () => void;
}) {
  const insets = useSafeAreaInsets();
  const accents = useAccents();
  const colors = useColors();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 24,
        borderBottomColor: "black",
        backgroundColor: colors.background,
      }}
    >
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
          icon={"close"}
          iconPadding={0}
          iconSize={28}
          onPress={() => props.onPressLeft()}
        />
        <TouchableOpacity onPress={() => props.onPressRight()}>
          <View
            style={{
              backgroundColor: colors.button,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 99,
            }}
          >
            <MediumText
              style={{
                color: "#FFFFFF",
                fontSize: 14,
              }}
            >
              Continue
            </MediumText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
