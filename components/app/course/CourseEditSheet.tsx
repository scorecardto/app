import { View, Text } from "react-native";
import React from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import CourseColorChanger from "./CourseColorChanger";
import { Course } from "scorecard-types";

export default function CourseEditSheet(props: {}) {
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
        <CourseColorChanger />
      </View>
    </View>
  );
}
