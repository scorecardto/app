import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";

export default function GradebookCategory(props: { category: GradeCategory }) {
  return (
    <View>
      <View style={styles.wrapper}>
        <Text style={styles.text}>{props.category.name}</Text>
        <View style={styles.chips}>
          <SolidChip label={`Weight: ${props.category.weight}`} />
          <GradientChip label={`${props.category.average}%`} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
  wrapper: {
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
