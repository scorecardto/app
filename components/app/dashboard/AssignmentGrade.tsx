import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackComponent,
  UIManager,
  View,
  ViewComponent,
  findNodeHandle,
} from "react-native";
import { Assignment } from "scorecard-types";
import SolidChip from "./SolidChip";
import GradientChip from "./GradientChip";
import { MotiView } from "moti";

export default function AssignmentGrade(props: {
  assignment: Assignment;
  onHighlight: (highlight: boolean) => void;
  hiddenFromOtherHighlight: boolean;
}) {
  const COUNT_BG = "#EBEBEB";
  const COUNT_TEXT = "#7C7C7C";

  const [highlight, setHighlight] = useState(false);

  const viewRef = React.useRef<ViewComponent>(null);

  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  function handleTempPress() {
    UIManager.measure(
      findNodeHandle(viewRef.current),
      (x, y, width, height, pageX, pageY) => {
        setPlaceholderHeight(height);

        setHighlight(true);
        setTranslateY(Dimensions.get("window").height - pageY - height - 300);
      }
    );
  }

  useEffect(() => {
    props.onHighlight(highlight);
  }, [highlight]);

  return (
    <View style={{ zIndex: highlight ? 20 : 0 }}>
      <TouchableWithoutFeedback onPress={handleTempPress}>
        <View>
          <View style={{ height: placeholderHeight }} />
          <MotiView
            ref={viewRef}
            style={[
              styles.wrapper,
              {
                paddingBottom: highlight ? 30 : 10,
                position: highlight ? "absolute" : "relative",
                zIndex: highlight ? 20 : 0,
                opacity: props.hiddenFromOtherHighlight && !highlight ? 0.5 : 1,
              },
            ]}
            animate={{
              transform: [{ translateY: translateY }],
            }}
            transition={{
              type: "timing",
              duration: 500,
            }}
          >
            <Text style={styles.text}>{props.assignment.name}</Text>
            <View style={styles.meta}>
              <SolidChip
                label={`${props.assignment.count}ct`}
                color={COUNT_BG}
                textColor={COUNT_TEXT}
              />
              {props.assignment.grade ? (
                <GradientChip label={`${props.assignment.grade}`} />
              ) : (
                <GradientChip label="NG" />
              )}
            </View>
          </MotiView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    marginRight: 20,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  meta: {
    flexShrink: 0,
    flexDirection: "row",
    marginRight: -10,
  },
});
