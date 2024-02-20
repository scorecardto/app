import { View, TouchableOpacity } from "react-native";
import { Ref, forwardRef } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import SmallText from "../../text/SmallText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
import { setGradeCategory } from "../../core/state/grades/gradeCategorySlice";
import useColors from "../../core/theme/useColors";
import { getAnalytics } from "@react-native-firebase/analytics";

const starred = require("../../../assets/starred.svg");

const GradeCategorySelectorSheet = forwardRef(
  (props: {}, ref: Ref<ActionSheetRef>) => {
    const gradeCategoryNames = useSelector(
      (s: RootState) => s.gradeData.record?.gradeCategoryNames
    );
    const currentGradeCategory = useSelector(
      (s: RootState) => s.gradeCategory.category
    );

    const recordGradeCategory = useSelector(
      (s: RootState) => s.gradeData.record?.gradeCategory
    );

    const colors = useColors();

    const dispatch = useDispatch<AppDispatch>();

    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: colors.card,
        }}
      >
        <BottomSheetHeader>Grading Period</BottomSheetHeader>
        {gradeCategoryNames?.map((category, idx) => {
          const selected = idx === currentGradeCategory;

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
                  dispatch(setGradeCategory(idx));

                  getAnalytics().logEvent("change_grading_period", {
                    from: recordGradeCategory,
                    to: idx,
                  });
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
                      color: colors.primary,
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
                  {!selected && recordGradeCategory === idx && (
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
