import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import BottomSheetBase, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import { Assignment } from "scorecard-types";
import AssignmentEdits from "../../../../lib/types/AssignmentEdits";
import LargeGradebookSheetTile from "./tiles/LargeGradebookSheetTile";
import AssignmentGradeTile from "./tiles/AssignmentGradeTile";
import AssignmentCountTile from "./tiles/AssignmentCountTile";
import SmallGradebookSheetTileGroup from "./tiles/SmallGradebookSheetTileGroup";
import AssignmentDroppedTile from "./tiles/AssignmentDroppedTile";
import MediumText from "../../../text/MediumText";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import AssignmentRemoveTile from "./tiles/AssignmentRemoveTile";
import AssignmentDueDateTile from "./tiles/AssignmentDueDateTile";
import AssignmentAssignDateTile from "./tiles/AssignmentAssignDateTile";
import BottomSheet from "@gorhom/bottom-sheet";
import SmallGradebookSheetTile from "./tiles/SmallGradebookSheetTile";
import SmallText from "../../../text/SmallText";
import {useTheme} from "@react-navigation/native";

export default function AssignmentSheet(props: {
  assignment: Assignment;
  close(): void;
  testing: boolean;
  removeAssignment(): void;
  edit(e: AssignmentEdits): boolean;
  currentEdits: AssignmentEdits;
  gradeChanges?: {
    points: boolean;
    grade: boolean;
    dropped: boolean;
    scale: boolean;
    max: boolean;
    count: boolean;
  };
}) {
  const isNumericGrade =
    props.currentEdits?.pointsEarned != null &&
    props.currentEdits?.pointsPossible != null;

  const note = props.assignment.note?.trim()

  const { colors } = useTheme();
  return (
    <BottomSheetScrollView>
      <BottomSheetHeader>{props.assignment.name!}</BottomSheetHeader>
      <View
        style={{
          padding: 12,
          width: "100%",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <AssignmentGradeTile
            grade={
              isNumericGrade && !isNaN(props.currentEdits.pointsEarned ?? NaN) && !isNaN(props.currentEdits.pointsPossible ?? NaN)
                ? {
                    pointsEarned: props.currentEdits.pointsEarned,
                    pointsPossible: props.currentEdits.pointsPossible,
                  }
                : props.assignment.grade
            }
            changed={props.gradeChanges?.grade ?? false}
            testing={props.testing}
            originalGrade={
              isNumericGrade && !isNaN(props.assignment.points ?? NaN) && !isNaN(props.assignment.scale ?? NaN)
                ? {
                    pointsEarned: props.assignment.points,
                    pointsPossible: props.assignment.scale,
                  }
                : props.assignment.grade
            }
            edit={props.edit}
          />
          <SmallGradebookSheetTileGroup>
            <AssignmentCountTile
              count={props.currentEdits.count ?? props.assignment.count}
              testing={props.testing}
              changed={props.gradeChanges?.count ?? false}
              originalCount={props.assignment.count}
              edit={props.edit}
            />
            {props.testing ? (
              <AssignmentRemoveTile
                removeAssignment={() => {
                  props.removeAssignment();
                  props.close();
                }}
              />
            ) : (
              <AssignmentDroppedTile
                dropped={props.currentEdits.dropped ?? props.assignment.dropped}
                originalDropped={props.assignment.dropped}
                changed={props.gradeChanges?.dropped ?? false}
                edit={props.edit}
              />
            )}
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
        {props.testing ? (
          <></>
        ) : (
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginHorizontal: 8, flex: 1 }}>
              <AssignmentAssignDateTile assignment={props.assignment} />
            </View>
            <View style={{ marginHorizontal: 8, flex: 1 }}>
              <AssignmentDueDateTile assignment={props.assignment} />
            </View>
          </View>
        )}
          {!note ? (
                  <></>
              ) : (
              <View style={{height:'100%', marginHorizontal: 8, flex: 1 }}>
                  <View
                      style={{
                          width: "100%",
                          borderRadius: 8,
                          backgroundColor: colors.backgroundNeutral,
                          flexShrink: 1,
                          flexGrow: 0,
                          marginVertical: 8,
                          paddingVertical: 12,
                          paddingHorizontal: 18,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "left",
                      }}
                  >
                      <SmallText style={{color: colors.primary, paddingBottom: 3}}>Note</SmallText>
                      <SmallText style={{color: colors.text}}>{note}</SmallText>
                  </View>
              </View>
          )}
      </View>
    </BottomSheetScrollView>
  );
}
