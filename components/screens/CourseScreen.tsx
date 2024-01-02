import React, { useContext, useRef } from "react";
import { Text, Touchable, View } from "react-native";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { DataContext } from "scorecard-types";
import Header from "../text/Header";
import { RadialGradient } from "react-native-gradients";
import LargeGradeText from "../text/LargeGradeText";
import { ThemeProvider, useTheme } from "@react-navigation/native";
import Gradebook from "../app/dashboard/gradebook/Gradebook";
import BottomSheetDisplay from "../util/BottomSheet/BottomSheetDisplay";
import { TouchableOpacity } from "react-native-gesture-handler";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import CourseEditSheet from "../app/course/CourseEditSheet";
import { Theme } from "../../lib/Color";
import color from "../../lib/Color";
export default function CourseScreen({ route, navigation }) {
  const { key } = route.params;

  const dataContext = React.useContext(DataContext);

  const course = dataContext.data?.courses.find((c) => c.key === key);

  if (course == null) {
    return (
      <View>
        <Text>Course not found</Text>
      </View>
    );
  }

  const colorList = [
    { offset: "0%", color: "#FFCBD6", opacity: "1" },
    { offset: "100%", color: "#FFCBD6", opacity: "0" },
  ];

  const parentTheme = useTheme();
  const accentLabel =
    dataContext.courseSettings[course.key]?.accentColor ||
    color.defaultAccentLabel;

  const theme: Theme = {
    ...parentTheme,
    accentLabel,
    accents:
      color.AccentsMatrix[accentLabel][parentTheme.dark ? "dark" : "default"],
  };
  const colors = theme.colors;
  const sheets = useContext(BottomSheetContext);

  const courseDisplayName =
    dataContext.courseSettings[course.key]?.displayName || course.name;

  return (
    <ThemeProvider value={theme}>
      <View
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
              sheets.addSheet((close) => <CourseEditSheet course={course} />);
            }}
          >
            <Header header={courseDisplayName}>
              <LargeGradeText
                grade={course.grades[dataContext.gradeCategory]?.value || "NG"}
                backgroundColor="#C5315D"
                textColor="#FFFFFF"
              />
            </Header>
          </TouchableOpacity>

          <View style={{}}>
            <Gradebook course={course} />
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
          <RadialGradient
            x="50%"
            y="0"
            rx="384"
            ry="288"
            colorList={colorList}
          ></RadialGradient>
        </View>
        <BottomSheetDisplay />
      </View>
    </ThemeProvider>
  );
}
