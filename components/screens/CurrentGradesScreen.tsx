import { NavigationProp } from "@react-navigation/native";

import { ScrollView, View } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "../app/dashboard/CourseCard";
import { Course } from "scorecard-types";
import PageThemeProvider from "../core/context/PageThemeProvider";
import Background from "../util/Background";
import DashboardToolbar from "../app/dashboard/DashboardToolbar";
export default function CurrentGradesScreen(props: {
  navigation: NavigationProp<any>;
}) {
  const dispatch = useDispatch();

  const courses = useSelector(
    (s: RootState) =>
      s.gradeData.record?.courses?.filter?.(
        (c) => !s.courseSettings?.[c.key]?.hidden
      ) || [],
    (p: Course[], n: Course[]) => JSON.stringify(p) === JSON.stringify(n)
  );

  const currentGradeCategory = useSelector(
    (s: RootState) => s.gradeCategory.category
  );

  return (
    <PageThemeProvider
      theme={{
        default: {
          background: "#EDF6FF",
          border: "#FFF2F8",
        },
      }}
    >
      <Background>
        <ScrollView
          style={{
            height: "100%",
          }}
        >
          <DashboardToolbar />
          {courses && (
            <FlatList
              scrollEnabled={false}
              data={courses}
              renderItem={({ item, index }) => {
                return (
                  <CourseCard
                    course={item}
                    gradingPeriod={currentGradeCategory}
                    onClick={() =>
                      props.navigation.navigate("course", {
                        key: item.key,
                        gradeCategory: currentGradeCategory
                      })
                    }
                    onHold={() => {}}
                  />
                );
              }}
              keyExtractor={(item) => item.key}
            />
          )}
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
