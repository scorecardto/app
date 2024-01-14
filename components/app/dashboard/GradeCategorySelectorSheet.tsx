import { View, Text, TouchableOpacity } from "react-native";
import React, { Ref, forwardRef, useContext, useEffect, useMemo } from "react";
import { DataContext } from "scorecard-types";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";

const starred = require("../../../assets/starred.svg");

const GradeCategorySelectorSheet = forwardRef(
  (props: {}, ref: Ref<ActionSheetRef>) => {
    const dataContext = useContext(DataContext);

    const { colors } = useTheme();

    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 16,
        }}
      >
        <BottomSheetHeader>Grading Period</BottomSheetHeader>
        {dataContext.data?.gradeCategoryNames.map((category, idx) => {
          const selected = idx === dataContext.gradeCategory;

          return (
            <View
              key={idx}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.borderNeutral,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  dataContext.setGradeCategory(idx);
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 32,
                    backgroundColor: selected
                      ? colors.backgroundNeutral
                      : colors.card,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <SmallText
                    style={{
                      paddingVertical: 16,
                    }}
                  >
                    {category}
                  </SmallText>
                  {selected && (
                    <MaterialIcon
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                  {!selected && dataContext.data?.gradeCategory === idx && (
                    <Image
                      source={starred}
                      style={{
                        width: 20,
                        aspectRatio: 1,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ActionSheet>
    );
  }
);

export default GradeCategorySelectorSheet;
