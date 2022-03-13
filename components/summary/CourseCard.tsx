import React, {useContext, useEffect, useState} from 'react';
import {useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated,
} from 'react-native';
import {AppearanceContext, Dark, Light} from '../../App';
import Grade from './Grade';
import PinButton from '../button/PinButton';
import GradeSheet from './GradeSheet';
import {SheetManager} from 'react-native-actions-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Easing} from 'react-native-reanimated';
import {Course} from '../../lib/types/Course';

type ICourseCardProps = {
  course: Course;
  pinned: boolean;
  index: number;
  highlightedCourse: Course;
  setHighlightedCourse: React.Dispatch<React.SetStateAction<Course>>;
};

export default function CourseCard({
  course,
  pinned,
  index,
  highlightedCourse,
  setHighlightedCourse,
}: ICourseCardProps) {
  // const widthAnim = useRef(new Animated.Value(0)).current;

  const [expanded, setExpanded] = useState(false);

  const usingDarkMode = useContext(AppearanceContext).appearance !== 'light';

  const handlePress = () => {
    if (highlightedCourse == null) {
      SheetManager.show('GradeSheet_' + index);
    } else {
      setHighlightedCourse(course);
    }
  };

  const handleLongPress = () => {
    setHighlightedCourse(course);
  };

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue:
        highlightedCourse == null ||
        JSON.stringify(highlightedCourse) === JSON.stringify(course)
          ? 1
          : 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [highlightedCourse]);

  return (
    <Animated.View style={styles.cardWrapper}>
      <TouchableOpacity
        underlayColor="none"
        onPress={handlePress}
        onLongPress={handleLongPress}>
        <Animated.View
          style={{
            ...styles.card,
            backgroundColor: !usingDarkMode
              ? Light.colors.card
              : Dark.colors.card,
            opacity: opacity,
          }}>
          <>
            <Text
              numberOfLines={1}
              style={{
                ...styles.courseName,
                color: !usingDarkMode ? Light.colors.text : Dark.colors.text,
              }}>
              {course.courseName}
            </Text>

            <View style={styles.bottomContainer}>
              <Grade average={course.average} />
              <PinButton pinned={pinned} />
            </View>

            <GradeSheet index={index} />
          </>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    alignSelf: 'flex-start',
    flex: 1,
    flexBasis: '50%',
    padding: 8,
    flexGrow: 0,
  },
  card: {
    padding: 16,
    borderRadius: 10,

    shadowColor: '#000000',
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bottomContainer: {
    height: 36,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
