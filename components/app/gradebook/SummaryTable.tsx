import React from "react";
import { Text, View } from "react-native";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";

export default function SummaryTable(props: {
  course: Course;
  modified: { assignments: Assignment[] | null; average: number | null }[];
  changeGradeCategory: (category: number) => void;
}) {
  return (
    <View>
      {props.course.gradeCategories?.map((category, idx) => {
        return (
          <TableRow
            key={idx}
            name={category.name}
            red={{
              grade:
                !!props.modified[idx].assignments ||
                props.modified[idx].average !== null,
            }}
            grade={(props.modified[idx].average ?? category.average) + "%"}
            worth={"Worth " + category.weight.toString() + "%"}
            onPress={() => props.changeGradeCategory(idx)}
          />
        );
      })}
    </View>
  );
}
