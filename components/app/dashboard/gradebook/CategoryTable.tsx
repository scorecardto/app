import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import {Assignment, GradeCategory} from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import AssignmentTableRow from "./AssignmentTableRow";

export default function CategoryTable(props: {
  category: GradeCategory;
  modifiedAssignments: (Assignment|null)[]|null;
  modifyAssignment(a: Assignment, idx: number): void;
  removeAssignment(idx: number): void;
}) {
  return (
    <View>
      {new Array((props.modifiedAssignments ?? props.category.assignments).length).fill(null).map((assignment, idx) => {
        assignment = props.category.assignments[idx] ?? props.modifiedAssignments[idx];

        return (
          <AssignmentTableRow
            testing={idx >= props.category.assignments.length}
            removeAssignment={() => props.removeAssignment(idx)}
            key={idx}
            assignment={assignment}
            setModifiedAssignment={(a) => {
              props.modifyAssignment(a, idx);
            }}
          />
        );
      })}
    </View>
  );
}
