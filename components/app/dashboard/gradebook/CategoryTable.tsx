import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import AssignmentTableRow from "./AssignmentTableRow";

export default function CategoryTable(props: { category: GradeCategory }) {
  return (
    <View>
      {props.category?.assignments?.map((assignment, idx) => {
        return <AssignmentTableRow key={idx} assignment={assignment} />;
      })}
    </View>
  );
}
