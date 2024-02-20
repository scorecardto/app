import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import QuestionPath from "../../../../lib/types/QuestionPath";
import useColors from "../../../core/theme/useColors";
import Button from "../../../input/Button";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";

export default function QuestionPathButton(props: {
  questionPath: QuestionPath;
  press: () => void;
}) {
  const sheets = useContext(BottomSheetContext);
  const colors = useColors();
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.questionPath.type === "answer") {
          setOpen(!open);
        } else if (props.questionPath.type === "answerAction") {
          props.questionPath.onPress();
          sheets?.next();
        }
        props.press();
      }}
    >
      <View
        style={{
          backgroundColor: colors.backgroundNeutral,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginRight: 16,
            }}
          >
            {props.questionPath.emoji}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 14 }}>
            {props.questionPath.label}
          </Text>
        </View>
        {open && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.borderNeutral,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                padding: 16,
              }}
            >
              {/* @ts-ignore */}
              {props.questionPath.text}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
