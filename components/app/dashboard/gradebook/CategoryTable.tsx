import React from "react";
import { Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";

export default function CategoryTable(props: { category: GradeCategory }) {
  return (
    <View>
      {props.category.assignments.map((assignment, idx) => {
        return (
          <TableRow
            key={idx}
            name={assignment.name}
            grade={assignment.grade}
            worth={
              "worth " +
              assignment.count.toString() +
              "pt" +
              (assignment.count === 1 ? "" : "s")
            }
          />
        );
      })}
    </View>
  );
}
