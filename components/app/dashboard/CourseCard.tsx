import React, { useContext } from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course, DataContext } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import color from "../../../lib/Color";
import LinearGradient from "react-native-linear-gradient";
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
  newGrades?: boolean;
}) {
  const { colors, dark } = useTheme();

  const { courseSettings } = useContext(DataContext);

  const accentLabel =
    courseSettings[props.course.key]?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: "transparent",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 10,
      marginHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      overflow: "hidden",
    },
    badge: {
      width: 56,
      height: 56,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
    },
    header: {
      paddingLeft: 24,
      color: colors.primary,
      flex: 1,
    },
    grade: {
      marginRight: 24,
      marginLeft: 6,
      fontSize: 16,
      color: colors.text,
    },
  });

  const courseDisplayName =
    courseSettings[props.course.key]?.displayName || props.course.name;

  const inner = (
    <>
      <View style={styles.left}>
        <View style={styles.badge}></View>
        <MediumText
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={styles.header}
        >
          {courseDisplayName}
        </MediumText>
      </View>
      <SmallText style={styles.grade}>
        {props.newGrades
          ? "New Grades"
          : props.course.grades[props.gradingPeriod]?.value ?? "NG"}
      </SmallText>
    </>
  );
  return (
    <TouchableOpacity onPress={props.onClick} onLongPress={props.onHold}>
      {props.newGrades ? (
        <LinearGradient
          style={styles.wrapper}
          colors={[
            colors.card,
            color.AccentsMatrix[accentLabel][dark ? "dark" : "default"]
              .gradientCenter,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
          {inner}
        </View>
      )}
    </TouchableOpacity>
  );
}
