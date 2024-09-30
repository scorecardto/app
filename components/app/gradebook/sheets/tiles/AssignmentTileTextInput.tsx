import {View} from "react-native";
import React, {forwardRef, Ref, useState,} from "react";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {useTheme} from "@react-navigation/native";
import AssignmentTileTextInputFrame from "./AssignmentTileTextInputFrame";

const AssignmentTileTextInput = forwardRef(
  (
    props: {
      value: string;
      setValue(s: string): void;
      onStart?(): void;
      onFinish(): void;
      edited: boolean;
      placeholder: string;
      illegalCharacters: any;
      maxLength?: number;
      changed: boolean;
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
            clearTextOnFocus={true}
            onFocus={() => {
              props.setValue("");
              props.onStart && props.onStart();
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
              props.onFinish();
            }}
            onChangeText={(text) => {
                props.setValue(text.replace(props.illegalCharacters, ""));
            }}
            onEndEditing={props.onFinish}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            textContentType="none"
            autoCorrect={false}
            maxLength={props.maxLength}
            style={{
              fontVariant: ["tabular-nums"],
              color: props.edited && !focus ? "red" : props.changed ? colors.newGrade : colors.primary,
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
