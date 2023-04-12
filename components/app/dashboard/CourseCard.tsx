import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Course } from "scorecard-types";

export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
}) {
  return (
    <TouchableOpacity onPress={props.onClick}>
      <View style={styles.wrapper}>
        <Text style={styles.header}>{props.course.name}</Text>
        <View style={styles.grade}>
          <Text style={styles.gradeText}>
            {props.course.grades[props.gradingPeriod]?.value ?? "NG"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlignVertical: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
  },
  grade: {
    marginRight: 10,
    width: 50,
    borderRadius: 25,
    backgroundColor: "purple",
    paddingVertical: 8,
  },
  gradeText: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
});
