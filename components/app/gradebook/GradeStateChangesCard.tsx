import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import captureCourseState from "../../../lib/captureCourseState";
import TableRow from "./TableRow";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import {ChangeTable, ChangeTableEntry} from "../../../lib/types/ChangeTableEntry";

export default function GradeStateChangesCard(props: {
  course: Course;
  onFinished: () => void;
  gradeChangeTable: ChangeTable;
}) {
  const colors = useColors();
  const accents = useAccents();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      maxHeight: 500,
      marginHorizontal: 24,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      fontSize: 20,
      color: colors.primary,
      flex: 1,
    },
    headerGrade: {
      fontSize: 17,
      color: colors.primary,
      marginLeft: 6,
    },
    footer: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
      paddingHorizontal: 24,
    },
    footerLeft: {
      flexDirection: "column",
    },
    footerText: {
      marginTop: 4,
      fontSize: 14,
      color: colors.text,
    },
    buttonText: {
      fontSize: 16,
      color: accents.primary,
    },
    buttonWrapper: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 12,
      alignSelf: "center",
      backgroundColor: accents.secondary,
    },
  });

  return (
    <View>
      <ScrollView style={styles.wrapper}>
        <View style={styles.header}>
          <MediumText
            numberOfLines={2}
            ellipsizeMode={"tail"}
            style={styles.headerText}
          >
            New Grades
          </MediumText>
          <TouchableOpacity
            onPress={() => {
              props.onFinished();
            }}
          >
            <View style={styles.buttonWrapper}>
              <MediumText style={styles.buttonText}>{"Done"}</MediumText>
            </View>
          </TouchableOpacity>
        </View>
        {[props.gradeChangeTable.newGrades, props.gradeChangeTable.removedGrades].flat(2).map((g: ChangeTableEntry, idx) => (
          <TableRow
            key={idx}
            name={g.assignmentName}
            grade={g.primaryData}
            worth={g.secondaryData}
          />
        ))}
      </ScrollView>
    </View>
  );
}
