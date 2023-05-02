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
import * as Haptics from "expo-haptics";

export default function AssignmentGrade(props: {
  assignment: Assignment;
  setHighlight: (highlight: Assignment) => void;
  inHighlightView: boolean;
  showOverlay: boolean;
}) {
  const COUNT_BG = "#EBEBEB";
  const COUNT_TEXT = "#7C7C7C";

  const [highlight, setHighlight] = useState(false);

  const viewRef = React.useRef<ViewComponent>(null);

  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
    if (!highlight) {
      setPlaceholderHeight(0);
      setTranslateY(0);
      props.setHighlight(undefined);
    } else {
      props.setHighlight(props.assignment);
    }
  }, [highlight]);

  useEffect(() => {
    if (!props.inHighlightView) {
      setHighlight(false);
    }
  }, [props.inHighlightView]);

  const [changeZIndex, setChangeZIndex] = useState(false);

  useEffect(() => {
    if (highlight) {
      setChangeZIndex(true);
    } else {
      setTimeout(() => {
        setChangeZIndex(false);
      }, 400);
    }
  }, [highlight]);

  return (
    <View style={{ zIndex: changeZIndex ? 20 : 0, position: "relative" }}>
      <TouchableWithoutFeedback
        onPress={handlePress}
        style={{ zIndex: changeZIndex ? 20 : 0 }}
      >
        <View style={{ zIndex: changeZIndex ? 20 : 0 }}>
          <View
            style={{ height: placeholderHeight, zIndex: changeZIndex ? 20 : 0 }}
          />
          <MotiView
            ref={viewRef}
            style={[
              styles.wrapper,
              {
                paddingBottom: highlight ? 30 : 10,
                position: highlight ? "absolute" : "relative",
                // opacity: props.inHighlightView && !highlight ? 0.5 : 1,
                zIndex: changeZIndex ? 20 : 0,
              },
            ]}
            animate={{
              transform: [{ translateY: translateY }],
            }}
            transition={{
              type: "spring",
              damping: 20,
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
      <MotiView
        pointerEvents={props.showOverlay ? "auto" : "none"}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          zIndex: props.showOverlay ? 15 : 0,
        }}
        animate={{
          opacity: props.showOverlay ? 0.5 : 0,
        }}
        transition={{
          type: "timing",
          duration: props.showOverlay ? 200 : 0,
        }}
      />
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
