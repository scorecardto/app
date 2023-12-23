import React, { useRef, useState } from "react";
import { Dimensions, Text, View, ViewStyle } from "react-native";
import { Course, GradeCategory } from "scorecard-types";
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

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function Gradebook(props: { course: Course }) {
  const { colors } = useTheme();
  const ref = useRef<Carousel<GradeCategory>>(null);

  const cardAnimation = useDynamicAnimation(() => ({
    opacity: 1,
    translateX: 0,
  }));

  const [animatedIndex, setAnimatedIndex] = useState(0);

  const [currentCard, setCurrentCard] = useState(0);

  const cardSnapAnimation: DynamicStyleProp<ExcludeFunctionKeys<ViewStyle>> = {
    opacity: [
      {
        value: 0,
        duration: 0,
        type: "timing",
      },
      {
        value: 1,
        duration: 300,
      },
    ],
    translateX: [
      {
        value: 100,
        duration: 0,
        type: "timing",
      },
      {
        value: 0,
        damping: 100,
        type: "spring",
      },
    ],
    scale: [
      {
        value: 0.75,
        duration: 0,
        type: "timing",
      },
      {
        value: 1,
        damping: 100,
        type: "spring",
        velocity: 1.5,
      },
    ],
  };

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
          width: 16,
          height: 3,
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
                  index={-1}
                  totalCarouselLength={props.course.gradeCategories.length + 1}
                >
                  <SummaryTable
                    course={props.course}
                    changeGradeCategory={(c) => {
                      ref.current.snapToItem(c + 1, false);
                      setAnimatedIndex(c + 1);
                      cardAnimation.animateTo(cardSnapAnimation);
                      Haptics.selectionAsync();
                    }}
                  />
                </GradebookCard>
              </View>
            );
          }
          return (
            <MotiView
              state={index === animatedIndex ? cardAnimation : undefined}
            >
              <GradebookCard
                key={index}
                title={item.name}
                bottom={[`Weight: ${item.weight}%`]}
                buttonAction={() => {}}
                index={index - 1}
                totalCarouselLength={props.course.gradeCategories.length + 1}
              >
                <CategoryTable category={item} />
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
