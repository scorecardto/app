import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Assignment, GradeCategory } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";
import AssignmentGrade from "./AssignmentGrade";
import { MotiView } from "moti";

export default function GradebookCategory(props: {
  category: GradeCategory;
  setHighlight: (highlight: Assignment, assignmentIndex: number) => void;
  inHighlightView: boolean;
}) {
  const HEADER_BG = "#ebf5ff";
  const WEIGHT_BG = "#D9EDFF";
  const WEIGHT_TEXT = "#6896CB";

  const [childHighlighted, setChildHighlighted] = React.useState(false);

  function handleHighlight(highlight: Assignment, assignmentIndex: number) {
    setChildHighlighted(highlight !== undefined);

    if (highlight) {
      props.setHighlight(highlight, assignmentIndex);
    }

    if (!highlight) {
      props.setHighlight(undefined, assignmentIndex);
    }
  }

  useEffect(() => {
    if (!props.inHighlightView) {
      setChildHighlighted(false);
    }
  }, [props.inHighlightView]);

  const [changeZIndex, setChangeZIndex] = useState(false);

  useEffect(() => {
    if (childHighlighted) {
      setChangeZIndex(true);
    } else {
      setTimeout(() => {
        setChangeZIndex(false);
      }, 400);
    }
  }, [childHighlighted]);

  const showOverlay = props.inHighlightView && !childHighlighted;
  return (
    <View
      style={{
        zIndex: changeZIndex ? 15 : 0,
        position: "relative",
      }}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: HEADER_BG,
          },
        ]}
      >
        <MotiView
          pointerEvents={props.inHighlightView ? "auto" : "none"}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            zIndex: props.inHighlightView ? 10 : 0,
          }}
          animate={{
            opacity: props.inHighlightView ? 0.5 : 0,
          }}
          transition={{
            type: "timing",
            duration: props.inHighlightView ? 200 : 0,
          }}
        />
        <View style={styles.headerContent}>
          <Text style={styles.text}>{props.category.name}</Text>
          <View style={styles.chips}>
            <SolidChip
              label={`Weight: ${props.category.weight}`}
              color={WEIGHT_BG}
              textColor={WEIGHT_TEXT}
            />
            <GradientChip
              label={
                props.category.average ? `${props.category.average}%` : "NG"
              }
            />
          </View>
        </View>
      </View>
      <View style={{ zIndex: changeZIndex ? 15 : 0 }}>
        {props.category.assignments.map((assignment, idx) => (
          <AssignmentGrade
            showOverlay={props.inHighlightView}
            assignment={assignment}
            key={idx}
            inHighlightView={childHighlighted}
            setHighlight={(highlight) => handleHighlight(highlight, idx)}
          />
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
    position: "relative",
    zIndex: 0,
  },
  headerContent: {
    flexDirection: "row",
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
