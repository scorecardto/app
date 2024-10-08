import React, {MutableRefObject, useEffect, useRef} from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import {useSelector} from "react-redux";
import {RootState} from "../../core/state/store";

export default function SummaryTable(props: {
  course: Course;
  categories: GradeCategory[];
  modified: {
    assignments: (Assignment | null)[] | null;
    average: string | null;
  }[];
  changeGradeCategory: (category: number) => void;
  carouselChangeHandlers: MutableRefObject<((idx: number)=>void)[]>
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    props.carouselChangeHandlers.current = [...props.carouselChangeHandlers.current, idx => {
      idx == 0 && scrollRef.current?.flashScrollIndicators();
    }]
  }, []);

  const gradeChanges = useSelector((s: RootState) => s.gradeData.gradeChanges);
  return (
    <ScrollView
      style={{ maxHeight: Dimensions.get("window").height - 440 }}
      alwaysBounceVertical={false}
      ref={scrollRef}
    >
      {props.categories.map((item, index) => {
        const testing = index >= props.course.gradeCategories!.length;
        const grade = props.modified[index].average ?? item.average;

        return (
          <TableRow
            key={index}
            name={item.name}
            red={{
              name: testing,
              grade:
                testing ||
                !!props.modified[index].assignments ||
                props.modified[index].average !== null,
            }}
            changes={gradeChanges.gradeCategories[props.course.key]?.[item.id]}
            grade={grade && grade !== "NG" ? grade + "%" : "NG"}
            worth={"Worth " + item.weight.toString() + "%"}
            onPress={() => props.changeGradeCategory(index)}
          />
        );
      })}
    </ScrollView>
  );
}
