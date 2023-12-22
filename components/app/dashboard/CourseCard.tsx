import React from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";

export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
}) {
  // const t = useTheme();
  // const colors = t.colors;
  // console.log(t);

  const styles = StyleSheet.create({
    wrapper: {
      // backgroundColor: colors.background,
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
      width: 64,
      height: 64,
      backgroundColor: "#31A2C5",
    },
    header: {
      paddingLeft: 24,
      // color: colors.primary,
    },
    grade: {
      marginRight: 24,
      fontSize: 20,
      // color: colors.text,
    },
  });

  return (
    <TouchableOpacity onPress={props.onClick}>
      <View
        style={{
          // backgroundColor: colors.background,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 10,
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.left}>
          <View style={styles.badge}></View>
          <MediumText style={styles.header}>{props.course.name}</MediumText>
        </View>
        <SmallText style={styles.grade}>
          {props.course.grades[props.gradingPeriod]?.value ?? "NG"}
        </SmallText>
      </View>
    </TouchableOpacity>
  );
}
