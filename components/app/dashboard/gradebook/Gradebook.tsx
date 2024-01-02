import React, { useRef, useState } from "react";
import { Dimensions, Text, View, ViewStyle } from "react-native";
import {Assignment, Course, GradeCategory} from "scorecard-types";
import GradebookCard from "./GradebookCard";
import CategoryTable from "./CategoryTable";
import Carousel, { Pagination } from "react-native-snap-carousel";
import SummaryTable from "./SummaryTable";
import {
  DynamicStyleProp,
  ExcludeFunctionKeys,
  MotiView,
  useDynamicAnimation,
} from "moti";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { set } from "react-native-reanimated";
import {
    averageGradeCategories,
    averageAssignments
} from "../../../../lib/gradeTesting";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function Gradebook(props: { course: Course, setModifiedGrade(avg: number): void }) {
  const { colors } = useTheme();
  const ref = useRef<Carousel<GradeCategory>>(null);

  const cardAnimation = useDynamicAnimation(() => ({
    opacity: 1,
    translateX: 0,
  }));

  const [animatedIndex, setAnimatedIndex] = useState(0);

  const [currentCard, setCurrentCard] = useState(0);

  const [animatingCard, setAnimatingCard] = useState(-1);

  const [modifiedCategories, setModifiedCategories] = useState(props.course.gradeCategories.map(_=>{
      return {assignments: null, average: null};
  }));
  const [numTestAssignments, setNumTestAssignments] = useState(0);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Pagination
        dotsLength={props.course.gradeCategories.length + 1}
        activeDotIndex={currentCard}
        containerStyle={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingVertical: 0,
          paddingHorizontal: 0,
          marginBottom: 16,
        }}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#C5315D",
        }}
        inactiveDotOpacity={0.3}
        inactiveDotScale={1}
      />
      <Carousel
        ref={ref}
        data={[undefined, ...props.course.gradeCategories]}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return (
              <View>
                <GradebookCard
                  key={index}
                  title="Summary"
                  bottom={["Weight: 100%"]}
                  buttonAction={() => {}}
                >
                  <SummaryTable
                    course={props.course}
                    // @ts-ignore
                    modified={modifiedCategories}
                    changeGradeCategory={(c) => {
                      ref.current.snapToItem(c + 1);
                      setAnimatedIndex(c + 1);
                      setAnimatingCard(c);

                      setTimeout(() => {
                        setAnimatingCard(-1);
                      }, 300);

                      Haptics.selectionAsync();
                    }}
                  />
                </GradebookCard>
              </View>
            );
          }
          return (
            <MotiView
              animate={{
                opacity:
                  index - 1 === animatingCard || animatingCard === -1 ? 1 : 0.2,
              }}
              transition={{
                type: "timing",
                duration: 0,
              }}
            >
              <GradebookCard
                key={index}
                title={item.name}
                bottom={[`Weight: ${item.weight}%`]}
                buttonAction={() => {
                    setModifiedCategories(categories => {
                        const catIdx = index-1;
                        const newCategories = [...categories];

                        if (newCategories[catIdx].assignments === null) {
                            newCategories[catIdx].assignments = new Array(item.assignments.length).fill(null);
                        }

                        newCategories[catIdx].assignments.push({
                            name: "Test Assignment "+(numTestAssignments+1),
                            points: 100,
                            grade: "100%",
                            dropped: false,
                            max: 100,
                            count: 1,
                            error: false
                        })
                        setNumTestAssignments(numTestAssignments+1);

                        return newCategories;
                    })
                }}
              >
                <CategoryTable category={item}
                               modifiedAssignments={modifiedCategories[index-1].assignments}
                               removeAssignment={(idx: number) => {
                                   setModifiedCategories(categories => {
                                       const catIdx = index-1;
                                       const newCategories = [...categories];

                                        if (newCategories[catIdx].assignments !== null) {
                                            newCategories[catIdx].assignments.splice(idx, 1);
                                        }
                                       if (newCategories[catIdx].assignments.every(as => as === null)) {
                                           newCategories[catIdx].assignments = newCategories[catIdx].average = null;
                                           props.setModifiedGrade(null);
                                       }

                                       return newCategories;
                                   })
                               }}
                               modifyAssignment={(a: Assignment, idx: number) => {
                                   setModifiedCategories(categories => {
                                        const catIdx = index-1;
                                        const newCategories = [...categories];
                                        if (newCategories[catIdx].assignments === null) {
                                            if (a === null) {
                                                return categories;
                                            }
                                            newCategories[catIdx].assignments = new Array(item.assignments.length).fill(null);
                                        }
                                        newCategories[catIdx].assignments[idx] = a;
                                        if (newCategories[catIdx].assignments.every(as => as === null)) {
                                            newCategories[catIdx].assignments = newCategories[catIdx].average = null;
                                            props.setModifiedGrade(null);
                                        } else {
                                            const averages = averageAssignments(props.course.gradeCategories,
                                                newCategories.map(c => c.assignments));
                                            newCategories[catIdx].average = averages[catIdx];
                                            props.setModifiedGrade(averageGradeCategories(props.course.gradeCategories.map((c, i) => {
                                                return {
                                                    ...c,
                                                    average: "" + (averages[i] ?? c.average)
                                                }
                                            })));
                                        }

                                        return newCategories;
                                   })
                }} />
              </GradebookCard>
            </MotiView>
          );
        }}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 48}
        vertical={false}
        onSnapToItem={(index) => {
          if (index !== animatedIndex) {
            setAnimatedIndex(-1);
          }
        }}
        onScrollIndexChanged={(index) => {
          setCurrentCard(index);
        }}
      />
    </View>
  );
}
