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
import AssignmentTileTextInputFrame from "./AssignmentTileTextInputFrame";

export default function AssignmentDroppedTile(props: {
  dropped: boolean;
  originalDropped: boolean;
  edit(e: AssignmentEdits): void;
}) {
  const [testingValue, setTestingValue] = useState(props.dropped);

  const { colors } = useTheme();

  return (
    <SmallGradebookSheetTile
      onPress={() => {
        props.edit({
          dropped: !testingValue,
        });

        setTestingValue(!testingValue);
      }}
    >
      <SmallText>Dropped</SmallText>
      <AssignmentTileTextInputFrame>
        <Text
          style={{
            color:
              testingValue !== props.originalDropped ? "red" : colors.primary,
          }}
        >
          {testingValue ? "yes" : "no"}
        </Text>
      </AssignmentTileTextInputFrame>
    </SmallGradebookSheetTile>
  );
}
