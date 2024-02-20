import React from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";

export default function SummaryTable(props: {
  course: Course;
  categories: GradeCategory[];
  modified: {
    assignments: (Assignment | null)[] | null;
    average: string | null;
  }[];
  changeGradeCategory: (category: number) => void;
}) {
  return (
    <ScrollView
      style={{ maxHeight: Dimensions.get("window").height - 367 }}
      alwaysBounceVertical={false}
    >
      {props.categories.map((item, index) => {
        const testing = index >= props.course.gradeCategories!.length;
        const grade = props.modified[index].average ?? item.average;

        return (
          <TableRow
            key={index}
            name={item.name}
            red={{
              name: testing,
              grade:
                testing ||
                !!props.modified[index].assignments ||
                props.modified[index].average !== null,
            }}
            grade={grade && grade !== "NG" ? grade + "%" : "NG"}
            worth={"Worth " + item.weight.toString() + "%"}
            onPress={() => props.changeGradeCategory(index)}
          />
        );
      })}
    </ScrollView>
  );
}
