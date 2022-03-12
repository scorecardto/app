import React from 'react';
import {View, ScrollView, Text, Button} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';

type IGradeSheetProps = {
  index: number;
};

export default function GradeSheet({index}: IGradeSheetProps) {
  return (
    <View>
      <ActionSheet id={`GradeSheet_${index}`}>
        <ScrollView>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
          <Text>Hello World</Text>
        </ScrollView>
      </ActionSheet>
    </View>
  );
}
