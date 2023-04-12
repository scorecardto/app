import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Course, DataContext, GradeCategoriesResponse } from "scorecard-types";
import GradebookCategory from "./GradebookCategory";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { fetchGradeCategoriesForCourse } from "../../../lib/fetcher";

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

  return (
    <View style={styles.wrapper}>
      <Text>Current Gradebook</Text>

      {modifiedCourse?.gradeCategories?.map((category, idx) => {
        return <GradebookCategory category={category} key={idx} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 20,
  },
});
