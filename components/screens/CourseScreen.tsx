import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { View } from "react-native";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import LargeText from "../text/LargeText";
import CourseAverageDisplay from "../app/course/CourseAverageDisplay";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
export default function CourseScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const { key } = props.route.params;

  const course = useSelector((r: RootState) => {
    return r.gradeData.record?.courses.find((c) => c.key === key);
  });

  const average = useSelector((r: RootState) => {
    return course?.grades[r.gradeCategory.category]?.value;
  });

  const grades = useSelector((r: RootState) => {
    return course?.gradeCategories;
  });

  const name = useSelector((r: RootState) => {
    return r.courseSettings[key]?.displayName || course?.name;
  });

  const colors = useColors();

  const [modifiedAvg, setModifiedAvg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  return (
    <CourseScreenWrapper courseKey={key}>
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <CourseScreenGradient />
        <View
          style={{
            flexShrink: 0,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              // backgroundColor: "red",
              paddingTop: 24,
            }}
          >
            <CourseCornerButtonContainer
              onPressLeft={() => {
                props.navigation.goBack();
              }}
              onPressRight={() => {
                props.navigation.navigate("editCourse", {
                  key: key,
                });
              }}
            />

            <View
              style={{
                paddingHorizontal: 8,
                paddingTop: 4,
              }}
            >
              <LargeText
                style={{
                  color: colors.primary,
                }}
                textProps={{
                  numberOfLines: 1,
                }}
              >
                {name}
              </LargeText>
            </View>

            <View>
              {/* <CommentsPreview /> */}
              <CourseAverageDisplay
                average={average}
                modifiedAverage={modifiedAvg ?? undefined}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexGrow: 1,
            padding: 16,
            backgroundColor: colors.backgroundNeutral,
            flex: 1,
          }}
        >
          <View
            style={{
              height: "100%",
              flex: 1,
            }}
          >
            {course && (
              <GradebookWrapper
                course={course}
                setModifiedGrade={setModifiedAvg}
                oldGradingPeriodLastUpdated={undefined}
                refreshOldGradingPeriod={() => {
                  // refreshGradingPeriod(false);
                }}
                resetKey={`${resetKey}`}
              />
            )}
          </View>
        </View>
      </View>
    </CourseScreenWrapper>
  );
}
