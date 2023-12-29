import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import AssignmentTableRow from "./AssignmentTableRow";

export default function CategoryTable(props: {
  category: GradeCategory;
  setModifiedCategory(g: GradeCategory): void;
}) {
  const [modifiedAssignments, setModifiedAssignments] = useState(
    props.category.assignments
  );

  useEffect(() => {
    // TODO remove the ?.
    props.setModifiedCategory?.({
      ...props.category,
      assignments: modifiedAssignments,
    });
  }, [modifiedAssignments]);

  return (
    <View>
      {props.category?.assignments?.map((assignment, idx) => {
        return (
          <AssignmentTableRow
            key={idx}
            assignment={assignment}
            setModifiedAssignment={(a) => {
              setModifiedAssignments((old) => {
                const newAssignemnts = [...old];
                newAssignemnts[idx] = a;
                return newAssignemnts;
              });
            }}
          />
        );
      })}
    </View>
  );
}
