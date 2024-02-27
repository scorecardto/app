import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { Assignment } from "scorecard-types";
import SmallGradebookSheetTile from "./SmallGradebookSheetTile";
import SmallText from "../../../../text/SmallText";
import { useTheme } from "@react-navigation/native";
export default function AssignmentAssignDateTile(props: {
  assignment: Assignment;
}) {
  const assign = useMemo(() => {
    const parts = props.assignment.assign?.split("-");
    return parts && new Date(
      parseInt(parts[2]),
      parseInt(parts[0]) - 1,
      parseInt(parts[1])
    ).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  }, [props.assignment.assign]);

  const { colors } = useTheme();
  return (
    <SmallGradebookSheetTile>
      <SmallText
        style={{
          color: colors.primary,
        }}
      >
        Assign
      </SmallText>
      <SmallText
        style={{
          color: colors.text,
        }}
      >
        {assign ?? "N/A"}
      </SmallText>
    </SmallGradebookSheetTile>
  );
}
