import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";
import { SafeAreaView, Text, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
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
import oldCourseStatesSlice, {
  setOldCourseState,
} from "../core/state/grades/oldCourseStatesSlice";
import Storage from "expo-storage";
import {
  fetchGradeCategoriesForCourse,
  fetchGradeCategoriesForCourses,
  fetchReportCard,
} from "../../lib/fetcher";
import {
  setRSMessage,
  setRSType,
  setRefreshStatus,
} from "../core/state/grades/refreshStatusSlice";
import Toast from "react-native-toast-message";
import { AllCoursesResponse } from "scorecard-types";
import NotificationsSelectorSheet from "../app/course/NotificationsSelectorSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import CourseNotificationsButton from "../app/course/CourseNotificationsButton";

export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const gradeChangeTable = useSelector(
    (state: RootState) => state.changeTables.tables[key],
    () => true
  ) ?? { changed: false };

  const courseInitial = useSelector(
    (state: RootState) =>
      state.gradeData.record?.courses.find((c) => c.key === key),
    () => true
  );

  const gradeCategory =
    props.route.params.gradeCategory ??
    useSelector((root: RootState) => root.gradeCategory.category);

  const recordGrade = useSelector(
    (root: RootState) => root.gradeData.record?.gradeCategory
  );

  const [course, setCourse] = useState(
    gradeCategory === recordGrade ? courseInitial : null
  );

  const login = useSelector((state: RootState) => state.login);

  const [lastUpdatedOldGradingPeriod, setLastUpdatedOldGradingPeriod] =
    useState<string | undefined>(undefined);

  const refreshGradingPeriod = useCallback(
    async (allowGetFromStorage: boolean) => {
      setLastUpdatedOldGradingPeriod(undefined);

      const oldGradebooks = JSON.parse(
        ((await Storage.getItem({ key: "oldGradebooks" })) || "{}") as string
      );

      const alternateKey = courseInitial?.grades[gradeCategory]?.key;

      if (courseInitial == null || alternateKey == null) return;

      if (oldGradebooks[alternateKey] != null && allowGetFromStorage) {
        if (!courseInitial.grades[gradeCategory]?.active) {
          setCourse(oldGradebooks[alternateKey]);
          setGradeText(
            oldGradebooks[alternateKey].grades[gradeCategory]?.value || "NG"
          );
          setLastUpdatedOldGradingPeriod(
            oldGradebooks[alternateKey].lastUpdated
          );
          return;
        } else {
          Toast.show({
            type: "info",
            text1: "Refreshing Grades",
            text2:
              "Scorecard has a copy of this grading period, but is refreshing from Frontline since grades are still active.",
          });
        }
      }

      const reportCard = await fetchReportCard(
        login.district,
        login.username,
        login.password,
        () => {},
        (status) => {
          dispatch(setRefreshStatus(status));
        }
      );

      dispatch(
        setRefreshStatus({
          type: "GETTING_COURSES",
          status: "Loading old grades...",
          taskRemaining: 1,
          tasksCompleted: 3,
        })
      );

      const categories = await fetchGradeCategoriesForCourse(
        login.district,
        reportCard.sessionId,
        reportCard.referer,
        {
          ...courseInitial,
          key: alternateKey || "",
        }
      );

      dispatch(setRSType("IDLE"));

      setCourse({
        ...courseInitial,
        gradeCategories: categories.gradeCategories,
      });

      setGradeText(courseInitial.grades[gradeCategory]?.value || "NG");

      setLastUpdatedOldGradingPeriod(new Date().toISOString());

      oldGradebooks[alternateKey] = {
        ...courseInitial,
        gradeCategories: categories.gradeCategories,
        lastUpdated: new Date().toISOString(),
      };

      Storage.setItem({
        key: "oldGradebooks",
        value: JSON.stringify(oldGradebooks),
      });

      fetchGradeCategoriesForCourses(
        login.district,
        {
          ...reportCard,
          courses: reportCard.courses.map((c) => {
            return {
              ...c,
              key: c.grades[gradeCategory]?.key || c.key,
            };
          }),
        },
        () => {},
        gradeCategory
      ).then(async (categories: AllCoursesResponse) => {
        const oldGradebooks = JSON.parse(
          ((await Storage.getItem({ key: "oldGradebooks" })) || "{}") as string
        );

        categories.courses.forEach((c) => {
          oldGradebooks[c.key] = {
            ...c,
            lastUpdated: new Date().toISOString(),
          };
        });

        Storage.setItem({
          key: "oldGradebooks",
          value: JSON.stringify(oldGradebooks),
        });
      });
    },
    [courseInitial, gradeCategory, login]
  );

  // const courseName = useSelector(
  //   (state: RootState) =>
  //     state.courseSettings[key]?.displayName || course?.name || ""
  // );

  useEffect(() => {
    if (course != null) return;

    console.log("Refreshing");

    refreshGradingPeriod(true);
  }, [courseInitial]);

  const courseGradeText = course?.grades[gradeCategory]?.value || "NG";

  const [showGradeStateChanges, setShowGradeStateChanges] = useState(
    gradeChangeTable.changed
  );

  const [gradeText, setGradeText] = useState<string>(
    gradeChangeTable.changed ? gradeChangeTable.oldAverage! : courseGradeText
  );
  const [modifiedAvg, setModifiedAvg] = useState<string | null>(
    gradeChangeTable.changed ? courseGradeText ?? null : null
  );

  const colors = useColors();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (course == null) return;

    if (gradeChangeTable.changed) {
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

  const [resetKey, setResetKey] = useState(0);

  const selector = useRef<ActionSheetRef>(null);
  if (course == null) {
    return (
      <>
        <LoadingOverlay show={true} hideBackdrop />
      </>
    );
  }

  return (
    <CourseScreenWrapper courseKey={key}>
      <CourseCornerButtonContainer
        onPress={() => {
          props.navigation.goBack();
        }}
        type="BACK"
      />

      <CourseNotificationsButton
        courseKey={key}
        onPress={() => {
          selector.current?.setModalVisible(true);
        }}
      />

      <NotificationsSelectorSheet ref={selector} courseKey={key} />

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
            resetGradeTesting={() => {
              setResetKey((prev) => prev + 1);
            }}
            courseKey={key}
            showingStateChanges={showGradeStateChanges}
            defaultName={course?.name || ""}
            gradeText={gradeText}
            modifiedGradeText={modifiedAvg}
          />

          {showGradeStateChanges ? (
            <View>
              <GradeStateChangesCard
                course={course!}
                gradeChangeTable={gradeChangeTable}
                onFinished={() => {
                  setShowGradeStateChanges(false);
                  setGradeText(courseGradeText);
                  setModifiedAvg(null);
                }}
              />
            </View>
          ) : (
              <GradebookWrapper
                  course={course}
                  setModifiedGrade={setModifiedAvg}
                  oldGradingPeriodLastUpdated={lastUpdatedOldGradingPeriod}
                  refreshOldGradingPeriod={() => {
                      refreshGradingPeriod(false);
                  }}
                  resetKey={`${resetKey}`}
              />
          )}
        </View>
        <CourseScreenGradient />
      </SafeAreaView>
    </CourseScreenWrapper>
  );
}
