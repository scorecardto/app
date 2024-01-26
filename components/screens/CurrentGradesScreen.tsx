import {FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View,} from "react-native";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {NavigationProp} from "@react-navigation/native";
import {Course, DataContext} from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
// import CourseGradebook from "../app/dashboard/preview/CourseGradebook";
import Storage from "expo-storage";
import * as Haptics from "expo-haptics";
import {fetchAllContent} from "../../lib/fetcher";
import {MobileDataContext} from "../core/context/MobileDataContext";
import Header from "../text/Header";
import fetchAndStore from "../../lib/fetchAndStore";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import GradeCategorySelectorSheet from "../app/dashboard/GradeCategorySelectorSheet";
import {ActionSheetRef} from "react-native-actions-sheet";
import {SafeAreaView} from "react-native-safe-area-context";
import useFooterHeight from "../util/hooks/useFooterHeight";
import HeaderBanner from "../text/HeaderBanner";
import InviteOthersCard from "../app/dashboard/InviteOthersCard";
import MoreFeaturesSheet from "../app/vip/MoreFeaturesSheet";
import parseCourseKey from "../../lib/parseCourseKey";

const CurrentGradesScreen = (props: {
  navigation: NavigationProp<any, any>;
}) => {
  const dataContext = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  const [openedCourseId, setOpenedCourseId] = useState(null as string | null);

  const [refreshing, setRefreshing] = useState(false);

  const [currentTime, setCurrentTime] = useState(Date.now());
  const lastUpdatedHeader = useMemo(() => {
    if (!dataContext.data) return null;

    const lastUpdated = dataContext.data.date;
    const now = currentTime;

    if (!lastUpdated) return "No Data";

    if (now - lastUpdated < 1000 * 60 * 10) {
      return "Up To Date";
    }

    return "Pull To Refresh";
  }, [dataContext.data?.date, currentTime]);

  const updatedSubheader = useMemo(() => {
    if (!dataContext.data) return null;

    const lastUpdated = dataContext.data.date;
    const now = currentTime;

    if (!lastUpdated) return "No Data";

    if (now - lastUpdated < 1000 * 60 * 60) {
      const mins = Math.floor((now - lastUpdated) / 1000 / 60);

      if (mins === 0) return `Your grades are fresh out of the oven`;
      return `Updated ${mins} minute${mins === 1 ? "" : "s"} ago`;
    }

    if (now - lastUpdated < 1000 * 60 * 60 * 24) {
      return `Updated ${Math.floor(
        (now - lastUpdated) / 1000 / 60 / 60
      )} hours ago`;
    }

    if (now - lastUpdated < 1000 * 60 * 60 * 24 * 2) {
      return "Updated yesterday";
    }

    if (now - lastUpdated < 1000 * 60 * 60 * 24 * 7) {
      return `Updated ${Math.floor(
        (now - lastUpdated) / 1000 / 60 / 60 / 24
      )} days ago`;
    }

    return `Updated on ${new Date(lastUpdated).toLocaleDateString()}`;
  }, [dataContext.data?.date, currentTime]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const url = mobileData.district;
    const username = mobileData.username;
    const password = mobileData.password;

    const reportCard = fetchAllContent(url, username, password);

    reportCard.then(async (data) => {
      await fetchAndStore(data, mobileData, dataContext, true, false);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
    };
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

  const showLastUpdated = scrollProgress < -80 && !refreshing;

  useEffect(() => {
    if (showLastUpdated || refreshing) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [showLastUpdated, refreshing]);
  const sheets = useContext(BottomSheetContext);

  return (
    <>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                  showLastUpdated
                    ? lastUpdatedHeader
                    : onCurrentGradingPeriod
                    ? "Your Scorecard"
                    : dataContext.data?.gradeCategoryNames[
                        dataContext.gradeCategory
                      ] ?? "Other Grading Period"
                }
                subheader={
                  showLastUpdated
                    ? updatedSubheader
                    : onCurrentGradingPeriod
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
                onClick={() => {
                  sheets?.addSheet(() => {
                    return <MoreFeaturesSheet />;
                  });
                }}
                onHold={() => {}}
              />
            )}
            {dataContext?.data?.courses && (
              <FlatList
                scrollEnabled={false}
                data={dataContext.data.courses.sort((a: Course, b: Course) => {
                  const aPrd = parseCourseKey(a.key)?.dayCodeIndex;
                  const bPrd = parseCourseKey(b.key)?.dayCodeIndex;

                  if (aPrd && bPrd) {
                    if (aPrd > bPrd) return 1;
                    if (aPrd < bPrd) return -1;
                  } else if (aPrd) {
                    return -1;
                  } else if (bPrd) {
                    return 1;
                  } else {
                    return a.key.localeCompare(b.key);
                  }

                  return 0;
                })}
                renderItem={({ item }) => (
                  <CourseCard
                    onClick={() => {
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
                  // if (!records) return;
                  // await Storage.setItem({
                  //   key: "records",
                  //   value: JSON.stringify(JSON.parse(records).slice(0, 1)),
                  // });
                  await Storage.removeItem({ key: "records" });
                  await Storage.removeItem({ key: "login" });
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
    </>
  );
};

export default CurrentGradesScreen;
