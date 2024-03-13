import React, { MutableRefObject, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import color from "../../../lib/Color";
import LinearGradient from "react-native-linear-gradient";
import colorLib from "color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
import { setCourseSetting } from "../../core/state/grades/courseSettingsSlice";
import Storage from "expo-storage";
import useColors from "../../core/theme/useColors";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
import {
  ChangeTable,
  ChangeTableEntry,
} from "../../../lib/types/ChangeTableEntry";
import captureCourseState from "../../../lib/captureCourseState";
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
  setGradeChanges: (t: ChangeTable) => void;
}) {
  const colors = useColors();
  const dark = useIsDarkMode();

  const dispatch = useDispatch<AppDispatch>();

  const allCourseSettings = useSelector((s: RootState) => s.courseSettings);

  const courseSettings = allCourseSettings[props.course.key];

  const accentLabel = courseSettings?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: "transparent",
      borderRadius: 12,
      overflow: "hidden",
      marginHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      overflow: "hidden",
    },
    badge: {
      width: 56,
      height: 56,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingLeft: 24,
      color: colors.primary,
      flex: 1,
    },
    grade: {
      marginRight: 24,
      marginLeft: 6,
      fontSize: 16,
      color: colors.text,
    },
  });

  const courseDisplayName = courseSettings?.displayName || props.course.name;

  const courseGlyph = courseSettings?.glyph || undefined;

  const swipeRef = React.useRef<Swipeable>(null);

  const { oldState, baseGradingPeriod } = useSelector(
    (state: RootState) => {
      return {
        oldState: state.oldCourseStates.record[props.course.key],
        baseGradingPeriod: state.gradeData.record?.gradeCategory,
      };
    },
    (prevState, newState) => {
      return JSON.stringify(prevState) === JSON.stringify(newState);
    }
  );

  const [hasNewGrades, setHasNewGrades] = useState(false);

  useEffect(() => {
    const newState = captureCourseState(props.course);

    const newGrades: ChangeTableEntry[] = newState.categories
      .map((newCategory): ChangeTableEntry[] => {
        const oldCategory = oldState.categories.find(
          (c) => c.name === newCategory.name
        );

        const newGrades = newCategory.assignments.filter(
          (g) =>
            !oldCategory?.assignments.find(
              (og) => og.name === g.name && og.grade === g.grade
            ) && g.grade !== ""
        );

        return newGrades.map((g) => ({
          assignmentName: g.name,
          primaryData: g.grade,
          secondaryData: newCategory.name,
        }));
      })
      .flat();

    const removedGrades = oldState.categories.map(
      (oldCategory): ChangeTableEntry[] => {
        const newCategory = newState.categories.find(
          (c) => c.name === oldCategory.name
        );

        const removedGrades = oldCategory.assignments.filter(
          (g) => !newCategory?.assignments.find((og) => og.name === g.name)
        );

        return removedGrades.map((g) => ({
          assignmentName: g.name,
          primaryData: "Removed",
          secondaryData: oldCategory.name,
        }));
      }
    );

    const oldAverage = oldState.average;
    const newAverage = newState.average;

    const changes = {
      changed:
        props.gradingPeriod === baseGradingPeriod &&
        (oldAverage !== newAverage ||
          newGrades.length > 0 ||
          removedGrades.find((l) => l.length > 0) != undefined),
      oldAverage,
      newAverage,
      newGrades,
      removedGrades,
    };
    props.setGradeChanges(changes);

    setHasNewGrades(changes.changed);
  }, [oldState, props.course]);

  const inner = (
    <>
      <View style={styles.left}>
        <View style={styles.badge}>
          {courseGlyph ? (
            <MaterialCommunityIcons
              // @ts-ignore

              name={courseGlyph}
              size={24}
              color={"#FFFFFF"}
            />
          ) : (
            <></>
          )}
        </View>
        <MediumText
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={styles.header}
        >
          {courseDisplayName}
        </MediumText>
      </View>
      <SmallText style={styles.grade}>
        {hasNewGrades
          ? "New Grades"
          : props.course.grades[props.gradingPeriod]?.value ?? "NG"}
      </SmallText>
    </>
  );

  const hidden = courseSettings?.hidden ?? false;

  const [show, setShow] = useState(!hidden);
  const [_, setPlayedVibration] = useState(false);

  const heightAnimation = React.useRef(
    new Animated.Value(hidden ? 0 : 1)
  ).current;
  const [hiding, setHiding] = useState(hidden);
  useEffect(() => setHiding(hidden), [hidden]);

  // useEffect(() => {
  //   const duration = 200;
  //   if (hiding) {
  //     Animated.timing(heightAnimation, {
  //       toValue: 0,
  //       duration,
  //       useNativeDriver: false,
  //     }).start(() => {
  //       setShow(false);
  //       if (!hidden) {
  //         setTimeout(() => {
  //           dispatch(
  //             setCourseSetting({
  //               key: props.course.key,
  //               save: "STATE",
  //               value: { hidden: true },
  //             })
  //           );
  //         }, duration);
  //       }
  //     });
  //   } else {
  //     Animated.timing(heightAnimation, {
  //       toValue: 1,
  //       duration,
  //       useNativeDriver: false,
  //     }).start(() => {
  //       setTimeout(() => {
  //         setShow(true);
  //         Storage.getItem({ key: "courseSettings" }).then((res) => {
  //           if (res) {
  //             const settings = JSON.parse(res);
  //             dispatch(
  //               setCourseSetting({
  //                 key: props.course.key,
  //                 save: "STATE",
  //                 value: settings[props.course.key],
  //               })
  //             );
  //           }
  //         });
  //       }, duration);
  //     });
  //   }
  // }, [hiding]);
  return (
    <Animated.View
      style={{
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={props.onClick}
        onLongPress={props.onHold}
        style={{
          marginBottom: 10,
        }}
      >
        <View>
          {hasNewGrades ? (
            <LinearGradient
              colors={[
                colors.card,
                colorLib(
                  color.AccentsMatrix[accentLabel][dark ? "dark" : "default"]
                    .gradientCenter
                )
                  .mix(colorLib(colors.card), 0.5)
                  .hex(),
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.wrapper,
                {
                  opacity: show ? 1 : 0,
                },
              ]}
            >
              {inner}
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.wrapper,
                { backgroundColor: colors.card, opacity: show ? 1 : 0 },
              ]}
            >
              {inner}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
