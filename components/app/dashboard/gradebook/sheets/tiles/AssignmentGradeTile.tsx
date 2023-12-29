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
import AssignmentTileTextInput from "./AssignmentTileTextInput";

type TileValue =
  | {
      pointsPossible: number;
      pointsEarned: number;
    }
  | string;

const gradeToString = (grade: TileValue) => {
  return typeof grade === "string"
    ? grade
    : grade.pointsPossible === 100
    ? `${grade.pointsEarned}%`
    : `${grade.pointsEarned} / ${grade.pointsPossible}`;
};

export default function AssignmentGradeTile(props: {
  grade: TileValue;
  originalGrade: TileValue;
  edit(e: AssignmentEdits): void;
}) {
  const textInputRef = useRef(null);
  const [inputValue, setInputValue] = useState(gradeToString(props.grade));
  const [testingValue, setTestingValue] = useState(gradeToString(props.grade));

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

  const onFinishEditing = () => {
    const parsed = parseText(inputValue);

    if (parsed === -1) {
      setInputValue(gradeToString(props.originalGrade));
      setTestingValue(gradeToString(props.originalGrade));
      props.edit({
        pointsEarned: null,
        pointsPossible: null,
      });
    } else {
      const edit =
        typeof parsed === "object"
          ? {
              pointsEarned: parsed[0],
              pointsPossible: parsed[1],
            }
          : {
              pointsEarned: parsed,
              pointsPossible: 100,
            };
      setInputValue(gradeToString(edit));
      setTestingValue(gradeToString(edit));
      props.edit(edit);
    }
  };

  return (
    <LargeGradebookSheetTile
      onPress={() => {
        textInputRef.current.focus?.();
      }}
    >
      <SmallText>Exact Grade</SmallText>
      <AssignmentTileTextInput
        value={inputValue}
        ref={textInputRef}
        edited={edited}
        onFinish={onFinishEditing}
        placeholder={gradeToString(props.originalGrade)}
        setValue={setInputValue}
      />
      <SmallText>Rounds to 94%</SmallText>
    </LargeGradebookSheetTile>
  );
}
