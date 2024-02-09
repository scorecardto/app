import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  AppState,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavigationProp } from "@react-navigation/native";
import { Course, DataContext } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
// import CourseGradebook from "../app/dashboard/preview/CourseGradebook";
import Storage from "expo-storage";
import * as Haptics from "expo-haptics";
import { fetchAllContent } from "../../lib/fetcher";
import { MobileDataContext } from "../core/context/MobileDataContext";
import Header from "../text/Header";
import fetchAndStore from "../../lib/fetchAndStore";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import GradeCategorySelectorSheet from "../app/dashboard/GradeCategorySelectorSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import useFooterHeight from "../util/hooks/useFooterHeight";
import HeaderBanner from "../text/HeaderBanner";
import InviteOthersCard from "../app/dashboard/InviteOthersCard";
import MoreFeaturesSheet from "../app/vip/MoreFeaturesSheet";
import parseCourseKey from "../../lib/parseCourseKey";
import captureCourseState from "../../lib/captureCourseState";
import RefreshIndicator from "../app/dashboard/RefreshIndicator";
import RefreshStatus from "../../lib/types/RefreshStatus";
import { getFeatureFlag } from "../../lib/featureFlag";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";

const CurrentGradesScreen = (props: {
  navigation: NavigationProp<any, any>;
}) => {
  const dataContext = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  const district = useSelector((state: RootState) => state.login.district);
  const username = useSelector((state: RootState) => state.login.username);
  const password = useSelector((state: RootState) => state.login.password);

  const dispatch = useDispatch<AppDispatch>();

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

      if (mins <= 0) return `Your grades are fresh out of the oven`;
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

  // console.log('rendering CurrentGradesScreen');
  // useEffect(() => {
  //   console.log('adding listener');
  //   AppState.addEventListener("change", (nextAppState) => {
  //     console.log(nextAppState, refreshing);
  //     if (nextAppState === "active") {
  //       if (refreshing) {
  //         console.log('onRefresh');
  //         onRefresh();
  //       }
  //     }
  //   });
  // }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const reportCard = fetchAllContent(
      district,
      username,
      password,
      undefined,
      (s: RefreshStatus) => {
        mobileData.setRefreshStatus(s);
      }
    );

    reportCard.then(async (data) => {
      await fetchAndStore(data, dataContext, mobileData, dispatch, false);
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

  const [showRefreshControl, setShowRefreshControl] = useState(false);

  const MINS_TO_REFRESH = 60;

  useEffect(() => {
    const lastUpdated = dataContext.data?.date;
    if (refreshing || !lastUpdated) return;

    const mins = Math.floor((Date.now() - lastUpdated) / 1000 / 60);

    if (mins > MINS_TO_REFRESH) {
      onRefresh();
    }
  }, [currentTime, dataContext.data?.date, refreshing, showRefreshControl]);

  const shownCourses = useMemo(() => {
    if (!dataContext.data?.courses) return [];

    return dataContext.data?.courses.filter((course) => {
      const hidden = dataContext.courseSettings[course.key]?.hidden;

      return !hidden;
    });
  }, [dataContext.data?.courses, dataContext.courseSettings]);

  const oldShownCourses = useRef(shownCourses);

  const [updateIndex, setUpdateIndex] = useState(0);
  const changeIndex = useMemo(() => {
    const old = oldShownCourses.current;
    const current = shownCourses;

    // console.log(JSON.stringify(old) === JSON.stringify(current));

    let index = -1;

    for (let i = 0; i < (dataContext.data?.courses?.length || 0); i++) {
      const key = dataContext.data?.courses?.[i]?.key;
      const inOld = old.find((c) => c.key === key);
      const inCurrent = current.find((c) => c.key === key);

      if (inOld && !inCurrent) {
        index = i;
        break;
      }
      if (!inOld && inCurrent) {
        oldShownCourses.current = shownCourses;
        setUpdateIndex(updateIndex + 1);
        return;
      }
    }

    return index;
  }, [shownCourses, updateIndex]);

  const translateY = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (changeIndex === -1) {
      translateY.setValue(0);
      return;
    }

    Animated.timing(translateY, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      oldShownCourses.current = shownCourses;
      setUpdateIndex(updateIndex + 1);
    });
  }, [changeIndex]);

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
            <RefreshControl
              style={refreshing && !showRefreshControl ? { opacity: 0 } : {}}
              refreshing={showRefreshControl}
              onRefresh={() => {
                if (refreshing) return;

                setShowRefreshControl(true);
                onRefresh();

                setTimeout(() => {
                  setShowRefreshControl(false);
                }, 100);
              }}
            />
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
                    ? lastUpdatedHeader ?? "No Data"
                    : onCurrentGradingPeriod
                    ? "Your Scorecard"
                    : dataContext.data?.gradeCategoryNames[
                        dataContext.gradeCategory
                      ] ?? "Other Grading Period"
                }
                subheader={
                  showLastUpdated
                    ? updatedSubheader ?? "No Data"
                    : onCurrentGradingPeriod
                    ? dataContext.data?.gradeCategoryNames[
                        dataContext.gradeCategory || 0
                      ]
                    : "Tap to change grading period"
                }
              />
            </TouchableOpacity>

            <InviteOthersCard
              show={getFeatureFlag("SHOW_CUSTOMIZE_CARD", mobileData.userRank)}
            />

            {dataContext?.data?.courses && (
              <FlatList
                style={{
                  paddingBottom: 66,
                }}
                scrollEnabled={false}
                data={dataContext.data?.courses.sort((a: Course, b: Course) => {
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
                renderItem={({ item, index }) => {
                  const hidden = dataContext.courseSettings[item.key]?.hidden;

                  if (hidden) return null;

                  return (
                    <Animated.View
                      style={
                        changeIndex !== -1 && index > changeIndex
                          ? {
                              transform: [
                                {
                                  translateY: translateY.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [66, 0],
                                  }),
                                },
                              ],
                            }
                          : []
                      }
                    >
                      <CourseCard
                        onClick={() => {
                          props.navigation.navigate("course", {
                            key: item.key,
                          });
                        }}
                        newGrades={
                          mobileData.oldCourseStates[item.key] &&
                          JSON.stringify(
                            mobileData.oldCourseStates[item.key]
                          ) !== JSON.stringify(captureCourseState(item))
                        }
                        onHold={() => {}}
                        course={item}
                        gradingPeriod={dataContext.gradeCategory || 0}
                      />
                    </Animated.View>
                  );
                }}
                keyExtractor={(item) => item.key}
              />
            )}

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
            <GradeCategorySelectorSheet ref={selector} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CurrentGradesScreen;
