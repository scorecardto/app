import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import CourseEditSheet from "./CourseEditSheet";
import Header from "../../text/Header";
import LargeGradeText from "../../text/LargeGradeText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useColors from "../../core/theme/useColors";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { useFeatureFlag } from "../../../lib/featureFlag";
import MoreFeaturesSheet from "../vip/MoreFeaturesSheet";

export default function CourseHeading(props: {
  courseKey: string;
  defaultName: string;
  gradeText: string;
  modifiedGradeText: string | null;
  resetGradeTesting: () => void;
}) {
  const sheets = useContext(BottomSheetContext);
  const colors = useColors();

  const courseName = useSelector(
    (state: RootState) =>
      state.courseSettings[props.courseKey]?.displayName || props.defaultName
  );

  const allowCourseEditSheet = useFeatureFlag("ALLOW_COURSE_EDITING");

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.modifiedGradeText) {
          props.resetGradeTesting();
        } else {
          sheets?.addSheet(({ close, setOnClose }) =>
            allowCourseEditSheet ? (
              <CourseEditSheet
                courseKey={props.courseKey}
                defaultName={props.defaultName}
                setOnClose={setOnClose}
              />
            ) : (
              <MoreFeaturesSheet close={close} source="HEADER" />
            )
          );
        }
      }}
    >
      <View style={{ marginHorizontal: 64 }}>
        <Header
          header={props.modifiedGradeText ? "Tap to Reset" : courseName}
          subheader={
            props.modifiedGradeText
              ? "You're using grade testing right now."
              : courseName !== props.defaultName
              ? undefined
              : "Tap to add a name and color"
          }
        >
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <LargeGradeText
              grade={props.gradeText}
              colorType={props.modifiedGradeText ? "SECONDARY" : "PRIMARY"}
            />
            {props.modifiedGradeText && (
              <MaterialIcons
                name={"arrow-forward"}
                size={25}
                color={colors.text}
              />
            )}
            {props.modifiedGradeText && (
              <LargeGradeText
                grade={`${props.modifiedGradeText}`}
                colorType="PRIMARY"
              />
            )}
          </View>
        </Header>
      </View>
    </TouchableOpacity>
  );
}
