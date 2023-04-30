import { View, Text, Button } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Course, DataContext, GradebookRecord } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import CourseGradebook from "../app/dashboard/CourseGradebook";
import { Storage } from "expo-storage";
import * as Haptics from "expo-haptics";

const ScorecardScreen = (props: { navigation: NavigationProp<any, any> }) => {
  const data = useContext(DataContext);

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const [openedCourseId, setOpenedCourseId] = useState(null as string | null);

  return (
    <View>
      <ActionSheet ref={actionSheetRef}>
        {openedCourseId && (
          <CourseGradebook
            courseId={openedCourseId}
            currentGradingPeriod={data.data.gradeCategory}
          />
        )}
      </ActionSheet>

      {data?.data?.courses &&
        data.data.courses.map((course, idx) => {
          return (
            <CourseCard
              onClick={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                actionSheetRef.current?.show();
                setOpenedCourseId(course.key);
              }}
              key={idx}
              course={course}
              gradingPeriod={data.data.gradeCategory}
            />
          );
        })}

      <Button
        title="Reset Cache"
        onPress={() => {
          Storage.removeItem({
            key: "data",
          });
        }}
      />
    </View>
  );
};

export default ScorecardScreen;
