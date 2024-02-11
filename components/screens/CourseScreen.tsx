import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";
import { SafeAreaView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import captureCourseState from "../../lib/captureCourseState";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseCornerButton from "../app/course/CourseCornerButton";
import CourseHeading from "../app/course/CourseHeading";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import GradeStateChangesCard from "../app/gradebook/GradeStateChangesCard";
import CourseState from "../../lib/types/CourseState";
import Gradebook from "../app/gradebook/Gradebook";
import LoadingOverlay from "./loader/LoadingOverlay";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { setOldCourseState } from "../core/state/grades/oldCourseStatesSlice";
import Storage from "expo-storage";

export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const course = useSelector(
    (state: RootState) =>
      state.gradeData.record?.courses.find((c) => c.key === key),
    () => true
  );

  const courseName = useSelector(
    (state: RootState) =>
      state.courseSettings[key].displayName || course?.name || ""
  );

  const stateChanges = useSelector(
    (state: RootState) => {
      const oldState: CourseState = state.oldCourseStates.record[
        key
      ] as CourseState;

      const currentCourse = state.gradeData.record?.courses.find(
        (c) => c.key === key
      );

      if (oldState == null || currentCourse == null)
        return {
          exists: false,
          oldAverage: "",
        };

      const newState = JSON.stringify(captureCourseState(currentCourse));

      return {
        exists: JSON.stringify(oldState) !== newState,
        oldAverage: oldState.average,
      };
    },
    () => true
  );

  const gradeCategory = useSelector(
    (root: RootState) => root.gradeCategory.category
  );
  const courseGradeText = course?.grades[gradeCategory]?.value;

  const [showGradeStateChanges, setShowGradeStateChanges] = useState(
    stateChanges.exists
  );

  const [gradeText, setGradeText] = useState<string>(
    stateChanges.exists ? stateChanges.oldAverage : courseGradeText || "NG"
  );
  const [modifiedAvg, setModifiedAvg] = useState<string | null>(
    stateChanges.exists ? courseGradeText ?? null : null
  );

  const colors = useColors();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (course == null) return;

    const stateChange = stateChanges.exists;

    if (stateChange) {
      setTimeout(() => {
        dispatch(
          setOldCourseState({
            key: key,
            value: captureCourseState(course),
            save: "STATE_AND_STORAGE",
          })
        );
      }, 1500);
    }
  }, []);

  if (course == null) {
    return <LoadingOverlay show={true} />;
  }
  return (
    <CourseScreenWrapper courseKey={key}>
      <CourseCornerButtonContainer
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <SafeAreaView
        style={{
          height: "100%",
          backgroundColor: colors.backgroundNeutral,
          position: "relative",
          zIndex: 1,
        }}
      >
        <View style={{ zIndex: 1 }}>
          <CourseHeading
            courseKey={key}
            defaultName={course?.name || ""}
            gradeText={gradeText}
            modifiedGradeText={modifiedAvg}
          />

          {showGradeStateChanges ? (
            <View>
              <GradeStateChangesCard
                course={course!}
                onFinished={() => {
                  setShowGradeStateChanges(false);
                  setGradeText(courseGradeText || "NG");
                  setModifiedAvg(null);
                }}
              />
            </View>
          ) : (
            <GradebookWrapper
              course={course}
              setModifiedGrade={setModifiedAvg}
            />
          )}
        </View>
        <CourseScreenGradient />
      </SafeAreaView>
    </CourseScreenWrapper>
  );
}
