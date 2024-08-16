import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";
import { View } from "react-native";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import LargeText from "../text/LargeText";
import CourseAverageDisplay from "../app/course/CourseAverageDisplay";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import Storage from "expo-storage";
import Toast from "react-native-toast-message";
import {
  fetchGradeCategoriesForCourse,
  fetchGradeCategoriesForCourses,
  fetchReportCard,
} from "../../lib/fetcher";
import {
  setRefreshStatus,
  setRSType,
} from "../core/state/grades/refreshStatusSlice";
import { AllCoursesResponse } from "scorecard-types";
export default function CourseScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const { key } = props.route.params;

  const courseInitial = useSelector((r: RootState) => {
    return r.gradeData.record?.courses.find((c) => c.key === key);
  });

  const login = useSelector((state: RootState) => state.login);

  const gradeCategory =
    props.route.params.gradeCategory ??
    useSelector((root: RootState) => root.gradeCategory.category);

  const recordGrade = useSelector(
    (root: RootState) => root.gradeData.record?.gradeCategory
  );
  const [course, setCourse] = useState(
    gradeCategory === recordGrade ? courseInitial : null
  );

  const dispatch = useDispatch<AppDispatch>();
  const refreshGradingPeriod = useCallback(
    async (allowGetFromStorage: boolean) => {
      // setLastUpdatedOldGradingPeriod(undefined);

      const oldGradebooks = JSON.parse(
        ((await Storage.getItem({ key: "oldGradebooks" })) || "{}") as string
      );

      const alternateKey = courseInitial?.grades[gradeCategory]?.key;

      if (courseInitial == null || alternateKey == null) return;

      if (oldGradebooks[alternateKey] != null && allowGetFromStorage) {
        if (!courseInitial.grades[gradeCategory]?.active) {
          setCourse(oldGradebooks[alternateKey]);
          // setGradeText(
          //   oldGradebooks[alternateKey].grades[gradeCategory]?.value || "NG"
          // );
          // setLastUpdatedOldGradingPeriod(
          //   oldGradebooks[alternateKey].lastUpdated
          // );
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

      dispatch(
        setRefreshStatus({
          type: "GETTING_COURSES",
          status: "Downloading old data...",
          taskRemaining: 1,
          tasksCompleted: 3,
        })
      );

      const reportCard = await fetchReportCard(
        login.district,
        login.username,
        login.password,
        () => {},
        (status) => {
          // setRefreshStatus(status);
        }
      );

      dispatch(
        setRefreshStatus({
          type: "GETTING_COURSES",
          status: "Loading course data...",
          taskRemaining: 2,
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

      // setGradeText(courseInitial.grades[gradeCategory]?.value || "NG");

      // setLastUpdatedOldGradingPeriod(new Date().toISOString());

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

  const average = useMemo(() => {
    return course?.grades[gradeCategory]?.value;
  }, [gradeCategory, course]);

  const grades = useSelector((r: RootState) => {
    return course?.gradeCategories;
  });

  const name = useSelector((r: RootState) => {
    return r.courseSettings[key]?.displayName || course?.name;
  });

  const colors = useColors();

  const [modifiedAvg, setModifiedAvg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (course != null) return;

    console.log("Refreshing");

    refreshGradingPeriod(true);
  }, [courseInitial]);

  useEffect(() => {
    if (course == null) return;

    // if (gradeChangeTable.changed) {
    //   setTimeout(() => {
    //     dispatch(
    //       setOldCourseState({
    //         key: key,
    //         value: captureCourseState(course),
    //         save: "STATE_AND_STORAGE",
    //       })
    //     );
    //   }, 1500);
    // }
  }, []);
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
