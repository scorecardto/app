import React from "react";
import { Text, View } from "react-native";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";

export default function SummaryTable(props: {
  course: Course;
  categories: GradeCategory[];
  modified: { assignments: (Assignment|null)[] | null; average: string | null }[];
  changeGradeCategory: (category: number) => void;
}) {
  return (
    <View>
      {props.categories.map((category, idx) => {
        const testing = idx >= props.course.gradeCategories!.length;

        const grade = props.modified[idx].average ?? category.average;

        return (
          <TableRow
            key={idx}
            name={category.name}
            red={{
              name: testing,
              grade:
                testing ||
                !!props.modified[idx].assignments ||
                props.modified[idx].average !== null,
            }}
            grade={grade && grade !== "NG" ? grade+"%" : "NG"}
            worth={"Worth " + category.weight.toString() + "%"}
            onPress={() => props.changeGradeCategory(idx)}
          />
        );
      })}
    </View>
  );
}
