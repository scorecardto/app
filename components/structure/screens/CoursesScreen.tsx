import LinearGradient from 'react-native-linear-gradient';
import {Course} from '../../../lib/types/Course';
import CourseCard from '../../summary/CourseCard';
import GradeSheet from '../../summary/GradeSheet';

import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default function CoursesScreen() {
  const courses: Course[] = [
    {
      courseName: 'Geography',
      average: '100',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
    {
      courseName: 'Biology',
      average: 'NG',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
    {
      courseName: 'Advanced English',
      average: '90',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
    {
      courseName: 'AP Computer Science',
      average: '60',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
    {
      courseName: 'Geometry',
      average: 'P',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.view}>
      {courses.map((c, idx) => {
        return (
          <React.Fragment key={idx}>
            <CourseCard {...c} pinned={idx % 2 === 0} index={idx} />
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  course: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  averageGradient: {
    alignSelf: 'flex-start',
    justifySelf: 'flex-end',
    borderRadius: 13,
    marginTop: 10,
  },
  average: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
