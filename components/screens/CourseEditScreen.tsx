import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import {Keyboard, ScrollView, Text, TouchableOpacity, View} from "react-native";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import LargeText from "../text/LargeText";
import SmallText from "../text/SmallText";
import Color from "../../lib/Color";
import useAccents from "../core/theme/useAccents";
import CommentsPreview from "../app/course/CommentsPreview";
import CourseAverageDisplay from "../app/course/CourseAverageDisplay";
import GradebookCard from "../app/gradebook/GradebookCard";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { useCallback, useEffect, useState } from "react";
import color from "../../lib/Color";
import { NavigationProp } from "@react-navigation/native";
import CourseGlyphChanger from "../app/course/CourseGlyphChanger";
import CourseColorChanger from "../app/course/CourseColorChanger";
import CourseNameTextInput from "../app/course/CourseNameTextInput";
import { getAnalytics } from "@react-native-firebase/analytics";
import { setCourseSetting } from "../core/state/grades/courseSettingsSlice";
import Toast from "react-native-toast-message";
import {pinCourse, unpinCourse, updateCourseIfPinned} from "../core/state/widget/widgetSlice";
export default function CourseEditScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const { key, defaultName, gradeText } = props.route.params;
  const colors = useColors();

  const dispatch = useDispatch();

  const courseSettings = useSelector(
    (state: RootState) => state.courseSettings[key],
    () => true
  );

  const [name, setName] = useState(courseSettings?.displayName || defaultName);

  const accentColor = courseSettings?.accentColor || Color.defaultAccentLabel;

  const glyph = courseSettings?.glyph || undefined;

  useEffect(() => {
    const timeout = setTimeout(() => {
      // dispatch(
      //   updateCourseIfPinned({
      //     key: props.courseKey,
      //     title: n || props.defaultName,
      //   })
      // );

      dispatch(
        setCourseSetting({
          key: key,
          value: {
            displayName: name,
          },
          save: "STATE_AND_STORAGE",
        })
      );
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [name]);

  useEffect(() => {
    Keyboard.dismiss();
  }, [courseSettings]);

  // useEffect(() => {
  //   props.setOnClose(() => {
  //     saveName(name);
  //   });
  // }, [name]);

    const courseOrder = useSelector((s: RootState) => s.courseOrder.order);
    const pinned = useSelector((s: RootState) => {
        return s.widgetData.data;
    });
    const isPinned = !!pinned?.find?.((c) => c.key === key);
    const disablePinned = !isPinned && pinned.length >= 3;

  return (
    <CourseScreenWrapper courseKey={key}>
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <View
          style={{
            flexShrink: 0,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              // backgroundColor: "red",
              paddingTop: 24,
            }}
          >
            <CourseCornerButtonContainer
              onPressLeft={() => {
                props.navigation.goBack();
              }}
              hideRight
              onPressRight={() => {}}
            />

            <View
              style={{
                paddingHorizontal: 8,
                paddingTop: 4,
              }}
            >
              <LargeText
                style={{
                  color: colors.primary,
                }}
                textProps={{
                  numberOfLines: 1,
                }}
              >
                Edit
              </LargeText>
            </View>
          </View>
        </View>
        <ScrollView
          style={{
            flexGrow: 1,
            padding: 16,
            flex: 1,
          }}
        >
          <View
            style={{
              height: "100%",
              flex: 1,
            }}
          >
            <CourseNameTextInput
              value={name}
              setValue={(n) => {setName(n);}}
              onFinish={() => {
                  dispatch(
                      updateCourseIfPinned({
                          key: key,
                          title: name || defaultName,
                      })
                  );
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
                    key: key,
                    value: {
                      hidden,
                    },
                    save: "STATE_AND_STORAGE",
                  })
                );
              }}
            />

              <SmallText style={{ fontSize: 16, marginBottom: 8, marginTop: 20, color: colors.primary }}>
                  Widget
              </SmallText>
              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={{
                      alignSelf: 'flex-start',
                      opacity: disablePinned ? 0.5 : undefined,
                  }} disabled={disablePinned} onPress={() => {
                      dispatch(
                          isPinned ? unpinCourse(key)
                              : pinCourse({
                                  course: {
                                      key: key,
                                      title: name,
                                      grade: gradeText,
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
                    key: key,
                    value: {
                      accentColor,
                    },
                    save: "STATE_AND_STORAGE",
                  })
                );
                  dispatch(
                      updateCourseIfPinned({
                          key: key,
                          color: Color.AccentsMatrix[accentColor].default.primary,
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
                    key: key,
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
          </View>
        </ScrollView>
      </View>
    </CourseScreenWrapper>
  );
}
