import React, { useRef, useState, useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { Course, DataContext } from "scorecard-types";
import Header from "../text/Header";
// import { RadialGradient } from "react-native-gradients";
import LargeGradeText from "../text/LargeGradeText";
import { ThemeProvider, useTheme } from "@react-navigation/native";
// import Gradebook from "../app/dashboard/gradebook/Gradebook";
import BottomSheetDisplay from "../util/BottomSheet/BottomSheetDisplay";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
// import CourseEditSheet from "../app/course/CourseEditSheet";
import { Theme } from "../../lib/Color";
import color from "../../lib/Color";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import Gradebook from "../app/gradebook/Gradebook";
import CourseEditSheet from "../app/course/CourseEditSheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  fetchGradeCategoriesForCourse,
  fetchReportCard,
} from "../../lib/fetcher";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const dataContext = React.useContext(DataContext);
  const mobileDataContext = React.useContext(MobileDataContext);

  const [course, setCourse] = useState<Course | undefined>(undefined);

  async function getCourse(): Promise<Course | undefined> {
    if (dataContext.gradeCategory === dataContext.data?.gradeCategory) {
      return dataContext.data?.courses.find((c) => c.key === key);
    } else {
      const course = dataContext.data?.courses.find((c) => c.key === key);

      const alternateKey = course?.grades[dataContext.gradeCategory]?.key;

      if (course == null || alternateKey == null) return undefined;

      const reportCard = await fetchReportCard(
        mobileDataContext.district,
        mobileDataContext.username,
        mobileDataContext.password
      );

      const categories = await fetchGradeCategoriesForCourse(
        mobileDataContext.district,
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
    getCourse().then((course) => {
      setCourse(course);
    });
  }, [dataContext.gradeCategory]);

  const parentTheme = useTheme();

  const [modifiedAvg, setModifiedAvg] = useState<number | null>(null);

  const sheets = useContext(BottomSheetContext);

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
  return (
    <ThemeProvider value={theme}>
      <SafeAreaView
        style={{
          height: "100%",
          backgroundColor: colors.backgroundNeutral,
        }}
      >
        <View
          style={{
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              sheets?.addSheet((close) => <CourseEditSheet course={course} />);
            }}
          >
            <Header header={courseDisplayName}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                  marginTop: 18,
                  alignItems: "center",
                }}
              >
                <LargeGradeText
                  grade={
                    course.grades[dataContext.gradeCategory]?.value || "NG"
                  }
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
          </TouchableOpacity>

          <View style={{}}>
            <Gradebook course={course} setModifiedGrade={setModifiedAvg} />
          </View>
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
          {/* <RadialGradient
            x="50%"
            y="0"
            rx="384"
            ry="288"
            colorList={colorList}
          ></RadialGradient> */}
        </View>
        <BottomSheetDisplay />
      </SafeAreaView>
    </ThemeProvider>
  );
}
