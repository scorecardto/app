import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import CourseCornerButton from "../course/CourseCornerButton";
import MediumText from "../../text/MediumText";
export default function ClubViewArrayContainer(props: {
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
        <View
          style={{
            width: 44,
          }}
        >
          <CourseCornerButton
            side={"left"}
            icon={"chevron-left"}
            iconPadding={0}
            iconSize={28}
            onPress={() => props.onPressLeft()}
          />
        </View>
        <View style={{}}>
          <MediumText
            style={{
              fontSize: 16,
              color: colors.primary,
            }}
          >
            CODE
          </MediumText>
        </View>
        <View
          style={{
            width: 44,
          }}
        ></View>
      </View>
    </View>
  );
}
