import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  const [modifiedCourse, setModifiedCourse] = useState(undefined);

  const mobileData = useContext(MobileDataContext);
  const data = useContext(DataContext);

  useEffect(() => {
    const course = data.data.courses.find((c) => c.key === props.courseId);

    if (course?.gradeCategories) {
      setModifiedCourse(course);
    } else {
      if (mobileData.referer && mobileData.sessionId) {
        fetchGradeCategoriesForCourse(
          mobileData.district,
          mobileData.sessionId,
          mobileData.referer,
          course
        ).then((categoriesResp: GradeCategoriesResponse) => {
          setModifiedCourse({
            ...course,
            gradeCategories: categoriesResp.gradeCategories,
          });

          data.setData({
            ...data.data,
            courses: data.data.courses.map((c) => {
              if (c.key === course.key) {
                return {
                  ...c,
                  gradeCategories: categoriesResp.gradeCategories,
                };
              }
              return c;
            }),
          });
        });
      }
    }
  }, [props.courseId]);

  const [highlight, setHighlight] = useState<HighlightedAssignment | undefined>(
    undefined
  );

  return (
    <View style={styles.wrapper}>
      <Text>Current Gradebook</Text>

      {modifiedCourse?.gradeCategories?.map((category, idx) => {
        return (
          <GradebookCategory
            category={category}
            key={idx}
            inHighlightView={highlight?.assignment !== undefined}
            setHighlight={(assignment, assignmentIdx) => {
              setHighlight({
                assignment,
                categoryIndex: idx,
                assignmentIndex: assignmentIdx,
              });
            }}
          />
        );
      })}

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
    paddingBottom: 20,
    position: "relative",
  },
});
