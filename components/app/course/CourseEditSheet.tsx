import { Keyboard, ScrollView, Dimensions } from "react-native";
import { useCallback, useEffect, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import { useTheme } from "@react-navigation/native";
import CourseColorChanger from "./CourseColorChanger";
import { Course } from "scorecard-types";
import { setCourseSetting } from "../../../lib/setCourseSetting";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Color from "../../../lib/Color";
import CourseGlyphChanger from "./CourseGlyphChanger";
import CourseHiddenToggle from "./CourseHiddenToggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/state/store";

export default function CourseEditSheet(props: {
  course: Course;
  setOnClose: (onClose: () => void) => void;
}) {
  const { colors } = useTheme();

  const dispatch = useDispatch();

  const allCourseSettings = useSelector(
    (s: RootState) => s.gradeData.courseSettings || {}
  );

  const courseSettings = allCourseSettings[props.course.key] || {};

  const [name, setName] = useState(
    courseSettings.displayName || props.course.name
  );

  const accentColor = courseSettings.accentColor || Color.defaultAccentLabel;

  const glyph = courseSettings.glyph || undefined;

  const saveName = useCallback(
    (n: string) => {
      if (n === "") {
        setName(props.course.name);
        return;
      }

      setCourseSetting(dispatch, allCourseSettings, props.course.key, {
        displayName: n,
      });
    },
    [courseSettings]
  );

  useEffect(() => {
    Keyboard.dismiss();
  }, [courseSettings]);
  return (
    <BottomSheetView>
      <BottomSheetHeader>Course Details</BottomSheetHeader>
      <ScrollView
        style={{
          paddingHorizontal: 20,
          paddingBottom: 14,
          height: Dimensions.get("window").height * 0.65,
        }}
      >
        <CourseNameTextInput
          value={name}
          setValue={(n) => {
            setName(n);
          }}
          onFinish={() => {
            saveName(name);
          }}
        />
        <CourseHiddenToggle
          value={courseSettings.hidden ?? false}
          onChange={(hidden) => {
            setCourseSetting(dispatch, allCourseSettings, props.course.key, {
              hidden,
            });
          }}
        />
        <CourseColorChanger
          value={accentColor}
          onChange={(accentColor) => {
            setCourseSetting(dispatch, allCourseSettings, props.course.key, {
              accentColor,
            });
          }}
        />
        <CourseGlyphChanger
          value={glyph}
          onChange={(newGlyph) => {
            if (glyph == newGlyph) newGlyph = "";

            setCourseSetting(dispatch, allCourseSettings, props.course.key, {
              glyph: newGlyph,
            });
          }}
        />
      </ScrollView>
    </BottomSheetView>
  );
}
