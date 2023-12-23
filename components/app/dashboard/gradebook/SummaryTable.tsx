import React from "react";
import { Text, View } from "react-native";
import { Course, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";

export default function SummaryTable(props: {
  course: Course;
  changeGradeCategory: (category: number) => void;
}) {
  return (
    <View>
      {props.course.gradeCategories.map((category, idx) => {
        return (
          <TableRow
            key={idx}
            name={category.name}
            grade={category.average + "%"}
            worth={"Worth " + category.weight.toString() + "%"}
            onPress={() => props.changeGradeCategory(idx)}
          />
        );
      })}
    </View>
  );
}
