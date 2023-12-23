import React from "react";
import { View } from "react-native";
import { Assignment } from "scorecard-types";
import AssignmentMetaTableRow from "./AssignmentMetaTableRow";

export default function AssignmentMetaTable(props: {
  assignment?: Assignment;
}) {
  return (
    <View>
      <AssignmentMetaTableRow left="Due Date" right={props.assignment?.due} />
      <AssignmentMetaTableRow
        left="Assign Date"
        right={props.assignment?.assign}
      />
      <AssignmentMetaTableRow
        left="Dropped"
        right={props.assignment?.dropped ? "Yes" : "No"}
      />
      <AssignmentMetaTableRow
        left="Teacher Notes"
        right={props.assignment?.note?.trim() || "None"}
      />
    </View>
  );
}
