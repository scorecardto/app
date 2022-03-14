import React, {useContext, useState} from 'react';
import {useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated,
  Alert,
  Touchable,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';
import {AppearanceContext, Dark, Light} from '../../App';
import CloseButton from '../button/CloseButton';
import Grade from './Grade';
import PinButton from '../button/PinButton';
import Checkbox from '../interactive/Checkbox';
import LabeledCheckbox from '../interactive/LabeledCheckbox';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CourseContextFieldTable from './CourseContextFieldTable';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Course} from '../../lib/types/Course';
import Card from '../interactive/Card';
import {SheetManager} from 'react-native-actions-sheet';

type ICourseContextProps = {
  course: [Course, number];
  setCourse: React.Dispatch<React.SetStateAction<[Course, number]>>;
  setScrollingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CourseContext({
  course,
  setCourse,
  setScrollingEnabled,
}: ICourseContextProps) {
  const appearance = useContext(AppearanceContext);

  const handleRename = () => {
    Alert.prompt('Rename', undefined, (s: string) => {
      console.log(s);
    });
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [initialX, setInitialX] = useState(0);
  const deltaX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const scale = useRef(new Animated.Value(1)).current;
  const [scaleState, setScaleState] = useState(1);

  const [componentEnabled, setComponentEnabled] = useState(true);

  const onTouchStart = (s: GestureResponderEvent) => {
    if (!componentEnabled) return;
    setInitialX(s.nativeEvent.pageX);
    setScrollingEnabled(false);
  };

  const onTouchMove = (s: GestureResponderEvent) => {
    if (!componentEnabled) return;
    const newDelta = Math.min(-1 * (initialX - s.nativeEvent.pageX), 0);

    Animated.timing(deltaX, {
      toValue: newDelta,
      duration: 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: Math.max(1 + (newDelta / windowWidth) * 2, 0.5),
      duration: 0,
      useNativeDriver: true,
    }).start();

    if (newDelta / windowWidth < -0.2) {
      if (scaleState !== 0.9) {
        setScaleState(0.9);
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else if (scaleState !== 1) {
      setScaleState(1);
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const onTouchEnd = (s: GestureResponderEvent) => {
    if (!componentEnabled) return;
    setScrollingEnabled(true);

    if (
      Math.min(-1 * (initialX - s.nativeEvent.pageX), 0) / windowWidth <
      -0.2
    ) {
      Animated.timing(deltaX, {
        toValue: -1 * windowWidth,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(deltaX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start();

        Animated.timing(opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start();

        Animated.timing(scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start();

        setCourse(undefined);
      }, 200);
    } else {
      Animated.timing(deltaX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCloseButton = () => {
    Animated.timing(deltaX, {
      toValue: -1 * windowWidth,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(scale, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(deltaX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();

      Animated.timing(scale, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();

      setCourse(undefined);
    }, 200);
  };

  const handleAssignmentsButton = () => {
    handleCloseButton();
    SheetManager.show(`GradeSheet_${course[1]}`);
  };

  return (
    <Animated.View
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        ...styles.cardWrapper,
        transform: [{translateX: deltaX}, {scale: scale}],
        opacity: opacity,
      }}>
      {course != null ? (
        <Animated.View
          style={{
            ...styles.card,
            backgroundColor:
              appearance.appearance === 'light'
                ? Light.colors.card
                : Dark.colors.card,
          }}>
          <>
            <View style={styles.topContainer}>
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.courseName,
                    color: appearance[700],
                  }}>
                  {course[0].courseName}
                </Text>

                <View style={styles.renameWrapper}>
                  <TouchableOpacity onPress={handleRename}>
                    <Text style={{color: appearance[500]}}>Rename</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={handleAssignmentsButton}>
                <Card
                  label="Assignments"
                  colored={true}
                  icon="tag-outline"
                  sfIcon="tag"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.tableWrapper}>
              <ScrollView>
                <CourseContextFieldTable fields={course[0].otherFields} />
              </ScrollView>
            </View>

            <LabeledCheckbox label="Weighted" />

            <View style={styles.bottomContainer}>
              <View style={styles.bottomContainerLeft}>
                <Grade average={course[0].average} />
                <PinButton pinned={true} />
              </View>
              <CloseButton onPress={handleCloseButton} />
            </View>
          </>
        </Animated.View>
      ) : (
        <></>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 8,
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
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainerLeft: {
    flexDirection: 'row',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  gradeWrapper: {
    marginRight: 10,
  },
  renameWrapper: {
    paddingVertical: 5,
  },
  tableWrapper: {
    marginVertical: 10,
    maxHeight: 300,
    overflow: 'scroll',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
