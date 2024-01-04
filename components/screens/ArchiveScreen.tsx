import { View, Text } from "react-native";
import React, { useContext } from "react";
import { useTheme } from "@react-navigation/native";
import Header from "../text/Header";
import { DataContext } from "scorecard-types";
import ArchiveCourseCard from "../app/archive/ArchiveCourseCard";

export default function ArchiveScreen() {
  const { colors } = useTheme();

  const data = useContext(DataContext);

  const cellCount =
    Math.ceil((data.data?.gradeCategoryNames.length || 0) / 4) * 4;

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          zIndex: 1,
        }}
      >
        <Header header="Archive" subheader="Past Grading Periods" />
      </View>

      <View
        style={{
          paddingHorizontal: 12,
        }}
      >
        {data.data?.courses.map((course, idx) => {
          return (
            <ArchiveCourseCard
              course={course}
              key={idx}
              cellCount={cellCount}
            />
          );
        })}
      </View>
    </View>
  );
}
