import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  AnswerActionPath,
  AnswerWithActionQuestionPath,
  MultiselectQuestionPath,
} from "../../../../lib/types/QuestionPath";
import QuestionPathButton from "./QuestionPathButton";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import useColors from "../../../core/theme/useColors";
import Button from "../../../input/Button";
export default function QuestionAnswerAction(props: {
  path: AnswerWithActionQuestionPath;
  back?: () => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        width: "100%",
      }}
    >
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
            <BottomSheetHeader>More Info</BottomSheetHeader>
          </View>

          {props.back && <View></View>}
        </View>

        <Text
          style={{
            color: colors.text,
            fontSize: 14,
            padding: 16,
          }}
        >
          {props.path.text}
        </Text>
        <Button
          onPress={props.path.onPress}
          children={props.path.actionLabel}
        />
      </>
    </View>
  );
}
