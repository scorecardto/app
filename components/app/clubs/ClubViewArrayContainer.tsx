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
  code?: string;
}) {
  const insets = useSafeAreaInsets();
  const accents = useAccents();
  const colors = useColors();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 24,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
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
        {/* <View style={{}}>
          <MediumText
            style={{
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {props.code || "Loading..."}
          </MediumText>
        </View>
        <View
          style={{
            width: 44,
          }}
        ></View> */}
      </View>
    </View>
  );
}
