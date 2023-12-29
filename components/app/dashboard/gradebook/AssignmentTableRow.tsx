import { View, Text } from "react-native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Assignment } from "scorecard-types";
import TableRow from "./TableRow";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import AssignmentSheet from "./sheets/AssignmentSheet";
import AssignmentEdits from "../../../../lib/types/AssignmentEdits";

export default function AssignmentTableRow(props: { assignment: Assignment }) {
  const assignment = props.assignment;
  const sheets = useContext(BottomSheetContext);

  const [grade, setGrade] = useState(assignment.grade);
  const [points, setPoints] = useState(assignment.points);
  const [maxPoints, setMaxPoints] = useState(assignment.max);
  const [count, setCount] = useState(assignment.count);
  const [dropped, setDropped] = useState(assignment.dropped);

  const worth = (details: { count: number; dropped: boolean }) => {
    return details.dropped
      ? "Dropped"
      : details.count.toString() + "pt" + (details.count === 1 ? "" : "s");
  };

  const currentEdits: AssignmentEdits = {
    count: count,
    pointsEarned: points,
    pointsPossible: maxPoints,
    dropped: dropped,
  };
  return (
    <TableRow
      name={assignment.name}
      grade={grade}
      worth={worth({ count, dropped })}
      red={{
        grade: assignment.grade !== grade,
        worth:
          worth({ count, dropped }) !==
          worth({ count: assignment.count, dropped: assignment.dropped }),
      }}
      onPress={() => {
        sheets.addSheet(({ close }) => (
          <>
            <AssignmentSheet
              assignment={assignment}
              close={close}
              currentEdits={currentEdits}
              edit={(edits) => {
                if (
                  edits.pointsEarned != null ||
                  edits.pointsPossible != null
                ) {
                  const rawGrade = edits.pointsEarned / edits.pointsPossible;
                  const rounded = Math.round(rawGrade * 1000) / 10;
                  setGrade(rounded + "%");
                  setPoints(edits.pointsEarned);
                  setMaxPoints(edits.pointsPossible);
                } else if (
                  edits.pointsEarned === null &&
                  edits.pointsPossible === null
                ) {
                  setPoints(assignment.points);
                  setMaxPoints(assignment.max);
                  setGrade(assignment.grade);
                }

                if (edits.count != null) {
                  setCount(edits.count);
                } else if (edits.count === null) {
                  setCount(assignment.count);
                }

                if (edits.dropped === true || edits.dropped === false) {
                  setDropped(edits.dropped);
                } else if (edits.dropped === null) {
                  setDropped(assignment.dropped);
                }
              }}
            />
          </>
        ));
      }}
    />
  );
}
