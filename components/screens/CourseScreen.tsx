import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";
import { TextInput, View } from "react-native";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import LargeText from "../text/LargeText";
import CourseAverageDisplay from "../app/course/CourseAverageDisplay";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { useCallback, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import ScorecardModule from "../../lib/expoModuleBridge";
import Toast from "react-native-toast-message";
import {
  setRefreshStatus,
  setRSType,
} from "../core/state/grades/refreshStatusSlice";
import { fetchAllContent } from "../../lib/fetcher";
import OldGradingPeriodDisplay from "../app/course/OldGradingPeriodDisplay";
import MediumText from "../text/MediumText";
import SmallText from "../text/SmallText";

export default function CourseScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const { key, gradeCategory } = props.route.params;

  const courseInitial = useSelector(
    (state: RootState) =>
      state.gradeData.record?.courses.find((c) => c.key === key),
    () => true
  );
  const recordCategory = useSelector(
    (root: RootState) => root.gradeData.record?.gradeCategory
  );

  const [course, setCourse] = useState(
    recordCategory == gradeCategory ? courseInitial : null
  );

  const average = useSelector((r: RootState) => {
    return course?.grades[gradeCategory]?.value || "NG";
  });
  const active = useSelector((r: RootState) => {
    return course?.grades[gradeCategory]?.active ?? true;
  });

  const grades = useSelector((r: RootState) => {
    return course?.gradeCategories;
  });

  const name = useSelector((r: RootState) => {
    return r.courseSettings[key]?.displayName || course?.name || r.gradeData.record?.courses.find((c) => c.key === key)?.name;
  });

  const colors = useColors();

  const [modifiedAvg, setModifiedAvg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (course != null) return;

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

  const [lastUpdatedOldGradingPeriod, setLastUpdatedOldGradingPeriod] =
    useState<string | undefined>(undefined);

  const login = useSelector((state: RootState) => state.login);
  const numCourses = useSelector(
    (state: RootState) => state.gradeData.record?.courses.length
  );
  const refreshGradingPeriod = useCallback(
    async (allowGetFromStorage: boolean) => {
      setLastUpdatedOldGradingPeriod(undefined);

      const oldGradebooks = JSON.parse(
        (ScorecardModule.getItem("oldGradebooks") || "{}") as string
      );

      const alternateKey = courseInitial?.grades[gradeCategory]?.key;

      if (courseInitial == null || alternateKey == null) return;

      if (oldGradebooks[alternateKey] != null && allowGetFromStorage) {
          if (courseInitial.grades[gradeCategory]?.active) {
              Toast.show({
                  type: "info",
                  text1: "Cached Grades",
                  text2:
                      "Scorecard has a copy of this grading period, but grades are still active. Refresh to update.",
              });
          }
          setCourse(oldGradebooks[alternateKey]);
          setLastUpdatedOldGradingPeriod(
            oldGradebooks[alternateKey].lastUpdated
          );
          return;
      }

      dispatch(
        setRefreshStatus({
          type: "GETTING_COURSES",
          status: "Loading old grades...",
          taskRemaining: 1,
          tasksCompleted: 3,
        })
      );
      setCourse(null);
      let found = false
      const content = await fetchAllContent(
        login.district,
        numCourses,
        login.username,
        login.password,
        gradeCategory,
        undefined,
        (status) => {
          !found && dispatch(setRefreshStatus(status));
        },
        (course) => {
          if (course.key != courseInitial.key) return;

          setCourse(course);

          setLastUpdatedOldGradingPeriod(new Date().toISOString());
        },
      );

        content.courses.forEach((c) => {
            oldGradebooks[c.grades[gradeCategory]?.key ?? c.key] = {
                ...c,
                lastUpdated: new Date().toISOString(),
            };
        });

        ScorecardModule.storeItem("oldGradebooks", JSON.stringify(oldGradebooks));

    },
    [courseInitial, gradeCategory, login]
  );

  useEffect(() => {
    if (course != null) return;

    refreshGradingPeriod(true);
  }, [courseInitial]);

  const dispatch = useDispatch<AppDispatch>();

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
                  gradeText: average,
                  defaultName: course?.name ?? "",
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
              <CourseAverageDisplay
                average={average}
                modifiedAverage={modifiedAvg ?? undefined}
                active={active}
              />
            </View>
            {recordCategory != gradeCategory &&
              (recordCategory == undefined ||
                gradeCategory < recordCategory) && (
                <View>
                  <OldGradingPeriodDisplay
                    lastUpdatedOldGradingPeriod={lastUpdatedOldGradingPeriod}
                    refreshGradingPeriod={refreshGradingPeriod}
                  />
                </View>
              )}
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
            {course ? (
              <GradebookWrapper
                course={course}
                setModifiedGrade={setModifiedAvg}
                resetKey={`${resetKey}`}
              />
            ) : (
                <View
                    style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                        paddingTop: 32
                    }}
                >
                    {gradeCategory < (recordCategory ?? 0) ? (
                        <>
                            <MediumText style={{color: colors.text}}>Loading...</MediumText>
                        </>) : (
                        <>
                            <MediumText style={{color: colors.text}}>No grades yet!</MediumText>
                            <MediumText style={{color: colors.text}}>Are you in the right grading period?</MediumText>
                        </>
                    )}
                </View>
            )}
          </View>
        </View>
      </View>
    </CourseScreenWrapper>
  );
}
