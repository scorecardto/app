import { View, Text } from "react-native";
import React, {
  ForwardRefExoticComponent,
  Ref,
  forwardRef,
  useState,
} from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useTheme } from "@react-navigation/native";
import AssignmentTileTextInputFrame from "./AssignmentTileTextInputFrame";

const AssignmentTileTextInput = forwardRef(
  (
    props: {
      value: string;
      setValue(s: string): void;
      onFinish(): void;
      edited: boolean;
      placeholder: string;
    },
    ref: Ref<any>
  ) => {
    const [focus, setFocus] = useState(false);

    const { colors } = useTheme();

    return (
      <AssignmentTileTextInputFrame>
        <View>
          <BottomSheetTextInput
            ref={ref}
            value={props.value}
            onFocus={() => {
              setFocus(true);
              props.setValue("");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            onChangeText={(t) => {
              props.setValue(t);
            }}
            onEndEditing={props.onFinish}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            textContentType="none"
            autoCorrect={false}
            maxLength={7}
            style={{
              fontVariant: ["tabular-nums"],
              color: props.edited && !focus ? "red" : colors.primary,
              fontSize: 20,
            }}
            placeholder={props.placeholder}
          />
        </View>
      </AssignmentTileTextInputFrame>
    );
  }
);

export default AssignmentTileTextInput;
