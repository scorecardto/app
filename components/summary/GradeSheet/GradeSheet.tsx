import React, {useContext} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {AppearanceContext} from '../../../App';
import Card from '../../interactive/Card';
import AssignmentRow from './AssignmentRow';

type IGradeSheetProps = {
  index: number;
};

export default function GradeSheet({index}: IGradeSheetProps) {
  const appearance = useContext(AppearanceContext);

  return (
    <View>
      <ActionSheet
        id={`GradeSheet_${index}`}
        containerStyle={{...styles.sheet, backgroundColor: appearance[100]}}>
        <View style={styles.header}>
          <Text style={{...styles.courseName, color: appearance[700]}}>
            Course Name
          </Text>
        </View>

        <ScrollView style={styles.scroll}>
          <Card label="Settings" colored={true} icon={'cog'} sfIcon={'gear'} />
          <AssignmentRow
            assignment={{
              grade: '100',
              name: 'ProjectProProjectProProjectProProjectProProjectProProjectProProjectProProjectProProjectProProjectProProjectPro',
              weight: 10,
              otherFields: {},
            }}
          />
        </ScrollView>
      </ActionSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {},
  scroll: {
    paddingBottom: 50, // temp
  },
  header: {},
  courseName: {
    fontSize: 26,
    fontWeight: '700',
  },
});
