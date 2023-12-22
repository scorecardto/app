import React from "react";
import { Text, View } from "react-native";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { DataContext } from "scorecard-types";
import Header from "../text/Header";

export default function CourseScreen({ route, navigation }) {
  const { key } = route.params;

  const dataContext = React.useContext(DataContext);

  const course = dataContext.data?.courses.find((c) => c.key === key);

  if (course == null) {
    return (
      <View>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <View>
      <Header header={course.name} />
    </View>
  );
}
