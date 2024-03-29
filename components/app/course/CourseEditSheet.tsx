import { Keyboard, ScrollView, Dimensions, View } from "react-native";
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
import Toast from "react-native-toast-message";
import { getAnalytics } from "@react-native-firebase/analytics";
import { registerNotifs } from "../../../lib/backgroundNotifications";
import Button from "../../input/Button";
// import {
//   pinCourse,
//   updateCourseIfPinned,
//   unpinCourse,
// } from "../../core/state/widget/widgetSlice";

export default function CourseEditSheet(props: {
  courseKey: string;
  gradeText: string;
  defaultName: string;
  setOnClose: (onClose: () => void) => void;
}) {
  const colors = useColors();

  const dispatch = useDispatch();

  const courseSettings = useSelector(
    (state: RootState) => state.courseSettings[props.courseKey],
    () => true
  );

  const [name, setName] = useState(
    courseSettings?.displayName || props.defaultName
  );

  const notificationSettings = useSelector((s: RootState) => {
    return s.notificationSettings[props.courseKey];
  });

  const accentColor = courseSettings?.accentColor || Color.defaultAccentLabel;

  const glyph = courseSettings?.glyph || undefined;

  const saveName = useCallback(
    (n: string) => {
      if (
        notificationSettings === "ON_ALWAYS" ||
        notificationSettings === "ON_ONCE"
      ) {
        registerNotifs(
          props.courseKey,
          n || props.defaultName,
          notificationSettings === "ON_ONCE"
        );
      }

      // dispatch(
      //   updateCourseIfPinned({
      //     key: props.courseKey,
      //     title: n || props.defaultName,
      //   })
      // );

      getAnalytics().logEvent("use_customize", {
        type: "rename",
      });

      if (n === "") {
        setName(props.defaultName);
        return;
      }

      dispatch(
        setCourseSetting({
          key: props.courseKey,
          value: {
            displayName: n,
          },
          save: "STATE_AND_STORAGE",
        })
      );
    },
    [courseSettings]
  );

  useEffect(() => {
    Keyboard.dismiss();
  }, [courseSettings]);

  useEffect(() => {
    props.setOnClose(() => {
      saveName(name);
    });
  }, [name]);

  const pinned = useSelector((s: RootState) => {
    return s.widgetData.data;
  });
  const isPinned = !!pinned?.find?.((c) => c.key === props.courseKey);

  return (
    <>
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
            hidden={!!courseSettings?.hidden}
            onToggleHidden={(hidden) => {
              if (hidden && !courseSettings?.hidden) {
                Toast.show({
                  type: "info",
                  text1: "Course Hidden",
                  text2:
                    "You can unhide it in Archive or by tapping the eye icon.",
                });
              }
              dispatch(
                setCourseSetting({
                  key: props.courseKey,
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
                  key: props.courseKey,
                  value: {
                    accentColor,
                  },
                  save: "STATE_AND_STORAGE",
                })
              );
              // dispatch(
              //   updateCourseIfPinned({
              //     key: props.courseKey,
              //     color: Color.AccentsMatrix[accentColor].default.primary,
              //   })
              // );
              getAnalytics().logEvent("use_customize", {
                type: "color",
                color: accentColor,
              });
            }}
          />

          <CourseGlyphChanger
            value={glyph}
            onChange={(newGlyph) => {
              dispatch(
                setCourseSetting({
                  key: props.courseKey,
                  value: {
                    glyph: newGlyph,
                  },
                  save: "STATE_AND_STORAGE",
                })
              );
              getAnalytics().logEvent("use_customize", {
                type: "glyph",
                glyph: newGlyph,
              });
            }}
          />
        </ScrollView>
      </BottomSheetView>
    </>
  );
}
