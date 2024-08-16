import {Keyboard, ScrollView, Dimensions, View, TouchableOpacity, Text} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  pinCourse,
  updateCourseIfPinned,
  unpinCourse,
} from "../../core/state/widget/widgetSlice";
import SmallText from "../../text/SmallText";

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

      dispatch(
        updateCourseIfPinned({
          key: props.courseKey,
          title: n || props.defaultName,
        })
      );

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

  const courseOrder = useSelector((s: RootState) => s.courseOrder.order);
  const pinned = useSelector((s: RootState) => {
return s.widgetData.data;
  });
  const isPinned = !!pinned?.find?.((c) => c.key === props.courseKey);

  const disablePinned = !isPinned && pinned.length >= 3;

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
            <SmallText style={{ fontSize: 16, marginBottom: 8, color: colors.primary }}>
                Widget
            </SmallText>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{
                    alignSelf: 'flex-start',
                    opacity: disablePinned ? 0.5 : undefined,
                }} disabled={disablePinned} onPress={() => {
                    dispatch(
                        isPinned ? unpinCourse(props.courseKey)
                            : pinCourse({
                                course: {
                                    key: props.courseKey,
                                    title: name,
                                    grade: props.gradeText,
                                    color: Color.AccentsMatrix[accentColor].default.primary,
                                },
                                order: courseOrder,
                            })
                    );
                }}>
                    <View style={{
                        backgroundColor: colors.button,
                        borderColor: "rgba(0,0,0,0.2)",
                        borderWidth: 1,
                        borderBottomWidth: 2,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            color: "#FFF",
                            fontSize: 14,
                            paddingVertical: 9,
                            paddingHorizontal: 26,
                            textAlign: 'center',
                        }}>
                            {isPinned ? "Unpin" : "Pin"}
                        </Text>
                    </View>
                </TouchableOpacity>
                {disablePinned && <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 12, marginLeft: 5 }}>
                        Max pins reached
                    </Text>
                </View>}
            </View>
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
              dispatch(
                updateCourseIfPinned({
                  key: props.courseKey,
                  color: Color.AccentsMatrix[accentColor].default.primary,
                })
              );
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
