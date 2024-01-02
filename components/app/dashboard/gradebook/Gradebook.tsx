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
import { set } from "react-native-reanimated";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function Gradebook(props: { course: Course }) {
  const { accents } = useTheme();
  const ref = useRef<Carousel<GradeCategory>>(null);

  const cardAnimation = useDynamicAnimation(() => ({
    opacity: 1,
    translateX: 0,
  }));

  const [animatedIndex, setAnimatedIndex] = useState(0);

  const [currentCard, setCurrentCard] = useState(0);

  const [animatingCard, setAnimatingCard] = useState(-1);

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
          backgroundColor: accents.primary,
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
                buttonAction={() => {}}
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
