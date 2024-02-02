import {View, Text, Keyboard, ScrollView, Dimensions} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import CourseNameTextInput from "./CourseNameTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import CourseColorChanger from "./CourseColorChanger";
import { Course, DataContext } from "scorecard-types";
import { setCourseSetting } from "../../../lib/setCourseSetting";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Color from "../../../lib/Color";
import CourseGlyphChanger from "./CourseGlyphChanger";
import CourseHiddenToggle from "./CourseHiddenToggle";

export default function CourseEditSheet(props: {
  course: Course;
  setOnClose: (onClose: () => void) => void;
}) {
  const { colors } = useTheme();

  const dataContext = useContext(DataContext);

  const courseSettings = useMemo(
    () => dataContext.courseSettings[props.course.key] || {},
    [dataContext.courseSettings]
  );

  const [name, setName] = useState(
    courseSettings.displayName || props.course.name
  );

  const accentColor = courseSettings.accentColor || Color.defaultAccentLabel;

  const glyph = courseSettings.glyph || undefined;

  const saveName = useCallback((n: string) => {
      if (n === "") {
        setName(props.course.name);
        return;
      }

      setCourseSetting(dataContext, props.course.key, {displayName: n});
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
            height: Dimensions.get('window').height * 0.75,
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
                setCourseSetting(dataContext, props.course.key, {hidden});
            }}
        />
        <CourseColorChanger
          value={accentColor}
          onChange={(accentColor) => {
              setCourseSetting(dataContext, props.course.key, {accentColor});
          }}
        />
        <CourseGlyphChanger
          value={glyph}
          onChange={(glyph) => {
              setCourseSetting(dataContext, props.course.key, {glyph});
          }}
        />
      </ScrollView>
    </BottomSheetView>
  );
}
