import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import GradeCategorySelectorSheet from "./GradeCategorySelectorSheet";
import { ActionSheetRef } from "react-native-actions-sheet";

export default function DashboardToolbar() {
  const colors = useColors();

  const currentGradingPeriod = useSelector((s: RootState) => {
    return s.gradeData.record?.gradeCategoryNames[s.gradeCategory.category];
  });

  const selector = useRef<ActionSheetRef>(null);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            selector.current?.show();
          }}
        >
          <View
            style={{
              backgroundColor: colors.button,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 99,
            }}
          >
            <MediumText
              style={{
                color: "#FFFFFF",
                fontSize: 16,
              }}
            >
              {currentGradingPeriod ?? "No Grades"}
            </MediumText>
          </View>
        </TouchableOpacity>
      </View>
      <GradeCategorySelectorSheet
        ref={selector}
        onSelect={() => {
          selector.current?.hide();
        }}
      />
    </>
  );
}
