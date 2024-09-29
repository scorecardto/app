import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import AssignmentEdits from "../../../../../lib/types/AssignmentEdits";
import LargeGradebookSheetTile from "./LargeGradebookSheetTile";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../../../text/SmallText";
import * as Haptics from "expo-haptics";
import AssignmentTileTextInput from "./AssignmentTileTextInput";
import SmallGradebookSheetTile from "./SmallGradebookSheetTile";
import AssignmentTileTextInputFrame from "./AssignmentTileTextInputFrame";

export default function AssignmentRemoveTile(props: {
  removeAssignment(): void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={props.removeAssignment}>
      <SmallGradebookSheetTile>
        <SmallText
          style={{
            color: colors.primary,
            textAlign: "center",
            width: "100%",
          }}
        >
          Remove Assignment
        </SmallText>
      </SmallGradebookSheetTile>
    </TouchableOpacity>
  );
}
