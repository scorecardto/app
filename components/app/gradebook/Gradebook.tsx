import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
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
// import { set } from "react-native-reanimated";
import {
  averageAssignments,
  averageGradeCategories,
} from "../../../lib/gradeTesting";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import AddCategorySheet from "./sheets/AddCategorySheet";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

function Gradebook(props: {
  course: Course;
  setModifiedGrade(avg: string | null): void;
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
    average: string | null;
    exactAverage: string | null;
  };

  const [categories, setCategories] = useState(props.course.gradeCategories!);
  const [modifiedCategories, setModifiedCategories] = useState<CategoryMod[]>(
    categories.map((_) => {
      return { assignments: null, average: null, exactAverage: null };
    })
  );
  const [exactAverages, setExactAverages] = useState<(string | null)[]>(
    averageAssignments(categories, []).map(i=>i?.toFixed(2))
  );
  const [numTestAssignments, setNumTestAssignments] = useState(1);
  const [numTestCats, setNumTestCats] = useState(1);

  const updateAverage = (categoryMods: CategoryMod[], catIdx?: number) => {
    const averages = averageAssignments(
      categories,
      categoryMods.map((c) => c.assignments)
    );

    if (catIdx !== undefined) {
      if (categoryMods[catIdx].assignments!.every((as) => as === null)) {
        categoryMods[catIdx].assignments =
          categoryMods[catIdx].average =
          categoryMods[catIdx].exactAverage =
            null;
      } else {
        if (isNaN(averages[catIdx])) {
            categoryMods[catIdx].average = categoryMods[catIdx].exactAverage = "NG";
        } else {
          categoryMods[catIdx].average = ''+Math.round(averages[catIdx]);
          categoryMods[catIdx].exactAverage = averages[catIdx].toFixed(2);
        }
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
      const avg = averageGradeCategories(
          categories.map((c, i) => {
            return {
              ...c,
              average:
                  "" +
                  (isNaN(averages[i]) ? "" : averages[i] ?? c.average),
            };
          })
      );
      props.setModifiedGrade(isNaN(avg) ? "NG" : ''+avg);
    }
  };

  // update the course average any time a test category is added/remove
  // should NOT depend on modifiedCategories
  useEffect(() => {
    updateAverage(modifiedCategories);
  }, [categories]);

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
        data={[null, ...categories]}
        renderItem={({ item, index }) => {
          if (!item) {
            return (
              <View>
                <GradebookCard
                  key={index}
                  title="Summary"
                  bottom={{ Weight: { text: "100%", red: false } }}
                  removable={false}
                  remove={() => {}}
                  buttonAction={() => {
                    sheets?.addSheet(({ close }) => (
                      <>
                        <AddCategorySheet
                          close={close}
                          add={(weight) => {
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
                            setExactAverages((averages) => {
                              const newAverages = [...averages];
                              newAverages.push(null);
                              return newAverages;
                            });
                            setModifiedCategories((oldCategories) => {
                              const newCategories = [...oldCategories];
                              newCategories.push({
                                assignments: null,
                                average: null,
                                exactAverage: null,
                              });
                              return newCategories;
                            });
                          }}
                        />
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
                    }}
                  />
                </GradebookCard>
              </View>
            );
          }
          const gradeText =
            "" + (modifiedCategories[index - 1].average ?? item.average);
          const testing = index > props.course.gradeCategories!.length;
          return (
            <View
            // animate={{
            //   opacity:
            //     index - 1 === animatingCard || animatingCard === -1 ? 1 : 0.2,
            // }}
            // transition={{
            //   type: "timing",
            //   duration: 0,
            // }}
            >
              <GradebookCard
                key={index}
                title={item.name}
                grade={{
                  text: gradeText ? gradeText : "NG",
                  red:
                    testing || modifiedCategories[index - 1].average !== null,
                }}
                bottom={{
                  Weight: { text: `${item.weight}%`, red: testing },
                  "Exact Average": {
                    text: `${
                      modifiedCategories[index - 1].exactAverage ??
                      exactAverages[index - 1]
                    }`,
                    red:
                      testing || modifiedCategories[index - 1].average !== null,
                  },
                }}
                removable={testing}
                remove={() => {
                  setCategories((oldCategories) => {
                    return oldCategories.toSpliced(index - 1, 1);
                  });
                  setModifiedCategories((oldCategories) => {
                    return oldCategories.toSpliced(index - 1, 1);
                  });
                  setExactAverages((oldAverages) => {
                    return oldAverages.toSpliced(index - 1, 1);
                  });
                }}
                buttonAction={() => {
                  setModifiedCategories((categories) => {
                    const catIdx = index - 1;
                    const newCategories = [...categories];
                    if (newCategories[catIdx].assignments === null) {
                      newCategories[catIdx].assignments = new Array(
                        item?.assignments?.length
                      ).fill(null);
                    }
                    newCategories[catIdx].assignments!.push({
                      name: "Test Assignment " + numTestAssignments,
                      points: 100,
                      grade: "100%",
                      dropped: false,
                      scale: 100,
                      count: 1,
                      error: false,
                    });
                    setNumTestAssignments(numTestAssignments + 1);
                    updateAverage(newCategories, catIdx);
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
                      updateAverage(newCategories, catIdx);
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
                          item?.assignments?.length
                        ).fill(null);
                      }
                      newCategories[catIdx].assignments![idx] = a;
                      updateAverage(newCategories, catIdx);
                      return newCategories;
                    });
                  }}
                />
              </GradebookCard>
            </View>
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

const GradebookMemo = React.memo(Gradebook);
export default GradebookMemo;
