import React, { useContext, useEffect, useState } from "react";
import { Assignment } from "scorecard-types";
import TableRow from "./TableRow";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import AssignmentSheet from "./sheets/AssignmentSheet";
import AssignmentEdits from "../../../lib/types/AssignmentEdits";
import { getAnalytics } from "@react-native-firebase/analytics";
import {useSelector} from "react-redux";
import {RootState} from "../../core/state/store";

export default function AssignmentTableRow(props: {
  assignment: Assignment;
  testing: boolean;
  removeAssignment(): void;
  setModifiedAssignment(a: Assignment): void;
    gradeChanges?: {
        grade: boolean;
        dropped: boolean;
        count: boolean;
        name: boolean;
    };
}) {
  const assignment = props.assignment;
  const sheets = useContext(BottomSheetContext);

  const [grade, setGrade] = useState(assignment.grade);
  const [points, setPoints] = useState(assignment.points);
  const [maxPoints, setMaxPoints] = useState(assignment.scale);
  const [count, setCount] = useState(assignment.count);
  const [dropped, setDropped] = useState(assignment.dropped);

  useEffect(() => {
    if (
      props.testing ||
      grade !== assignment.grade ||
      points?.toString() !== assignment.points?.toString() ||
      maxPoints !== assignment.scale ||
      count !== assignment.count ||
      dropped !== assignment.dropped
    ) {
      props.setModifiedAssignment({
        ...assignment,
        grade,
        points,
        scale: maxPoints,
        count,
        dropped,
      });
    } else {
      props.setModifiedAssignment(null);
    }
  }, [grade, points, maxPoints, count, dropped]);

  const worth = (details: { count: number; dropped: boolean }) => {
    return details.dropped
      ? "Dropped"
      : details.count.toString() + "pt" + (details.count === 1 ? "" : "s");
  };

  let currentEdits: AssignmentEdits = {
    count: count,
    pointsEarned: points,
    pointsPossible: maxPoints,
    dropped: dropped,
  };

  return (
    <TableRow
      name={assignment.name!}
      grade={grade!}
      worth={worth({ count, dropped })}
      changes={{
          name: props.gradeChanges?.name ?? false,
          average: props.gradeChanges?.grade ?? false,
          weight: (props.gradeChanges?.count || props.gradeChanges?.dropped) ?? false
      }}
      red={{
        name: props.testing,
        grade: props.testing || assignment.grade !== grade,
        worth:
          props.testing ||
          worth({ count, dropped }) !==
            worth({ count: assignment.count, dropped: assignment.dropped }),
      }}
      onPress={() => {
        getAnalytics().logEvent("open_assignment_sheet");
        sheets.addSheet(({ close }) => (
          <>
            <AssignmentSheet
              assignment={assignment}
              gradeChanges={props.gradeChanges}
              testing={props.testing}
              close={close}
              currentEdits={currentEdits}
              removeAssignment={props.removeAssignment}
              edit={(edits) => {
                edits = { ...currentEdits, ...edits };
                // returns whether the assignment was modified
                let ret = false;
                if (
                  edits.pointsEarned != null ||
                  edits.pointsPossible != null
                ) {
                  const rawGrade = edits.pointsEarned / edits.pointsPossible;
                  const rounded = Math.round(rawGrade * 1000) / 10;
                  const grade = rounded + "%";
                  setGrade(grade);
                  setPoints(
                    grade === assignment.grade
                      ? assignment.points
                      : edits.pointsEarned
                  );
                  setMaxPoints(
                    grade === assignment.grade
                      ? assignment.scale
                      : edits.pointsPossible
                  );

                  ret = ret || grade !== assignment.grade;
                } else {
                  setGrade(assignment.grade);
                  setPoints(assignment.points);
                  setMaxPoints(assignment.scale);
                }

                if (edits.count != null) {
                  setCount(edits.count);
                  ret = ret || edits.count !== assignment.count;
                } else {
                  setCount(assignment.count);
                }

                if (edits.dropped === true || edits.dropped === false) {
                  setDropped(edits.dropped);
                  ret = ret || edits.dropped !== assignment.dropped;
                } else {
                  setDropped(assignment.dropped);
                }

                currentEdits = edits;

                return ret;
              }}
            />
          </>
        ));
      }}
    />
  );
}
