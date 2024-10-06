import React, {
  MutableRefObject,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { Assignment, GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import AssignmentSheet from "./sheets/AssignmentSheet";
import AssignmentTableRow from "./AssignmentTableRow";
import {useSelector} from "react-redux";
import {RootState} from "../../core/state/store";

export default function CategoryTable(props: {
  courseKey: string;
  category: GradeCategory;
  modifiedAssignments: (Assignment | null)[] | null;
  modifyAssignment(a: Assignment, index: number): void;
  removeAssignment(index: number): void;
  testing: boolean;
  index: number;
  carouselChangeHandlers: MutableRefObject<((idx: number) => void)[]>;
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    props.carouselChangeHandlers.current = [
      ...props.carouselChangeHandlers.current,
      (idx) => {
        idx == props.index && scrollRef.current?.flashScrollIndicators();
      },
    ];
  }, []);

  const gradeChanges = useSelector((s: RootState) => s.gradeData.gradeChanges);
  return (
    <ScrollView alwaysBounceVertical={false} ref={scrollRef}>
      {new Array(
        (props.modifiedAssignments ?? props.category.assignments!).length
      )
        .fill(null)
        .map((_, index) => {
          const assignment =
            props.category.assignments![index] ??
            props.modifiedAssignments[index];

          return (
            <AssignmentTableRow
              gradeChanges={gradeChanges.assignments[props.courseKey]?.[props.category.id]?.[assignment.name!]}
              testing={index >= props.category.assignments.length}
              removeAssignment={() => props.removeAssignment(index)}
              key={index}
              assignment={assignment}
              setModifiedAssignment={(a) => {
                props.modifyAssignment(a, index);
              }}
            />
          );
        })}
    </ScrollView>
  );
}
