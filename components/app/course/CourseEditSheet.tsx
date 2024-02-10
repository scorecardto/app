import { Keyboard, ScrollView, Dimensions } from "react-native";
import { useCallback, useEffect, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import CourseColorChanger from "./CourseColorChanger";
import { Course } from "scorecard-types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Color from "../../../lib/Color";
import CourseGlyphChanger from "./CourseGlyphChanger";
import CourseHiddenToggle from "./CourseHiddenToggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { setCourseSetting } from "../../core/state/grades/courseSettingsSlice";
import useColors from "../../core/theme/useColors";

export default function CourseEditSheet(props: {
  course: Course;
  setOnClose: (onClose: () => void) => void;
}) {
  const colors = useColors();

  const dispatch = useDispatch();

  const courseSettings = useSelector(
    (state: RootState) => state.courseSettings[props.course.key],
    () => true
  );

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

      setCourseSetting({
        key: props.course.key,
        value: {
          displayName: n,
        },
        save: "STATE_AND_STORAGE",
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
            dispatch(
              setCourseSetting({
                key: props.course.key,
                value: {
                  hidden,
                },
                save: "STATE_AND_STORAGE",
              })
            );
          }}
        />
        <CourseColorChanger
          initialValue={accentColor}
          onChange={(accentColor) => {
            dispatch(
              setCourseSetting({
                key: props.course.key,
                value: {
                  accentColor,
                },
                save: "STATE_AND_STORAGE",
              })
            );
          }}
        />
        <CourseGlyphChanger
          value={glyph}
          onChange={(newGlyph) => {
            if (glyph == newGlyph) newGlyph = "";

            dispatch(
              setCourseSetting({
                key: props.course.key,
                value: {
                  glyph: newGlyph,
                },
                save: "STATE_AND_STORAGE",
              })
            );
          }}
        />
      </ScrollView>
    </BottomSheetView>
  );
}
