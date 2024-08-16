import { NavigationProp } from "@react-navigation/native";

import { ScrollView, Text, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "../app/dashboard/CourseCard";
import { Course } from "scorecard-types";
import PageThemeProvider from "../core/context/PageThemeProvider";
import Background from "../util/Background";
import DashboardToolbar from "../app/dashboard/DashboardToolbar";
import StatusText from "../text/StatusText";
import useColors from "../core/theme/useColors";
import { fetchAllContent } from "../../lib/fetcher";
import RefreshStatus from "../../lib/types/RefreshStatus";
import { setRefreshStatus } from "../core/state/grades/refreshStatusSlice";
import fetchAndStore from "../../lib/fetchAndStore";
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
                      })
                    }
                    onHold={() => {}}
                  />
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
