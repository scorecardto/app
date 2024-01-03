import {
  View,
  Text,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Course, DataContext, GradebookRecord } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
// import CourseGradebook from "../app/dashboard/preview/CourseGradebook";
import { Storage } from "expo-storage";
import * as Haptics from "expo-haptics";
import { fetchAllContent } from "../../lib/fetcher";
import { MobileDataContext } from "../core/context/MobileDataContext";
import LargeText from "../text/LargeText";
import StatusText from "../text/StatusText";
import Header from "../text/Header";
import * as SMS from "expo-sms";

const ScorecardScreen = (props: { navigation: NavigationProp<any, any> }) => {
  const dataContext = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const [openedCourseId, setOpenedCourseId] = useState(null as string | null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const url = mobileData.district;
    const username = mobileData.username;
    const password = mobileData.password;

    const reportCard = fetchAllContent(url, username, password);

    reportCard.then(async (data) => {
      const gradeCategory =
        Math.max(
          ...data.courses.map((course) => course.grades.filter((g) => g).length)
        ) - 1;

      mobileData.setReferer(data.referer);
      mobileData.setSessionId(data.sessionId);
      mobileData.setDistrict(url);

      dataContext.setData({
        courses: data.courses,
        gradeCategory,
        date: Date.now(),
        gradeCategoryNames: data.gradeCategoryNames,
      });

      await Storage.setItem({
        key: "data",
        value: JSON.stringify({
          courses: data.courses,
          gradeCategory,
          date: Date.now(),
          gradeCategoryNames: data.gradeCategoryNames,
        }),
      });

      setRefreshing(false);
    });
  }, []);

  return (
    <View>
      <Header header="Your Scorecard" subheader="Your Grades" />

      {dataContext?.data?.courses && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={dataContext.data.courses}
          renderItem={({ item }) => (
            <CourseCard
              onClick={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                props.navigation.navigate("course", {
                  key: item.key,
                });
              }}
              onHold={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setOpenedCourseId(item.key);
                actionSheetRef.current.show();
              }}
              course={item}
              gradingPeriod={dataContext.data.gradeCategory}
            />
          )}
          keyExtractor={(item) => item.key}
        />
      )}

      <ActionSheet ref={actionSheetRef} containerStyle={{ height: "80%" }}>
        {/* {openedCourseId && (
          // <CourseGradebook
          //   courseId={openedCourseId}
          //   currentGradingPeriod={dataContext.data.gradeCategory}
          // />
        )} */}
      </ActionSheet>

      {/*

      {dataContext?.data?.courses && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={dataContext.data.courses}
          renderItem={({ item }) => (
            <CourseCard
              onClick={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                actionSheetRef.current?.show();
                setOpenedCourseId(item.key);
              }}
              course={item}
              gradingPeriod={dataContext.data.gradeCategory}
            />
          )}
          keyExtractor={(item) => item.key}
        />
      )}
*/}
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
