import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import BottomSheetBase from "@gorhom/bottom-sheet";
import { Assignment } from "scorecard-types";
import { TouchableOpacity } from "react-native-gesture-handler";
import AssignmentEdits from "../../../../../lib/types/AssignmentEdits";
import LargeGradebookSheetTile from "./tiles/LargeGradebookSheetTile";
import AssignmentGradeTile from "./tiles/AssignmentGradeTile";
import AssignmentCountTile from "./tiles/AssignmentCountTile";
import SmallGradebookSheetTileGroup from "./tiles/SmallGradebookSheetTileGroup";
import AssignmentDroppedTile from "./tiles/AssignmentDroppedTile";
import MediumText from "../../../../text/MediumText";

export default function AssignmentSheet(props: {
  assignment: Assignment;
  close(): void;
  edit(e: AssignmentEdits): void;
  currentEdits: AssignmentEdits;
}) {
  const isNumericGrade =
    props.currentEdits?.pointsEarned != null &&
    props.currentEdits?.pointsPossible != null;

  return (
    <View>
      <MediumText
        style={{
          textAlign: "center",
          paddingVertical: 12,
          paddingHorizontal: 24,
          width: "100%",
          fontSize: 18,
        }}
      >
        {props.assignment.name}
      </MediumText>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <AssignmentGradeTile
          grade={
            isNumericGrade
              ? {
                  pointsEarned: props.currentEdits.pointsEarned,
                  pointsPossible: props.currentEdits.pointsPossible,
                }
              : props.assignment.grade
          }
          originalGrade={props.assignment.grade}
          edit={props.edit}
        />
        <SmallGradebookSheetTileGroup>
          <AssignmentCountTile
            count={props.currentEdits.count ?? props.assignment.count}
            originalCount={props.assignment.count}
            edit={props.edit}
          />
          <AssignmentDroppedTile
            dropped={props.currentEdits.dropped ?? props.assignment.dropped}
            originalDropped={props.assignment.dropped}
            edit={props.edit}
          />
        </SmallGradebookSheetTileGroup>
        {/* <View
          style={{
            flexShrink: 1,
            flexGrow: 0,
            flexBasis: "100%",
            width: "100%",
          }}
        >
          <AssignmentCountTile
            count={props.currentEdits.count ?? props.assignment.count}
            originalCount={props.assignment.count}
            edit={props.edit}
          />
          <AssignmentCountTile
            count={props.currentEdits.count ?? props.assignment.count}
            originalCount={props.assignment.count}
            edit={props.edit}
          />
        </View> */}
      </View>
    </View>
  );
}
