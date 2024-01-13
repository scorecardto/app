import {
  View,
  Text,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Course, DataContext, GradebookRecord } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
// import CourseGradebook from "../app/dashboard/preview/CourseGradebook";
import Storage from "expo-storage";
import * as Haptics from "expo-haptics";
import { fetchAllContent } from "../../lib/fetcher";
import { MobileDataContext } from "../core/context/MobileDataContext";
import LargeText from "../text/LargeText";
import StatusText from "../text/StatusText";
import Header from "../text/Header";
import fetchAndStore from "../../lib/fetchAndStore";

const CurrentGradesScreen = (props: {
  navigation: NavigationProp<any, any>;
}) => {
  const dataContext = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  const [openedCourseId, setOpenedCourseId] = useState(null as string | null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const url = mobileData.district;
    const username = mobileData.username;
    const password = mobileData.password;

    const reportCard = fetchAllContent(url, username, password);

    reportCard.then(async (data) => {
      await fetchAndStore(data, mobileData, dataContext);
      setRefreshing(false);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header header="Your Scorecard" subheader="Your Grades" />

      <TouchableOpacity
        onPress={() => {
          Storage.getItem({ key: "records" })
              .then(async (records) => {
                if (!records) return;
                await Storage.setItem({ key: "records", value: JSON.stringify(JSON.parse(records).slice(0, 1)) })
              })
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
          }}
        >
          Clear Record History
        </Text>
      </TouchableOpacity>

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
              onHold={() => {}}
              course={item}
              gradingPeriod={dataContext.data?.gradeCategory || 0}
            />
          )}
          keyExtractor={(item) => item.key}
        />
      )}

      {/* <ActionSheet ref={actionSheetRef} containerStyle={{ height: "80%" }}> */}
      {/* {openedCourseId && (
          // <CourseGradebook
          //   courseId={openedCourseId}
          //   currentGradingPeriod={dataContext.data.gradeCategory}
          // />
        )} */}
      {/* </ActionSheet> */}

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
    </View>
  );
};

export default CurrentGradesScreen;
