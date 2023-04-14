import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";
import AssignmentGrade from "./AssignmentGrade";

export default function GradebookCategory(props: { category: GradeCategory }) {
  const WEIGHT_BG = "#D9EDFF";
  const WEIGHT_TEXT = "#6896CB";
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.text}>{props.category.name}</Text>
        <View style={styles.chips}>
          <SolidChip
            label={`Weight: ${props.category.weight}`}
            color={WEIGHT_BG}
            textColor={WEIGHT_TEXT}
          />
          <GradientChip label={`${props.category.average}%`} />
        </View>
      </View>
      <View>
        {props.category.assignments.map((assignment) => (
          <AssignmentGrade assignment={assignment} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#cce9ff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chips: {
    marginRight: -10,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
  },
});
