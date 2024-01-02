import { View, Text } from "react-native";
import React from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import Color from "../../../lib/Color";
export default function CourseEditSheet(props: {}) {
  const { dark } = useTheme();
  return (
    <View>
      <BottomSheetHeader>Course Details</BottomSheetHeader>
      <View
        style={{
          padding: 20,
        }}
      >
        <CourseNameTextInput
          value="Course Name"
          onFinish={() => {}}
          setValue={() => {}}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {Object.entries(Color.AccentsMatrix).map(
          ([accentLabel, colors], index) => {
            return (
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 8,
                  backgroundColor: colors[dark ? "dark" : "default"].preview,
                }}
              ></View>
            );
          }
        )}
      </View>
    </View>
  );
}
