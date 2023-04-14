import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Assignment } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";

export default function AssignmentGrade(props: { assignment: Assignment }) {
  const COUNT_BG = "#EBEBEB";
  const COUNT_TEXT = "#7C7C7C";
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{props.assignment.name}</Text>
      <View style={styles.meta}>
        <SolidChip
          label={`${props.assignment.count}ct`}
          color={COUNT_BG}
          textColor={COUNT_TEXT}
        />
        <GradientChip label={`${props.assignment.grade}`} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    marginRight: 20,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  meta: {
    flexShrink: 0,
    flexDirection: "row",
    marginRight: -10,
  },
});
