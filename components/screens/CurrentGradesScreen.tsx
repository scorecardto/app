import { NavigationProp } from "@react-navigation/native";

import { Animated, ScrollView, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "../app/dashboard/CourseCard";
import { Course } from "scorecard-types";
import PageThemeProvider from "../core/context/PageThemeProvider";
import Background from "../util/Background";
import DashboardToolbar from "../app/dashboard/DashboardToolbar";
import DraggableComponent from "../util/DraggableComponent";
import { setCourseOrder } from "../core/state/grades/courseOrderSlice";
import { updateCourseOrder } from "../core/state/widget/widgetSlice";
import { fetchAllContent } from "../../lib/fetcher";
import RefreshStatus from "../../lib/types/RefreshStatus";
import useColors from "../core/theme/useColors";
import StatusText from "../text/StatusText";
export default function CurrentGradesScreen(props: {
  navigation: NavigationProp<any>;
}) {
  const dispatch = useDispatch();

  const courses = useSelector(
    (s: RootState) => s.gradeData.record?.courses || [],
    (p: Course[], n: Course[]) => JSON.stringify(p) === JSON.stringify(n)
  );

  const currentGradeCategory = useSelector(
    (s: RootState) => s.gradeCategory.category
  );

  const lastUpdated = useSelector(
    (state: RootState) => state.gradeData.record?.date ?? 0
  );

  const [time, setTime] = useState(Date.now());
  const lastUpdatedText = useMemo(() => {
    if (time - lastUpdated < 1000 * 60 * 60) {
      const mins = Math.floor((time - lastUpdated) / 1000 / 60);

      if (mins <= 0) return `Up to date.`;
      return `Updated ${mins} minute${mins === 1 ? "" : "s"} ago`;
    }

    if (time - lastUpdated < 1000 * 60 * 60 * 24) {
      return `Updated ${Math.floor(
        (time - lastUpdated) / 1000 / 60 / 60
      )} hours ago`;
    }

    if (time - lastUpdated < 1000 * 60 * 60 * 24 * 2) {
      return "Updated yesterday";
    }

    if (time - lastUpdated < 1000 * 60 * 60 * 24 * 7) {
      return `Updated ${Math.floor(
        (time - lastUpdated) / 1000 / 60 / 60 / 24
      )} days ago`;
    }

    return `Updated on ${new Date(lastUpdated).toLocaleDateString()}`;
  }, [currentGradeCategory, lastUpdated, time]);

  useEffect(() => {
    const i = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, []);

  const district = useSelector((state: RootState) => state.login.district);
  const username = useSelector((state: RootState) => state.login.username);
  const password = useSelector((state: RootState) => state.login.password);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // const reportCard = fetchAllContent(
    //   district,
    //   username,
    //   password,
    //   undefined,
    //   (s: RefreshStatus) => {
    //     dispatch(setRefreshStatus(s));
    //   }
    // );

    // reportCard.then(async (data) => {
    //   await fetchAndStore(data, dispatch, false);
    setRefreshing(false);
    // });
  }, []);

  const MINS_TO_REFRESH = 60;

  const lastRecordDate = useSelector(
    (state: RootState) => state.gradeData.record?.date
  );

  useEffect(() => {
    if (refreshing || !lastRecordDate) return;

    const mins = Math.floor((Date.now() - lastRecordDate) / 1000 / 60);

    if (mins > MINS_TO_REFRESH) {
      onRefresh();
      console.log("will refresh");
    }
  }, [lastRecordDate, refreshing]);

  const colors = useColors();

  const [courseOrder, setNewCourseOrder] = useState(
    useSelector(
      (s: RootState) => s.courseOrder.order,
      () => true
    )
  );
  const courseCardOffsets = useRef(
    courseOrder.map((_) => new Animated.Value(0))
  );
  const courseCardOffsetValues = useRef(courseOrder.map((_) => 0));
  const courseCardPositions = useRef(courseOrder.map((_, i) => i));
  const orderRef = useRef(courseOrder);
  useEffect(() => {
    courseCardOffsets.current.forEach((v) => v.setValue(0));
    courseCardOffsetValues.current.fill(0);
    courseCardPositions.current = courseCardPositions.current.map((_, i) => i);
    orderRef.current = courseOrder;
  }, [courseOrder]);
  const courseSettings = useSelector(
    (state: RootState) => state.courseSettings
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
              data={[...courses].sort((a: Course, b: Course) => {
                return courseOrder.indexOf(a.key) - courseOrder.indexOf(b.key);
              })}
              renderItem={({ item, index }) => {
                if (courseSettings[item.key].hidden) return null;

                return (
                  <DraggableComponent
                    posListener={(layout) => {
                      const truePos =
                        layout.y - courseCardOffsetValues.current[index];

                      if (Math.abs(truePos) > layout.height) {
                        const dir = Math.sign(truePos);

                        let targetIdx: number;
                        let offset = 0;
                        do {
                          offset += dir;
                          targetIdx = courseCardPositions.current.findIndex(
                            (i) =>
                              i == courseCardPositions.current[index] + offset
                          );

                          if (targetIdx < 0 || targetIdx >= courses.length)
                            return;
                        } while (
                          courseSettings[courses[targetIdx].key]?.hidden
                        );

                        courseCardPositions.current[index] += offset;
                        courseCardPositions.current[targetIdx] -= offset;

                        courseCardOffsetValues.current[index] +=
                          layout.height * dir;
                        courseCardOffsets.current[targetIdx].setValue(
                          (courseCardOffsetValues.current[targetIdx] -=
                            layout.height * dir)
                        );
                      }
                    }}
                    stopDragging={(layout) => {
                      const newOrder = courseCardPositions.current
                        .map((i, idx) => {
                          return { idx: i, key: orderRef.current[idx] };
                        })
                        .sort((a, b) => a.idx - b.idx)
                        .map((c) => c.key);

                      setNewCourseOrder(newOrder);
                      dispatch(setCourseOrder(newOrder));
                      dispatch(updateCourseOrder(newOrder));

                      return {
                        x: 0,
                        y: Math.round(layout.y / layout.height) * layout.height,
                      };
                    }}
                    offsetY={courseCardOffsets.current[index]}
                    disableX={true}
                  >
                    <CourseCard
                      onClick={() =>
                        props.navigation.navigate("course", {
                          key: item.key,
                          gradeCategory: currentGradeCategory,
                        })
                      }
                      onHold={() => {}}
                      course={item}
                      gradingPeriod={currentGradeCategory}
                    />
                  </DraggableComponent>
                );
              }}
              keyExtractor={(item) => item.key}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <StatusText
              style={{
                color: colors.text,
                fontSize: 14,
              }}
            >
              {lastUpdatedText}
            </StatusText>
          </View>
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
