import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Assignment} from '../../../lib/types/Course';
import Grade from '../Grade';
import GradeWithWeight from '../GradeWithWeight';

type IAssignmentRowProps = {
  assignment: Assignment;
};

export default function AssignmentRow({assignment}: IAssignmentRowProps) {
  return (
    <View style={styles.row}>
      <Text>{assignment.name}</Text>
      <View>
        <GradeWithWeight average={assignment.grade} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
