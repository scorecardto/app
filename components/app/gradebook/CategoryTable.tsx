import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { Assignment, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import AssignmentTableRow from "./AssignmentTableRow";

export default function CategoryTable(props: {
  category: GradeCategory;
  modifiedAssignments: (Assignment | null)[] | null;
  modifyAssignment(a: Assignment, index: number): void;
  removeAssignment(index: number): void;
}) {
  return (
    <ScrollView
      style={{ maxHeight: Dimensions.get("window").height - 437 }}
      alwaysBounceVertical={false}
    >
      {new Array(
        (props.modifiedAssignments ?? props.category.assignments!).length
      )
        .fill(null)
        .map((_, index) => {
          const assignment =
            props.category.assignments![index] ??
            props.modifiedAssignments[index];

          return (
            <AssignmentTableRow
              testing={index >= props.category.assignments.length}
              removeAssignment={() => props.removeAssignment(index)}
              key={index}
              assignment={assignment}
              setModifiedAssignment={(a) => {
                props.modifyAssignment(a, index);
              }}
            />
          );
        })}
    </ScrollView>
  );
}
