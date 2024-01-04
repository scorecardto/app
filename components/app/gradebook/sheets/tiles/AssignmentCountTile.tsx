import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useRef, useState } from "react";
import AssignmentEdits from "../../../../../lib/types/AssignmentEdits";
import LargeGradebookSheetTile from "./LargeGradebookSheetTile";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { NativeViewGestureHandlerProps } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../../../text/SmallText";
import * as Haptics from "expo-haptics";
import AssignmentTileTextInput from "./AssignmentTileTextInput";
import SmallGradebookSheetTile from "./SmallGradebookSheetTile";

export default function AssignmentCountTile(props: {
  count: number;
  testing: boolean;
  originalCount: number;
  edit(e: AssignmentEdits): void;
}) {
  const textInputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(props.count.toString());
  const [testingValue, setTestingValue] = useState(props.count);

  const parseText = (value: string) => {
    const numeric = parseInt(value.trim());

    return isNaN(numeric) ? -1 : numeric;
  };

  const onFinishEditing = () => {
    const parsed = parseText(inputValue);

    if (parsed === -1) {
      setInputValue(props.originalCount.toString());
      setTestingValue(props.originalCount);
      props.edit({
        count: undefined,
      });
    } else {
      setInputValue(parsed.toString());
      setTestingValue(parsed);
      props.edit({
        count: parsed,
      });
    }
  };

  return (
    <SmallGradebookSheetTile
      onPress={() => {
        textInputRef.current?.focus();
      }}
    >
      <SmallText>Weight</SmallText>
      <AssignmentTileTextInput
        value={inputValue}
        ref={textInputRef}
        edited={props.testing || testingValue !== props.originalCount}
        onFinish={onFinishEditing}
        placeholder={props.originalCount.toString()}
        setValue={setInputValue}
      />
    </SmallGradebookSheetTile>
  );
}
