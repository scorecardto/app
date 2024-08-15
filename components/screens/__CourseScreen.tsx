import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { Text, View } from "react-native";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import useColors from "../core/theme/useColors";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import CourseScreenGradient from "../app/course/CourseScreenGradient";
import LargeText from "../text/LargeText";
import SmallText from "../text/SmallText";

import useAccents from "../core/theme/useAccents";
import CommentsPreview from "../app/course/CommentsPreview";
import CourseAverageDisplay from "../app/course/CourseAverageDisplay";
import GradebookCard from "../app/gradebook/GradebookCard";
import GradebookWrapper from "../app/gradebook/GradebookWrapper";
import { useState } from "react";
export default function CourseScreen(props: { route: any; navigation: any }) {
  const { key } = props.route.params;

  const course = useSelector((r: RootState) => {
    return r.gradeData.record?.courses.find((c) => c.key === key);
  });

  const grades = useSelector((r: RootState) => {
    return course?.gradeCategories;
  });

  const name = useSelector((r: RootState) => {
    return r.courseSettings[key].displayName || course?.name;
  });

  const colors = useColors();

  const [modifiedAvg, setModifiedAvg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  return (
    <CourseScreenWrapper courseKey={key}>
      <View
        style={{
          height: "100%",
        }}
      >
        <View
          style={{
            marginBottom: 20,
            backgroundColor: "yellow",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              // backgroundColor: "red",
              paddingTop: 24,
            }}
          >
            <CourseCornerButtonContainer
              type="BACK"
              onPress={() => {
                props.navigation.goBack();
              }}
            />
            <View
              style={{
                paddingHorizontal: 8,
                paddingTop: 4,
              }}
            >
              <LargeText
                textProps={{
                  numberOfLines: 1,
                }}
              >
                {name}
              </LargeText>
            </View>

            {/* <View>
            <CommentsPreview />
            <CourseAverageDisplay />
          </View> */}
          </View>
          <View
            style={{
              // backgroundColor: colors.backgroundNeutral,
              flexGrow: 1,
              height: "100%",
            }}
          >
            <Text>hello</Text>
            <View
              style={{
                // backgroundColor: "blue",
                height: "100%",
                width: "100%",
              }}
            ></View>
            {/* {course && (
            <GradebookWrapper
              course={course}
              setModifiedGrade={setModifiedAvg}
              oldGradingPeriodLastUpdated={undefined}
              refreshOldGradingPeriod={() => {
                // refreshGradingPeriod(false);
              }}
              resetKey={`${resetKey}`}
            />
          )} */}
          </View>
        </View>
        {/* <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <CourseScreenGradient />
        <View
          style={{
            paddingHorizontal: 16,
            // backgroundColor: "red",
            paddingTop: 24,
          }}
        >
          <CourseCornerButtonContainer
            type="BACK"
            onPress={() => {
              props.navigation.goBack();
            }}
          />
          <View
            style={{
              paddingHorizontal: 8,
              paddingTop: 4,
            }}
          >
            <LargeText
              textProps={{
                numberOfLines: 1,
              }}
            >
              {name}
            </LargeText>
          </View>

          <View>
            <CommentsPreview />
            <CourseAverageDisplay />
          </View>
        </View>

        <View
          style={{
            height: "100%",
            backgroundColor: colors.backgroundNeutral,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text>hello</Text>
          {/* {course && (
            <GradebookWrapper
              course={course}
              setModifiedGrade={setModifiedAvg}
              oldGradingPeriodLastUpdated={undefined}
              refreshOldGradingPeriod={() => {
                // refreshGradingPeriod(false);
              }}
              resetKey={`${resetKey}`}
            />
          )} */}
        {/* </View> 
      // </View> */}

        {/* <CourseCornerButtonContainer
        onPress={() => {
          props.navigation.goBack();
        }}
        type="BACK"
      />

      <SafeAreaView
        style={{
          height: "100%",
          backgroundColor: colors.backgroundNeutral,
          position: "relative",
          zIndex: 1,
        }}
      >
       
      </SafeAreaView> */}
      </View>
    </CourseScreenWrapper>
  );
}
