import { View, Text } from "react-native";
import React, { useRef } from "react";
import BottomSheetBase from "@gorhom/bottom-sheet";
import { Assignment } from "scorecard-types";

export default function GradeSheet(props: {
  assignment: Assignment;
  close(): void;
}) {
  return (
    <View>
      <Text>{props.assignment.name}</Text>
    </View>
  );
}
