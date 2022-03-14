import LinearGradient from 'react-native-linear-gradient';
import {Course} from '../../../lib/types/Course';
import CourseCard from '../../summary/CourseCard';
import GradeSheet from '../../summary/GradeSheet/GradeSheet';

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CourseContext from '../../summary/CourseContext';

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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
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
    {
      courseName: 'Geometry',
      average: 'P',
      otherFields: {
        Teacher: 'Johny Appleseed',
      },
    },
  ];

  const [scrollingEnabled, setScrollingEnabled] = useState(true);
  const [highlightedCourse, setHighlightedCourse] = useState<
    [Course, number] | undefined
  >(undefined);
  return (
    <ScrollView scrollEnabled={scrollingEnabled}>
      <CourseContext
        setScrollingEnabled={setScrollingEnabled}
        course={highlightedCourse}
        setCourse={setHighlightedCourse}
      />
      <View style={styles.view}>
        {courses.map((c, idx) => {
          return (
            <React.Fragment key={idx}>
              <CourseCard
                course={c}
                pinned={idx % 2 === 0}
                index={idx}
                highlightedCourse={highlightedCourse}
                setHighlightedCourse={setHighlightedCourse}
              />
            </React.Fragment>
          );
        })}
      </View>
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
