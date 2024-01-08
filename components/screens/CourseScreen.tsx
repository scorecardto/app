import React, { useRef, useState, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { DataContext } from "scorecard-types";
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

export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const dataContext = React.useContext(DataContext);

  const course = dataContext.data?.courses.find((c) => c.key === key);

  if (course == null) {
    return (
      <View>
        <Text>Course not found</Text>
      </View>
    );
  }

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
  const { colors, accents } = theme;
  const [modifiedAvg, setModifiedAvg] = useState<number | null>(null);

  const sheets = useContext(BottomSheetContext);

  const courseDisplayName =
    dataContext.courseSettings[course.key]?.displayName || course.name;

  const modified = modifiedAvg != null;

  const colorList = [
    { offset: "0%", color: accents.gradientCenter, opacity: "1" },
    { offset: "100%", color: accents.gradientCenter, opacity: "0" },
  ];
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
              sheets?.addSheet((close) => <CourseEditSheet course={course} />);
            }}
          >
            <Header header={courseDisplayName}>
                <View style={{flexDirection: 'row', gap: 15, marginTop: 18, alignItems: 'center'}}>
                    <LargeGradeText
                        grade={
                            course.grades[dataContext.gradeCategory]?.value || "NG"
                        }
                        // TODO: should be colors.secondaryNeutral, but it's invisible w/o the gradient
                        backgroundColor={modifiedAvg ? colors.borderNeutral : accents.primary}
                        textColor={modifiedAvg ? colors.text : "#FFFFFF"}
                    />
                    {modifiedAvg && (<MaterialIcons
                        name={"arrow-forward"}
                        size={25}
                        color={colors.text}
                    />)}
                    {modifiedAvg && (<LargeGradeText
                        grade={`${modifiedAvg}`}
                        backgroundColor={accents.primary}
                        textColor="#FFFFFF"
                    />)}
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
      </View>
    </ThemeProvider>
  );
}
