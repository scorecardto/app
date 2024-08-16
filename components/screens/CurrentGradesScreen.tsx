import { NavigationProp } from "@react-navigation/native";

import {Animated, ScrollView, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "../app/dashboard/CourseCard";
import { Course } from "scorecard-types";
import PageThemeProvider from "../core/context/PageThemeProvider";
import Background from "../util/Background";
import DashboardToolbar from "../app/dashboard/DashboardToolbar";
import DraggableComponent from "../util/DraggableComponent";
import {setCourseOrder} from "../core/state/grades/courseOrderSlice";
import {updateCourseOrder} from "../core/state/widget/widgetSlice";
export default function CurrentGradesScreen(props: {
  navigation: NavigationProp<any>;
}) {
  const dispatch = useDispatch();

  const courses = useSelector(
    (s: RootState) =>
      s.gradeData.record?.courses || [],
    (p: Course[], n: Course[]) => JSON.stringify(p) === JSON.stringify(n)
  );

  const currentGradeCategory = useSelector(
    (s: RootState) => s.gradeCategory.category
  );

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
                  return (
                      courseOrder.indexOf(a.key) - courseOrder.indexOf(b.key)
                  );
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
                                y:
                                    Math.round(layout.y / layout.height) *
                                    layout.height,
                            };
                        }}
                        offsetY={courseCardOffsets.current[index]}
                        disableX={true}
                    >
                        <CourseCard
                            onClick={() =>
                                props.navigation.navigate("course", {
                                    key: item.key,
                                    gradeCategory: currentGradeCategory
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
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
