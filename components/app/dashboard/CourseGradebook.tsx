import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Assignment,
  Course,
  DataContext,
  GradeCategoriesResponse,
} from "scorecard-types";
import GradebookCategory from "./GradebookCategory";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { fetchGradeCategoriesForCourse } from "../../../lib/fetcher";
import { MotiView } from "moti";
import AssignmentInspector from "./AssignmentInspector";
import { formatCourseFromAssignmentPoints } from "../../../lib/gradeTesting";

export type HighlightedAssignment = {
  assignment: Assignment;
  categoryIndex: number;
  assignmentIndex: number;
};

export default function CourseGradebook(props: {
  courseId: string;
  currentGradingPeriod: number;
}) {
  const [modifiedCourse, setModifiedCourse] = useState<Course | undefined>(
    undefined
  );

  const mobileData = useContext(MobileDataContext);
  const data = useContext(DataContext);

  useEffect(() => {
    const course = JSON.parse(
      JSON.stringify(data.data.courses.find((c) => c.key === props.courseId))
    );

    if (course?.gradeCategories) {
      setModifiedCourse(course);
    } else {
      // if (mobileData.referer && mobileData.sessionId) {
      //   fetchGradeCategoriesForCourse(
      //     mobileData.district,
      //     mobileData.sessionId,
      //     mobileData.referer,
      //     course
      //   ).then((categoriesResp: GradeCategoriesResponse) => {
      //     setModifiedCourse({
      //       ...course,
      //       gradeCategories: categoriesResp.gradeCategories,
      //     });
      //     data.setData({
      //       ...data.data,
      //       courses: data.data.courses.map((c) => {
      //         if (c.key === course.key) {
      //           return {
      //             ...c,
      //             gradeCategories: categoriesResp.gradeCategories,
      //           };
      //         }
      //         return c;
      //       }),
      //     });
      //   });
      // }
    }
  }, [props.courseId]);

  const [highlight, setHighlight] = useState<HighlightedAssignment | undefined>(
    undefined
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{modifiedCourse?.name}</Text>
        <Text>
          Average:{" "}
          {modifiedCourse?.grades[props.currentGradingPeriod]?.value ?? "N/A"}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {modifiedCourse?.gradeCategories.map((category, index) => {
          return (
            <GradebookCategory
              category={category}
              key={index}
              inHighlightView={highlight?.assignment !== undefined}
              setHighlight={(assignment, assignmentIdx) => {
                setHighlight({
                  assignment,
                  categoryIndex: index,
                  assignmentIndex: assignmentIdx,
                });
              }}
            />
          );
        })}
      </ScrollView>

      <AssignmentInspector
        close={() => {
          console.log("close");

          setHighlight(undefined);
        }}
        assignment={highlight?.assignment}
        setAssignment={(assignment) => {
          setModifiedCourse((prevCourse) => {
            const newCourse = { ...prevCourse };

            newCourse.gradeCategories[highlight.categoryIndex].assignments[
              highlight.assignmentIndex
            ] = assignment;

            return formatCourseFromAssignmentPoints(
              newCourse,
              props.currentGradingPeriod
            );
          });

          setHighlight((prevHighlight) => {
            if (prevHighlight) {
              return {
                ...prevHighlight,
                assignment,
              };
            }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 0,
    position: "relative",
    maxHeight: "100%",
  },
  headerText: {
    fontSize: 24,
  },
  header: {
    paddingBottom: 15,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  list: {
    height: "100%",
  },
});
