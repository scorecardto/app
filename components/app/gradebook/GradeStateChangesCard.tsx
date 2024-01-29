import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import { useTheme } from "@react-navigation/native";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import captureCourseState from "../../../lib/captureCourseState";
import TableRow from "./TableRow";
import { useMemo } from "react";

type ChangeTableEntry = {
  assignmentName: string;
  primaryData: string;
  secondaryData: string;
};

export default function GradeStateChangesCard(props: {
  course: Course;
  onFinished: () => void;
}) {
  const { colors, accents } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      maxHeight: 500,
      marginHorizontal: 24,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      fontSize: 20,
      color: colors.primary,
      flex: 1,
    },
    headerGrade: {
      fontSize: 17,
      color: colors.primary,
      marginLeft: 6,
    },
    footer: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
      paddingHorizontal: 24,
    },
    footerLeft: {
      flexDirection: "column",
    },
    footerText: {
      marginTop: 4,
      fontSize: 14,
      color: colors.text,
    },
    buttonText: {
      fontSize: 16,
      color: accents.primary,
    },
    buttonWrapper: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 12,
      alignSelf: "center",
      backgroundColor: accents.secondary,
    },
  });

  const mobileDataContext = useContext(MobileDataContext);

  const oldState = useMemo(
    () => mobileDataContext.oldCourseStates[props.course.key],
    []
  );
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
          )
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

  return (
    <View>
      <ScrollView style={styles.wrapper}>
        <View style={styles.header}>
          <MediumText
            numberOfLines={2}
            ellipsizeMode={"tail"}
            style={styles.headerText}
          >
            New Grades
          </MediumText>
          <TouchableOpacity
            onPress={() => {
              props.onFinished();
            }}
          >
            <View style={styles.buttonWrapper}>
              <MediumText style={styles.buttonText}>{"Done"}</MediumText>
            </View>
          </TouchableOpacity>
        </View>
        {[newGrades, removedGrades].flat(2).map((g: ChangeTableEntry, idx) => (
          <TableRow
            key={idx}
            name={g.assignmentName}
            grade={g.primaryData}
            worth={g.secondaryData}
          />
        ))}
      </ScrollView>
    </View>
  );
}
