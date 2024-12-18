import {Animated, Platform, StyleSheet, View, TouchableOpacity as iOSTouchableOpacity} from "react-native";
import { TouchableOpacity as AndroidTouchableOpacity } from "react-native-gesture-handler";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import color from "../../../lib/Color";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
import Shimmer from "react-native-shimmer";
import React from "react";
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
  changes: {name: boolean, average: boolean};
}) {
  const colors = useColors();
  const dark = useIsDarkMode();
  const dispatch = useDispatch<AppDispatch>();
  const allCourseSettings = useSelector((s: RootState) => s.courseSettings);
  const courseSettings = allCourseSettings[props.course.key];
  const accentLabel = courseSettings?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      marginHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      overflow: "hidden",
      flexGrow: 18,
    },
    badge: {
      width: 56,
      height: 56,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingLeft: 24,
      color: props.changes?.name ? colors.newGrade : colors.primary,
      flex: 1,
      fontSize: 18,
    },
    grade: {
      fontSize: 16,
      color: props.changes?.average ? colors.newGrade : colors.text,
      textAlign: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    updateIndicator: {
      height: 10,
      width: 10,
      borderRadius: 12,
      marginRight: 24,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
    },
  });

  const courseDisplayName = courseSettings?.displayName || props.course.name;

  const courseGlyph = courseSettings?.glyph || undefined;

  const hasNewGrades = false;

  const TouchableOpacity = Platform.OS === "ios" ? iOSTouchableOpacity : AndroidTouchableOpacity;
  return (
    <TouchableOpacity
      onPress={props.onClick}
      onLongPress={props.onHold}
      style={{
        marginBottom: 10,
      }}
    >
      <View>
        <View style={[styles.wrapper]}>
          <View style={styles.left}>
            <View style={styles.badge}>
              {courseGlyph ? (
                <MaterialCommunityIcons
                  // @ts-ignore

                  name={courseGlyph}
                  size={24}
                  color={"#FFFFFF"}
                />
              ) : (
                <></>
              )}
            </View>
            <MediumText
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.header}
            >
              {courseDisplayName}
            </MediumText>
          </View>
          {hasNewGrades ? (
            <View style={styles.updateIndicator} />
          ) : (
              <>
                <View style={{
                  flex: 1,
                  flexShrink: 0,
                  flexGrow: 2.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  // marginRight: 5,
                }}>
                  <SmallText style={styles.grade}>
                    {props.course.grades[props.gradingPeriod]?.value ?? "NG"}
                  </SmallText>
                </View>
                <View style={{
                  flex: 1,
                  flexShrink: 0,
                  flexGrow: 1,
                  flexDirection: 'row',
                  marginRight: 10,
                }}>
                  {props.course.grades[props.gradingPeriod]?.value && !props.course.grades[props.gradingPeriod]?.active &&
                    <MaterialIcons style={{marginTop: 2}} name="check" size={16} color={colors.text} />}
                </View>
              </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
