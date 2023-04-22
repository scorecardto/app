import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Course, DataContext, GradeCategoriesResponse } from "scorecard-types";
import GradebookCategory from "./GradebookCategory";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { fetchGradeCategoriesForCourse } from "../../../lib/fetcher";
import { MotiView } from "moti";

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

  const [childHighlighted, setChildHighlighted] = useState(false);
  return (
    <View style={styles.wrapper}>
      <Text>Current Gradebook</Text>

      {modifiedCourse?.gradeCategories?.map((category, idx) => {
        return (
          <GradebookCategory
            category={category}
            key={idx}
            hiddenFromOtherHighlight={childHighlighted}
            onHighlight={setChildHighlighted}
          />
        );
      })}

      <MotiView
        style={[styles.inspector]}
        animate={{
          translateY: childHighlighted ? 0 : 300,
        }}
        transition={{
          type: "timing",
          duration: 500,
        }}
      ></MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 20,
    position: "relative",
  },
  inspector: {
    zIndex: 20,
    position: "absolute",
    height: 300,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ebf5ff",
  },
});
