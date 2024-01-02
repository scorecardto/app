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
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
}) {
  const { colors, dark } = useTheme();

  const { courseSettings } = useContext(DataContext);

  const accentLabel =
    courseSettings[props.course.key]?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
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
    },
    grade: {
      marginRight: 24,
      fontSize: 16,
      color: colors.text,
    },
  });

  const courseDisplayName =
    courseSettings[props.course.key]?.displayName || props.course.name;

  return (
    <TouchableOpacity onPress={props.onClick} onLongPress={props.onHold}>
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View style={styles.badge}></View>
          <MediumText style={styles.header}>{courseDisplayName}</MediumText>
        </View>
        <SmallText style={styles.grade}>
          {props.course.grades[props.gradingPeriod]?.value ?? "NG"}
        </SmallText>
      </View>
    </TouchableOpacity>
  );
}
