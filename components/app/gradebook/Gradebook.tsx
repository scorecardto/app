import React, {useContext, useEffect, useRef, useState} from "react";
import { Dimensions, Text, View, ViewStyle } from "react-native";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import GradebookCard from "./GradebookCard";
import CategoryTable from "./CategoryTable";
// import Carousel, { Pagination } from "react-native-snap-carousel";
import SummaryTable from "./SummaryTable";
// import {
//   DynamicStyleProp,
//   ExcludeFunctionKeys,
//   MotiView,
//   useDynamicAnimation,
// } from "moti";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
// import { set } from "react-native-reanimated";
import {
  averageGradeCategories,
  averageAssignments,
} from "../../../lib/gradeTesting";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { MotiView } from "moti";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import AddCategorySheet from "./sheets/AddCategorySheet";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function Gradebook(props: {
  course: Course;
  setModifiedGrade(avg: number | null): void;
}) {
    const sheets = useContext(BottomSheetContext);

    const { accents, colors } = useTheme();
  const ref = useRef<Carousel<GradeCategory | null>>(null);

  //   const cardAnimation = useDynamicAnimation(() => ({
  //     opacity: 1,
  //     translateX: 0,
  //   }));

  const [animatedIndex, setAnimatedIndex] = useState(0);

  const [currentCard, setCurrentCard] = useState(0);

  const [animatingCard, setAnimatingCard] = useState(-1);

  type CategoryMod = {
    assignments: (Assignment | null)[] | null;
    average: number | null;
  };

  const [categories, setCategories] = useState(props.course.gradeCategories!);
  const [modifiedCategories, setModifiedCategories] = useState<CategoryMod[]>(
    categories.map((_) => {
      return { assignments: null, average: null };
    })
  );
  const [numTestAssignments, setNumTestAssignments] = useState(1);
  const [numTestCats, setNumTestCats] = useState(1);

  const updateAverage = (categoryMods: CategoryMod[], catIdx?: number) => {
    const averages = averageAssignments(
      categories,
      categoryMods.map((c) => c.assignments)
    );

    if (catIdx) {
      if (categoryMods[catIdx].assignments!.every((as) => as === null)) {
        categoryMods[catIdx].assignments = categoryMods[catIdx].average = null;
      } else {
        categoryMods[catIdx].average = averages[catIdx];
      }
    }

    if (
      categoryMods.every(
        (c) => c.assignments?.every((as) => as === null) ?? true
      ) &&
      categories.length == props.course.gradeCategories?.length
    ) {
      props.setModifiedGrade(null);
    } else {
      props.setModifiedGrade(
        averageGradeCategories(
          categories.map((c, i) => {
            return {
              ...c,
              average:
                "" +
                (isNaN(averages[i]) ? c.average : averages[i] ?? c.average),
            };
          })
        )
      );
    }
  };

  // when testing categories are added/removed, update the course average
  useEffect(() => {
    updateAverage(modifiedCategories);
  }, [categories, modifiedCategories]);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Pagination
        dotsLength={(categories.length ?? 0) + 1}
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
          backgroundColor: accents.primary,
        }}
        inactiveDotOpacity={0.3}
        inactiveDotScale={1}
      />
      <Carousel
        ref={ref}
        data={[null, ...(categories || [])]}
        renderItem={({ item, index }) => {
          if (!item) {
            return (
              <View>
                <GradebookCard
                  key={index}
                  title="Summary"
                  bottom={["Weight: 100%"]}
                  buttonAction={() => {
                      sheets.addSheet(({ close }) => (
                          <>
                              <AddCategorySheet close={close} add={(weight) => {
                                  setCategories((oldCategories) => {
                                      const newCategories = [...oldCategories];
                                      newCategories.push({
                                          name: "Test Category " + numTestCats,
                                          id: "",
                                          weight: weight,
                                          average: "",
                                          error: false,
                                          assignments: [],
                                      });
                                      setNumTestCats(numTestCats + 1);
                                      return newCategories;
                                  });
                                  setModifiedCategories((oldCategories) => {
                                      const newCategories = [...oldCategories];
                                      newCategories.push({ assignments: null, average: null });

                                      return newCategories;
                                  });
                              }}/>
                          </>
                      ));
                  }}
                >
                  <SummaryTable
                    course={props.course}
                    categories={categories}
                    modified={modifiedCategories}
                    changeGradeCategory={(c) => {
                      ref.current?.snapToItem(c + 1);
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
                  setModifiedCategories((categories) => {
                    const catIdx = index - 1;
                    const newCategories = [...categories];

                    if (newCategories[catIdx].assignments === null) {
                      newCategories[catIdx].assignments = new Array(
                        item.assignments.length
                      ).fill(null);
                    }

                    newCategories[catIdx].assignments!.push({
                      name: "Test Assignment " + numTestAssignments,
                      points: 100,
                      grade: "100%",
                      dropped: false,
                      max: 100,
                      count: 1,
                      error: false,
                    });
                    setNumTestAssignments(numTestAssignments + 1);

                    return newCategories;
                  });
                }}
              >
                <CategoryTable
                  category={item}
                  modifiedAssignments={
                    modifiedCategories[index - 1].assignments
                  }
                  removeAssignment={(idx: number) => {
                    setModifiedCategories((categories) => {
                      const catIdx = index - 1;
                      const newCategories = [...categories];

                      if (newCategories[catIdx].assignments !== null) {
                        newCategories[catIdx].assignments!.splice(idx, 1);
                      }

                      // updateAverage(newCategories, catIdx);

                      return newCategories;
                    });
                  }}
                  modifyAssignment={(a: Assignment, idx: number) => {
                    setModifiedCategories((oldCategories) => {
                      const catIdx = index - 1;
                      const newCategories = [...oldCategories];
                      if (newCategories[catIdx].assignments === null) {
                        if (a === null) {
                          return oldCategories;
                        }
                        newCategories[catIdx].assignments = new Array(
                          item.assignments.length
                        ).fill(null);
                      }
                      newCategories[catIdx].assignments![idx] = a;

                      // updateAverage(newCategories, catIdx);

                      return newCategories;
                    });
                  }}
                />
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
