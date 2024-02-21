import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MultiselectQuestionPath } from "../../../../lib/types/QuestionPath";
import QuestionPathButton from "./QuestionPathButton";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import useColors from "../../../core/theme/useColors";
import QuestionAnswerAction from "./QuestionAnswerAction";
export default function QuestionMultiselect(props: {
  path: MultiselectQuestionPath;
  back?: () => void;
}) {
  const [showMultiselectIndex, setShowMultiselectIndex] = useState(-1);
  const colors = useColors();
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      {showMultiselectIndex === -1 && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {props.back && (
              <View
                //   onPress={props.back}
                style={{
                  width: 0,
                  height: "100%",
                  zIndex: 100,
                }}
              >
                <TouchableOpacity
                  onPress={props.back}
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <MaterialIcon
                    name="chevron-left"
                    size={20}
                    color={colors.text}
                  />
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      marginLeft: 4,
                    }}
                  >
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                marginBottom: 4,
                width: "100%",
              }}
            >
              <BottomSheetHeader>{props.path.title}</BottomSheetHeader>
            </View>

            {props.back && <View></View>}
          </View>

          {props.path.options.map((option, idx) => {
            return (
              <QuestionPathButton
                questionPath={option}
                key={idx}
                press={() => {
                  if (
                    option.type === "multiselect" ||
                    option.type === "answerWithAction"
                  ) {
                    setShowMultiselectIndex(idx);
                  }
                }}
              />
            );
          })}
        </>
      )}
      {showMultiselectIndex !== -1 &&
        props.path.options[showMultiselectIndex].type === "multiselect" && (
          <QuestionMultiselect
            // @ts-ignore
            path={props.path.options[showMultiselectIndex]}
            back={() => {
              setShowMultiselectIndex(-1);
            }}
          />
        )}
      {showMultiselectIndex !== -1 &&
        props.path.options[showMultiselectIndex].type ===
          "answerWithAction" && (
          <QuestionAnswerAction
            // @ts-ignore
            path={props.path.options[showMultiselectIndex]}
            back={() => {
              setShowMultiselectIndex(-1);
            }}
          />
        )}
    </View>
  );
}
