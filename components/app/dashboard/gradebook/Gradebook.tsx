import React, { useRef } from "react";
import { Dimensions, Text, View } from "react-native";
import { Course } from "scorecard-types";
import GradebookCard from "./GradebookCard";
import CategoryTable from "./CategoryTable";
import Carousel from "react-native-snap-carousel";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function Gradebook(props: { course: Course }) {
  const ref = useRef(null);
  return (
    <View>
      <Carousel
        ref={ref}
        data={props.course.gradeCategories}
        renderItem={({ item, index }) => {
          return (
            <GradebookCard
              key={index}
              title={item.name}
              bottom={[`Weight: ${item.weight}%`]}
              buttonAction={() => {}}
            >
              <CategoryTable category={item} />
            </GradebookCard>
          );
        }}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 48}
        vertical={false}
      />

      {props.course.gradeCategories.map((category, idx) => {
        return (
          <GradebookCard
            key={idx}
            title={category.name}
            bottom={[`Weight: ${category.weight}%`]}
            buttonAction={() => {}}
          >
            <CategoryTable category={category} />
          </GradebookCard>
        );
      })}
    </View>
  );
}
