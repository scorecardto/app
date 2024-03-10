import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Course } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
import * as Haptics from "expo-haptics";
import { fetchAllContent } from "../../lib/fetcher";
import Header from "../text/Header";
import fetchAndStore from "../../lib/fetchAndStore";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import GradeCategorySelectorSheet from "../app/dashboard/GradeCategorySelectorSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import useFooterHeight from "../util/hooks/useFooterHeight";
import HeaderBanner from "../text/HeaderBanner";
import InviteOthersCard from "../app/dashboard/InviteOthersCard";
import parseCourseKey from "../../lib/parseCourseKey";
import captureCourseState from "../../lib/captureCourseState";
import RefreshStatus from "../../lib/types/RefreshStatus";
import { useFeatureFlag } from "../../lib/featureFlag";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../core/state/store";
import { setRefreshStatus } from "../core/state/grades/refreshStatusSlice";
import { getAnalytics } from "@react-native-firebase/analytics";
import {ChangeTable, ChangeTableEntry} from "../../lib/types/ChangeTableEntry";
import Button from "../input/Button";
import DraggableComponent from "../util/DraggableComponent";
import {setCourseOrder} from "../core/state/grades/courseOrderSlice";
import {updateCourseOrder} from "../core/state/widget/widgetSlice";

const CurrentGradesScreen = (props: {
  navigation: NavigationProp<any, any>;
}) => {
  const district = useSelector((state: RootState) => state.login.district);
  const username = useSelector((state: RootState) => state.login.username);
  const password = useSelector((state: RootState) => state.login.password);

  const dispatch = useDispatch<AppDispatch>();

  const [openedCourseId, setOpenedCourseId] = useState(null as string | null);

  const [refreshing, setRefreshing] = useState(false);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const lastRecordDate = useSelector(
    (state: RootState) => state.gradeData.record?.date
  );

  const currentGradeCategory = useSelector(
    (state: RootState) => state.gradeCategory.category
  );

  const recordGradeCategory = useSelector(
    (state: RootState) => state.gradeData.record?.gradeCategory
  );

  const courses = useSelector(
    (state: RootState) => state.gradeData.record?.courses
  );

  const courseSettings = useSelector(
    (state: RootState) => state.courseSettings
  );

  const gradeCategoryNames = useSelector(
    (state: RootState) => state.gradeData.record?.gradeCategoryNames
  );
  const lastUpdatedHeader = useMemo(() => {
    if (!lastRecordDate) return "No Data";

    const now = currentTime;

    if (!lastRecordDate) return "No Data";

    if (now - lastRecordDate < 1000 * 60 * 10) {
      return "Up To Date";
    }

    return "Pull To Refresh";
  }, [lastRecordDate, currentTime]);

  const updatedSubheader = useMemo(() => {
    if (!lastRecordDate) return "No Data";

    const now = currentTime;

    if (!lastRecordDate) return "No Data";

    if (now - lastRecordDate < 1000 * 60 * 60) {
      const mins = Math.floor((now - lastRecordDate) / 1000 / 60);

      if (mins <= 0) return `Your grades are fresh out of the oven`;
      return `Updated ${mins} minute${mins === 1 ? "" : "s"} ago`;
    }

    if (now - lastRecordDate < 1000 * 60 * 60 * 24) {
      return `Updated ${Math.floor(
        (now - lastRecordDate) / 1000 / 60 / 60
      )} hours ago`;
    }

    if (now - lastRecordDate < 1000 * 60 * 60 * 24 * 2) {
      return "Updated yesterday";
    }

    if (now - lastRecordDate < 1000 * 60 * 60 * 24 * 7) {
      return `Updated ${Math.floor(
        (now - lastRecordDate) / 1000 / 60 / 60 / 24
      )} days ago`;
    }

    return `Updated on ${new Date(lastRecordDate).toLocaleDateString()}`;
  }, [lastRecordDate, currentTime]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const reportCard = fetchAllContent(
      district,
      username,
      password,
      undefined,
      (s: RefreshStatus) => {
        dispatch(setRefreshStatus(s));
      }
    );

    reportCard.then(async (data) => {
      await fetchAndStore(data, dispatch, false);
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
  }, [currentGradeCategory]);

  const onCurrentGradingPeriod =
    currentGradeCategory === recordGradeCategory || !recordGradeCategory;

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
    if (refreshing || !lastRecordDate) return;

    const mins = Math.floor((Date.now() - lastRecordDate) / 1000 / 60);

    if (mins > MINS_TO_REFRESH) {
      onRefresh();
    }
  }, [currentTime, lastRecordDate, refreshing, showRefreshControl]);

  const shownCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const hidden = courseSettings[course.key]?.hidden;

      return !hidden;
    });
  }, [courseSettings, courses]);

  const oldShownCourses = useRef(shownCourses);

  const [updateIndex, setUpdateIndex] = useState(0);
  const changeIndex = useMemo(() => {
    const old = oldShownCourses.current;
    const current = shownCourses;

    // console.log(JSON.stringify(old) === JSON.stringify(current));

    let index = -1;

    for (let i = 0; i < (courses?.length || 0); i++) {
      const key = courses?.[i]?.key;
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

  const showCustomizeCard = useFeatureFlag("SHOW_CUSTOMIZE_CARD");

  const [courseOrder, setNewCourseOrder] = useState(useSelector(
      (s: RootState) => s.courseOrder.order,
      () => true,
  ));

  const courseCardOffsets = useRef(courseOrder.map(_ => new Animated.Value(0)));
  const courseCardOffsetValues = useRef(courseOrder.map(_ => 0));
  const courseCardPositions = useRef(courseOrder.map((_, i) => i));
  const orderRef = useRef(courseOrder);

  useEffect(() => {
    courseCardOffsets.current.forEach(v => v.setValue(0));
    courseCardOffsetValues.current.fill(0);
    courseCardPositions.current = courseCardPositions.current.map((_, i) => i);
    orderRef.current = courseOrder;
  }, [courseOrder])

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <HeaderBanner
          label={gradeCategoryNames?.[currentGradeCategory] ?? "Your Scorecard"}
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
                getAnalytics().logEvent("show_grading_period_selector");
              }}
            >
              <Header
                header={
                  showLastUpdated
                    ? lastUpdatedHeader ?? "No Data"
                    : onCurrentGradingPeriod
                    ? "Your Scorecard"
                    : gradeCategoryNames?.[currentGradeCategory] ??
                      "Other Grading Period"
                }
                subheader={
                  showLastUpdated
                    ? updatedSubheader ?? "No Data"
                    : onCurrentGradingPeriod
                    ? gradeCategoryNames?.[currentGradeCategory || 0]
                    : "Tap to change grading period"
                }
              />
            </TouchableOpacity>

            <InviteOthersCard show={showCustomizeCard} />

            {courses && Date.now() > 0 && (
              <FlatList
                style={{
                  paddingBottom: 66,
                }}
                scrollEnabled={false}
                data={[...courses].sort((a: Course, b: Course) => {
                  return courseOrder.indexOf(a.key) - courseOrder.indexOf(b.key);
                })}
                renderItem={({ item, index }) => {
                  const hidden = courseSettings[item.key]?.hidden;
                  if (hidden) return null;

                  return (
                    <DraggableComponent
                      posListener={layout => {
                        const truePos = layout.y - courseCardOffsetValues.current[index];

                        if (Math.abs(truePos) > layout.height) {
                          const dir = Math.sign(truePos);

                          let targetIdx: number;
                          let offset = 0;
                          do {
                            offset += dir;
                            targetIdx = courseCardPositions.current.findIndex(i => i == courseCardPositions.current[index] + offset);

                            if (targetIdx < 0 || targetIdx >= courses.length) return
                          } while (courseSettings[courses[targetIdx].key]?.hidden);

                          courseCardPositions.current[index] += offset;
                          courseCardPositions.current[targetIdx] -= offset;

                          courseCardOffsetValues.current[index] += layout.height * dir;
                          courseCardOffsets.current[targetIdx].setValue(courseCardOffsetValues.current[targetIdx] -= layout.height * dir);
                        }
                      }}
                      stopDragging={layout => {
                        const newOrder = courseCardPositions.current
                            .map((i, idx) => {return {idx: i, key: orderRef.current[idx]}})
                            .sort((a, b) => a.idx - b.idx)
                            .map(c => c.key);

                        setNewCourseOrder(newOrder);
                        dispatch(setCourseOrder(newOrder));
                        dispatch(updateCourseOrder(newOrder));

                        return {x: 0, y: Math.round(layout.y/layout.height)*layout.height}
                      }}
                      offsetY={courseCardOffsets.current[index]}
                      disableX={true}
                    >
                      <Animated.View
                        style={
                          changeIndex !== -1 &&
                          changeIndex !== undefined &&
                          index > changeIndex
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
                          onClick={() => props.navigation.navigate("course", {
                            key: item.key,
                          })}
                          onHold={() => {}}
                          course={item}
                          gradingPeriod={currentGradeCategory || 0}
                        />
                      </Animated.View>
                    </DraggableComponent>
                  );
                }}
                keyExtractor={(item) => item.key}
              />
            )}

            <GradeCategorySelectorSheet ref={selector} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CurrentGradesScreen;
