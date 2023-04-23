import { MotiView, View } from "moti";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Assignment } from "scorecard-types";
import AssignmentMetaTable from "./AssignmentMetaTable";
import GradeAdjuster from "./GradeAdjuster";

export default function AssignmentInspector(props: {
  assignment?: Assignment;
  setAssignment: (assignment: Assignment) => void;
}) {
  return (
    <MotiView
      style={[styles.wrapper]}
      animate={{
        translateY: props.assignment ? 0 : 300,
      }}
      transition={{
        type: "timing",
        duration: 500,
      }}
    >
      {props.assignment && (
        <View style={styles.content}>
          <Text>Detailed View</Text>
          <Text>{props.assignment?.name}</Text>

          <GradeAdjuster
            assignment={props.assignment}
            setPoints={(points) => {
              props.setAssignment({
                ...props.assignment,
                points,
              });
            }}
          />

          <AssignmentMetaTable assignment={props.assignment} />
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 20,
    position: "absolute",
    height: 300,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ebf5ff",
  },
  content: {
    marginHorizontal: 20,
  },
});
