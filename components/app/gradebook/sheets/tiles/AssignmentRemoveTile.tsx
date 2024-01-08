import {View, Text, TextInput, TextInputProps, TouchableOpacity} from "react-native";
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
                      textAlign: "center",
                      width: "100%",
                  }}
              >
                  Remove
              </SmallText>

          </SmallGradebookSheetTile>
      </TouchableOpacity>
  );
}
