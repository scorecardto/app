import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useRef, useState } from "react";
import AssignmentEdits from "../../../../../../lib/types/AssignmentEdits";
import LargeGradebookSheetTile from "./LargeGradebookSheetTile";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { NativeViewGestureHandlerProps } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../../../../text/SmallText";
import * as Haptics from "expo-haptics";
export default function AssignmentGradeTile(props: {
  grade:
    | {
        pointsPossible: number;
        pointsEarned: number;
      }
    | string;
  originalGrade:
    | {
        pointsPossible: number;
        pointsEarned: number;
      }
    | string;
  edit(e: AssignmentEdits): void;
}) {
  const gradeToString = (grade) => {
    return typeof grade === "string"
      ? grade
      : grade.pointsPossible === 100
      ? `${grade.pointsEarned}%`
      : `${grade.pointsEarned}  /  ${grade.pointsPossible}`;
  };

  const textInputRef = useRef(null);
  const [inputValue, setInputValue] = useState(gradeToString(props.grade));
  const [testingValue, setTestingValue] = useState(gradeToString(props.grade));

  const [focus, setFocus] = useState(false);
  const parseText = (value) => {
    const clean = value.replace(/[^0-9.\/%]/g, "").trim();

    if (clean === "") return -1;

    if (clean.endsWith("%")) {
      const trimmed = clean.replace(/(.)\1*$/, "");

      if (trimmed.includes("%") || trimmed.includes("/") || trimmed === "")
        return -1;
    } else if (clean.includes("%")) {
      return -1;
    }

    if (clean.endsWith("%")) {
      const percentage = parseFloat(clean);

      return isNaN(percentage) ? -1 : percentage;
    }

    if (clean.includes("/")) {
      if (clean.startsWith("/")) return -1;

      const sequences = clean.match(new RegExp("/+", "g"));

      if (!sequences || sequences.length > 1) return -1;

      if (clean.endsWith("/")) {
        const numeric = parseFloat(clean);

        return isNaN(numeric) ? -1 : numeric;
      }

      const sides = clean.split("/").filter((i) => i !== "");

      const left = parseFloat(sides[0]);

      const right = parseFloat(sides[1]);

      if (right === 0) return 0;

      return [left, right];
    }

    const numeric = parseFloat(clean);

    return isNaN(numeric) ? -1 : numeric;
  };

  const edited = testingValue !== gradeToString(props.originalGrade);

  const { colors } = useTheme();
  return (
    <LargeGradebookSheetTile
      onPress={() => {
        textInputRef.current.focus?.();
      }}
    >
      <SmallText>Exact Grade</SmallText>
      <View
        style={{
          backgroundColor: colors.borderNeutral,
          paddingHorizontal: 12,
          paddingVertical: 8,
          alignSelf: "flex-start",
          borderRadius: 8,
          marginVertical: 8,
        }}
      >
        <View>
          <BottomSheetTextInput
            ref={textInputRef}
            value={inputValue}
            onFocus={() => {
              setFocus(true);
              setInputValue("");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            onChangeText={(t) => {
              setInputValue(t);
            }}
            onEndEditing={() => {
              const parsed = parseText(inputValue);

              if (parsed === -1) {
                setInputValue(gradeToString(props.originalGrade));
                setTestingValue(gradeToString(props.originalGrade));
                props.edit({
                  pointsEarned: null,
                  pointsPossible: null,
                });
              } else if (typeof parsed === "object") {
                const edit = {
                  pointsEarned: parsed[0],
                  pointsPossible: parsed[1],
                };
                setInputValue(gradeToString(edit));
                setTestingValue(gradeToString(edit));
                props.edit(edit);
              } else {
                const edit = {
                  pointsEarned: parsed,
                  pointsPossible: 100,
                };
                setInputValue(gradeToString(edit));
                setTestingValue(gradeToString(edit));
                props.edit(edit);
              }
            }}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            textContentType="none"
            autoCorrect={false}
            maxLength={7}
            style={{
              fontVariant: ["tabular-nums"],
              color: edited && !focus ? "red" : colors.primary,
              fontSize: 20,
            }}
            placeholder={gradeToString(props.originalGrade)}
          />
        </View>
      </View>
      <SmallText>Rounds to 94%</SmallText>
    </LargeGradebookSheetTile>
  );
}
