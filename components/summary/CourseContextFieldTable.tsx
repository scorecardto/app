import React, {useContext} from 'react';
import {
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {GestureEvent, ScrollView} from 'react-native-gesture-handler';
import {AppearanceContext} from '../../App';
import {CourseFields} from '../../lib/types/Course';

type ICourseContextFieldTableProps = {
  fields: CourseFields;
};

export default function CourseContextFieldTable({
  fields,
}: ICourseContextFieldTableProps) {
  const appearance = useContext(AppearanceContext);

  const onScroll = (s: NativeSyntheticEvent<NativeScrollEvent>) => {
    s.stopPropagation();
  };

  return (
    <View>
      {Object.entries(fields).map((field, idx) => {
        return (
          <React.Fragment key={idx}>
            <Text style={{...styles.key, color: appearance[400]}}>
              {field[0]}
            </Text>
            <Text style={{...styles.value, color: appearance[400]}}>
              {field[1]}
            </Text>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  keyColumn: {
    marginRight: 15,
  },
  key: {
    fontWeight: '500',
    marginTop: 5,
  },
  value: {
    fontWeight: '400',
    marginTop: 5,
    marginBottom: 15,
  },
});
