import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useMemo,
  Suspense,
} from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { Course, DataContext } from "scorecard-types";
import Header from "../text/Header";
import { RadialGradient } from "react-native-gradients";
import LargeGradeText from "../text/LargeGradeText";
import { ThemeProvider, useTheme } from "@react-navigation/native";
import Gradebook from "../app/gradebook/Gradebook";
import BottomSheetDisplay from "../util/BottomSheet/BottomSheetDisplay";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
// import CourseEditSheet from "../app/course/CourseEditSheet";
import { Theme } from "../../lib/Color";
import color from "../../lib/Color";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import CourseEditSheet from "../app/course/CourseEditSheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  fetchGradeCategoriesForCourse,
  fetchReportCard,
} from "../../lib/fetcher";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Storage from "expo-storage";
import captureCourseState from "../../lib/captureCourseState";
import GradeStateChangesCard from "../app/gradebook/GradeStateChangesCard";
import Button from "../input/Button";
import BottomSheetButton from "../input/BottomSheetButton";
import CourseCornerButton from "../app/course/CourseCornerButton";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import parseCourseKey from "../../lib/parseCourseKey";
import StatusText from "../text/StatusText";
import LoadingOverlay from "./loader/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";

export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const district = useSelector((state: RootState) => state.login.district);
  const username = useSelector((state: RootState) => state.login.username);
  const password = useSelector((state: RootState) => state.login.password);

  const dataContext = React.useContext(DataContext);
  const mobileDataContext = React.useContext(MobileDataContext);

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [playUpdateAnimation, setPlayUpdateAnimation] = useState(false);
  const [showNormalCourseInfo, setShowNormalCourseInfo] = useState(false);
  const [showGradeStateChanges, setShowGradeStateChanges] = useState(false);
  const [gradeText, setGradeText] = useState("NG");

  async function getCourse(): Promise<Course | undefined> {
    if (dataContext.gradeCategory === dataContext.data?.gradeCategory) {
      return dataContext.data?.courses.find((c) => c.key === key);
    } else {
      const course = dataContext.data?.courses.find((c) => c.key === key);

      const alternateKey = course?.grades[dataContext.gradeCategory]?.key;

      if (course == null || alternateKey == null) return undefined;

      const reportCard = await fetchReportCard(district, username, password);

      const categories = await fetchGradeCategoriesForCourse(
        district,
        reportCard.sessionId,
        reportCard.referer,
        {
          ...course,
          key: alternateKey || "",
        }
      );

      return {
        ...course,
        gradeCategories: categories.gradeCategories,
      };
    }
  }

  useEffect(() => {
    setShowNormalCourseInfo(false);
    getCourse().then((course) => {
      setTimeout(() => {
        if (course == null) return;

        const oldCourseStates = {
          ...mobileDataContext.oldCourseStates,
          [key]: captureCourseState(course),
        };

        mobileDataContext.setOldCourseStates(oldCourseStates);

        Storage.setItem({
          key: "oldCourseStates",
          value: JSON.stringify(oldCourseStates),
        });
      }, 1500);

      setCourse(course);
    });
  }, [dataContext.gradeCategory]);

  useEffect(() => {
    if (!course) return;

    const stateChange =
      mobileDataContext.oldCourseStates[key] &&
      JSON.stringify(mobileDataContext.oldCourseStates[key]) !==
        JSON.stringify(captureCourseState(course));

    if (stateChange) {
      setShowGradeStateChanges(true);
      setGradeText(mobileDataContext.oldCourseStates[key].average);
      setModifiedAvg(course.grades[dataContext.gradeCategory]?.value || "NG");
    } else {
      setGradeText(course.grades[dataContext.gradeCategory]?.value || "NG");
      setShowNormalCourseInfo(true);
    }
  }, [course]);

  const parentTheme = useTheme();

  const [modifiedAvg, setModifiedAvg] = useState<string | null>(null);

  const sheets = useContext(BottomSheetContext);

  const normalViewOpacity = useMemo(() => new Animated.Value(0), []);
  const normalViewTranslateY = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(normalViewOpacity, {
      toValue: showNormalCourseInfo ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(normalViewTranslateY, {
      toValue: showNormalCourseInfo ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showNormalCourseInfo]);

  const insets = useSafeAreaInsets();

  if (course == null) {
    return (
      <View>
        <Text>Course not found</Text>
      </View>
    );
  }

  const accentLabel =
    dataContext.courseSettings[course.key]?.accentColor ||
    color.defaultAccentLabel;

  const theme: Theme = {
    ...parentTheme,
    accentLabel,
    accents:
      color.AccentsMatrix[accentLabel][parentTheme.dark ? "dark" : "default"],
  };
  const { colors, accents } = theme;

  const courseDisplayName =
    dataContext.courseSettings[course.key]?.displayName || course.name;

  const colorList = [
    { offset: "0%", color: accents.gradientCenter, opacity: "1" },
    { offset: "100%", color: accents.gradientCenter, opacity: "0" },
  ];

  const keyInfo = parseCourseKey(key);

  return (
    <ThemeProvider value={theme}>
      <SafeAreaView
        style={{
          height: "100%",
          backgroundColor: colors.backgroundNeutral,
          position: "relative",
        }}
      >
        <CourseCornerButtonContainer>
          <CourseCornerButton
            side="left"
            icon="chevron-left"
            iconSize={30}
            onPress={() => props.navigation.goBack()}
          />
        </CourseCornerButtonContainer>

        <View
          style={{
            zIndex: 1,
          }}
        >
          <Suspense fallback={<LoadingOverlay show={true} />}>
            <TouchableOpacity
              onPress={() => {
                sheets?.addSheet(({ close, setOnClose }) => (
                  <CourseEditSheet course={course} setOnClose={setOnClose} />
                ));
              }}
            >
              <View style={{ marginHorizontal: 64 }}>
                <Header
                  header={courseDisplayName}
                  subheader={
                    courseDisplayName !== course.name
                      ? undefined
                      : "Tap to add a name and color"
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                      marginTop: 20,
                      alignItems: "center",
                    }}
                  >
                    <LargeGradeText
                      // animated={true}
                      grade={gradeText}
                      // TODO: I think this should be colors.secondaryNeutral, but it's invisible w/o the gradient
                      backgroundColor={
                        modifiedAvg ? colors.borderNeutral : accents.primary
                      }
                      textColor={modifiedAvg ? colors.text : "#FFFFFF"}
                    />
                    {modifiedAvg && (
                      <MaterialIcons
                        name={"arrow-forward"}
                        size={25}
                        color={colors.text}
                      />
                    )}
                    {modifiedAvg && (
                      <LargeGradeText
                        grade={`${modifiedAvg}`}
                        backgroundColor={accents.primary}
                        textColor="#FFFFFF"
                      />
                    )}
                  </View>
                </Header>
              </View>
            </TouchableOpacity>

            {showGradeStateChanges && (
              <View>
                <GradeStateChangesCard
                  course={course}
                  onFinished={() => {
                    setShowNormalCourseInfo(true);
                    setShowGradeStateChanges(false);
                    setGradeText(modifiedAvg || "NG");
                    setModifiedAvg(null);
                  }}
                />
              </View>
            )}
            <Animated.View
              style={{
                opacity: normalViewOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateY: normalViewTranslateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              }}
            >
              <Gradebook course={course} setModifiedGrade={setModifiedAvg} />
            </Animated.View>
          </Suspense>
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <RadialGradient
            x="50%"
            y="0"
            rx="384"
            ry="288"
            colorList={colorList}
          ></RadialGradient>
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}
