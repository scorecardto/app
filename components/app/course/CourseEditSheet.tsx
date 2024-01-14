import { View, Text, Keyboard } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import CourseColorChanger from "./CourseColorChanger";
import { Course, DataContext } from "scorecard-types";
import { saveCourseSettings } from "../../../lib/saveCourseSettings";
import { BottomSheetView } from "@gorhom/bottom-sheet";

export default function CourseEditSheet(props: {
  course: Course;
  setOnClose: (onClose: () => void) => void;
}) {
  const { colors } = useTheme();

  const dataContext = useContext(DataContext);

  const courseSettings = dataContext.courseSettings[props.course.key] || {};

  const [name, setName] = useState(
    courseSettings.displayName || props.course.name
  );

  const saveName = useCallback(
    (n: string) => {
      if (n === "") {
        setName(props.course.name);
        return;
      }

      const newSettings = {
        ...dataContext.courseSettings,
        [props.course.key]: {
          ...courseSettings,
          displayName: n,
        },
      };

      dataContext.setCourseSettings(newSettings);

      saveCourseSettings(newSettings);
    },
    [courseSettings]
  );

  useEffect(() => {
    props.setOnClose(() => () => {
      saveName(name);
    });
  }, [name]);

  useEffect(() => {
    Keyboard.dismiss();
  }, [courseSettings]);
  return (
    <BottomSheetView>
      <BottomSheetHeader>Course Details</BottomSheetHeader>
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 14,
        }}
      >
        <CourseNameTextInput
          value={name}
          setValue={setName}
          onFinish={() => {
            saveName(name);
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
    </BottomSheetView>
  );
}
