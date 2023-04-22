import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";
import AssignmentGrade from "./AssignmentGrade";

export default function GradebookCategory(props: {
  category: GradeCategory;
  onHighlight: (highlight: boolean) => void;
  hiddenFromOtherHighlight: boolean;
}) {
  const HEADER_BG = "#ebf5ff";
  const WEIGHT_BG = "#D9EDFF";
  const WEIGHT_TEXT = "#6896CB";

  const [childHighlighted, setChildHighlighted] = React.useState(false);

  function handleHighlight(highlight: boolean) {
    setChildHighlighted(highlight);

    props.onHighlight(highlight);
  }

  return (
    <View
      style={{
        zIndex: childHighlighted ? 10 : 0,
      }}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: HEADER_BG,
            opacity: props.hiddenFromOtherHighlight ? 0.5 : 1,
          },
        ]}
      >
        <Text style={styles.text}>{props.category.name}</Text>
        <View style={styles.chips}>
          <SolidChip
            label={`Weight: ${props.category.weight}`}
            color={WEIGHT_BG}
            textColor={WEIGHT_TEXT}
          />
          <GradientChip
            label={props.category.average ? `${props.category.average}%` : "NG"}
          />
        </View>
      </View>
      <View>
        {props.category.assignments.map((assignment, idx) => (
          <AssignmentGrade
            assignment={assignment}
            key={idx}
            onHighlight={handleHighlight}
            hiddenFromOtherHighlight={props.hiddenFromOtherHighlight}
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
    zIndex: 0,
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
