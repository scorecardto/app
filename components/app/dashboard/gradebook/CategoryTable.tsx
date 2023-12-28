import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { GradeCategory } from "scorecard-types";
import TableRow from "./TableRow";
import GradeSheet from "./GradeSheet";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";

export default function CategoryTable(props: { category: GradeCategory }) {
  const sheets = useContext(BottomSheetContext);

  return (
    <View>
      {props.category?.assignments?.map((assignment, idx) => {
        return (
          <TableRow
            key={idx}
            name={assignment.name}
            grade={assignment.grade}
            worth={
              assignment.dropped
                ? "Dropped"
                : "worth " +
                  assignment.count.toString() +
                  "pt" +
                  (assignment.count === 1 ? "" : "s")
            }
            onPress={() => {
              sheets.addSheet(({ close }) => (
                <GradeSheet assignment={assignment} close={close} />
              ));
            }}
          />
        );
      })}
    </View>
  );
}
