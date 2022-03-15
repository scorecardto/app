import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppearanceContext} from '../../../App';
import {Assignment} from '../../../lib/types/Course';
import ExpandButton from '../../button/ExpandButton';
import Grade from '../Grade';
import GradeWithWeight from '../GradeWithWeight';

type IAssignmentRowProps = {
  assignment: Assignment;
};

export default function AssignmentRow({assignment}: IAssignmentRowProps) {
  const appearance = useContext(AppearanceContext);
  const [opened, setOpened] = useState(false);

  const handlePress = () => {
    setOpened(!opened);
  };
  return (
    <View style={{...styles.row, borderColor: appearance[600]}}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              numberOfLines={1}
              style={{...styles.assignmentName, color: appearance[700]}}>
              {assignment.name}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <GradeWithWeight average={assignment.grade} />
            <ExpandButton opened={opened} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingLeft: 20,
    paddingRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  headerLeft: {
    justifyContent: 'center',
  },
  headerRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  assignmentName: {
    fontSize: 18,
    paddingBottom: 8,
    paddingRight: 12,
  },
});
