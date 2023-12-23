import React from "react";
import { Text, View } from "react-native";
import { Course } from "scorecard-types";
import GradebookCard from "./GradebookCard";
import CategoryTable from "./CategoryTable";

export default function Gradebook(props: { course: Course }) {
  return (
    <View>
      <GradebookCard
        title="Assignments"
        bottom={["View All", "Add"]}
        buttonAction={() => {}}
      >
        <CategoryTable category={props.course.gradeCategories[0]} />
      </GradebookCard>
    </View>
  );
}
