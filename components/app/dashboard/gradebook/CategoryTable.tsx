import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import {Assignment, GradeCategory} from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import AssignmentTableRow from "./AssignmentTableRow";

export default function CategoryTable(props: {
  category: GradeCategory;
  modifyAssignment(a: Assignment, idx: number): void;
}) {
  return (
    <View>
      {props.category?.assignments?.map((assignment, idx) => {
        return (
          <AssignmentTableRow
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
