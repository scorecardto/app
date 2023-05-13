import { AnimatePresence, MotiView, View } from "moti";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Assignment } from "scorecard-types";
import AssignmentMetaTable from "./AssignmentMetaTable";
import GradeAdjuster from "./GradeAdjuster";

export default function AssignmentInspector(props: {
  assignment?: Assignment;
  setAssignment: (assignment: Assignment) => void;
  close: () => void;
}) {
  return (
    <MotiView
      style={[styles.wrapper]}
      animate={{
        translateY: props.assignment ? 0 : 300,
      }}
      transition={{
        type: "spring",
        damping: 20,
      }}
    >
      <AnimatePresence exitBeforeEnter>
        {props.assignment && (
          <MotiView
            style={styles.content}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
          </MotiView>
        )}
      </AnimatePresence>
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
