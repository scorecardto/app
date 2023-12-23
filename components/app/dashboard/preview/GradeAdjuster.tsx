import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Assignment } from "scorecard-types";

export default function GradeAdjuster(props: {
  assignment?: Assignment;
  setPoints: (points: number) => void;
}) {
  const pointsRatioString = useMemo(() => {
    if (props.assignment?.points != null && props.assignment?.max != null) {
      return `${props.assignment?.points}/${props.assignment?.max}`;
    } else {
      return "";
    }
  }, [props.assignment?.points, props.assignment?.max]);

  return (
    <View>
      {pointsRatioString && (
        <View style={styles.wrapper}>
          <Text style={styles.label}>Adjust This Grade</Text>
          <View style={styles.inner}>
            <View style={styles.pointsRatioWrapper}>
              <Text style={styles.pointsRatioText}>{pointsRatioString}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={0}
              value={props.assignment?.points}
              step={1}
              onValueChange={props.setPoints}
              maximumValue={props.assignment.max}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "#555",
    marginVertical: 5,
    marginHorizontal: 5,
  },
  wrapper: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "flex",
    width: "100%",
    overflow: "hidden",
  },
  pointsRatioWrapper: {
    marginRight: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  pointsRatioText: {
    fontSize: 15,
    width: "fit-content",
    fontVariant: ["tabular-nums"],
  },
  slider: {
    flexShrink: 1,
    width: "100%",
  },
});
