import {
  View,
  Text,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import GradeCategorySelectorSheet from "../app/dashboard/GradeCategorySelectorSheet";
import BottomSheetDisplay from "../util/BottomSheet/BottomSheetDisplay";
import { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import useFooterHeight from "../util/hooks/useFooterHeight";
import HeaderBanner from "../text/HeaderBanner";
import InviteOthersCard from "../app/dashboard/InviteOthersCard";

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

  const selector = useRef<ActionSheetRef>(null);

  useEffect(() => {
    setTimeout(() => {
      selector.current?.hide();
    }, 10);
  }, [dataContext.gradeCategory]);

  const onCurrentGradingPeriod =
    dataContext.gradeCategory === dataContext.data?.gradeCategory;

  const footerHeight = useFooterHeight();

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <HeaderBanner
        label={
          dataContext.data?.gradeCategoryNames[dataContext.gradeCategory] ??
          "Your Scorecard"
        }
        show={scrollProgress > 80}
        onPress={() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }}
      />
      <ScrollView
        style={{ height: "100%" }}
        ref={scrollViewRef}
        onScroll={(e) => {
          setScrollProgress(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <View
          style={{
            paddingBottom: footerHeight + 32,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              selector.current?.show();
            }}
          >
            <Header
              header={
                onCurrentGradingPeriod
                  ? "Your Scorecard"
                  : dataContext.data?.gradeCategoryNames[
                      dataContext.gradeCategory
                    ] ?? "Other Grading Period"
              }
              subheader={
                onCurrentGradingPeriod
                  ? dataContext.data?.gradeCategoryNames[
                      dataContext.gradeCategory || 0
                    ]
                  : "Tap to change grading period"
              }
            />
          </TouchableOpacity>

          {mobileData.userRank === "DEFAULT" && (
            <InviteOthersCard
              invitesLeft={3}
              onClick={() => {}}
              onHold={() => {}}
            />
          )}
          {dataContext?.data?.courses && (
            <FlatList
              scrollEnabled={false}
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
                  gradingPeriod={dataContext.gradeCategory || 0}
                />
              )}
              keyExtractor={(item) => item.key}
            />
          )}

          <TouchableOpacity
            onPress={() => {
              Storage.getItem({ key: "records" }).then(async (records) => {
                if (!records) return;
                await Storage.setItem({
                  key: "records",
                  value: JSON.stringify(JSON.parse(records).slice(0, 1)),
                });
              });
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
          <GradeCategorySelectorSheet ref={selector} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CurrentGradesScreen;
