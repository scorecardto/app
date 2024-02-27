import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { Assignment } from "scorecard-types";
import SmallGradebookSheetTile from "./SmallGradebookSheetTile";
import SmallText from "../../../../text/SmallText";
import { useTheme } from "@react-navigation/native";
export default function AssignmentDueDateTile(props: {
  assignment: Assignment;
}) {
  const { colors } = useTheme();

  const due = useMemo(() => {
    const parts = props.assignment.due?.split("-");
    return parts && new Date(
      parseInt(parts[2]),
      parseInt(parts[0]) - 1,
      parseInt(parts[1])
    ).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  }, [props.assignment.assign]);

  return (
    <SmallGradebookSheetTile>
      <SmallText
        style={{
          color: colors.primary,
        }}
      >
        Due
      </SmallText>
      <SmallText
        style={{
          color: colors.text,
        }}
      >
        {due ?? "N/A"}
      </SmallText>
    </SmallGradebookSheetTile>
  );
}
