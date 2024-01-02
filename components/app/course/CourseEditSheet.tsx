import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import CourseColorChanger from "./CourseColorChanger";
import { Course, DataContext } from "scorecard-types";
import { saveCourseSettings } from "../../../lib/saveCourseSettings";

export default function CourseEditSheet(props: { course: Course }) {
  const { colors } = useTheme();

  const dataContext = useContext(DataContext);

  const courseSettings = dataContext.courseSettings[props.course.key] || {};

  const [name, setName] = useState(
    courseSettings.displayName || props.course.name
  );
  return (
    <View>
      <BottomSheetHeader>Course Details</BottomSheetHeader>
      <View
        style={{
          padding: 20,
        }}
      >
        <CourseNameTextInput
          value={name}
          setValue={setName}
          onFinish={() => {
            if (name === "") {
              setName(props.course.name);
              return;
            }

            const newSettings = {
              ...dataContext.courseSettings,
              [props.course.key]: {
                ...courseSettings,
                displayName: name,
              },
            };

            dataContext.setCourseSettings(newSettings);

            saveCourseSettings(newSettings);
          }}
        />
        <CourseColorChanger
          onChange={(accentLabel) => {
            const newSettings = {
              ...dataContext.courseSettings,
              [props.course.key]: {
                ...courseSettings,
                accentColor: accentLabel,
              },
            };

            dataContext.setCourseSettings(newSettings);

            saveCourseSettings(newSettings);
          }}
        />
      </View>
    </View>
  );
}
