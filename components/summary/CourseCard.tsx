import React, {useContext, useState} from 'react';
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
import PinButton from './PinButton';
import GradeSheet from './GradeSheet';
import {SheetManager} from 'react-native-actions-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Easing} from 'react-native-reanimated';

type ICourseCardProps = {
  courseName: string;
  average: string;
  pinned: boolean;
  index: number;
};

export default function CourseCard({
  courseName,
  average,
  pinned,
  index,
}: ICourseCardProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const [expanded, setExpanded] = useState(false);

  const usingDarkMode = useContext(AppearanceContext) !== 'light';

  const handlePress = () => {
    SheetManager.show('GradeSheet_' + index);
  };

  const handleLongPress = () => {
    if (expanded) {
      setExpanded(false);
      Animated.timing(widthAnim, {
        toValue: 0,
        duration: 0,
      }).start();

      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 0,
      }).start();
    } else {
      setExpanded(true);

      Animated.timing(widthAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
      }).start();

      Animated.timing(heightAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
      }).start();
    }
  };

  return (
    <Animated.View
      style={{
        ...styles.cardWrapper,
        flexBasis: widthAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['50%', '100%'],
        }),
      }}>
      <TouchableHighlight
        underlayColor="none"
        onPress={handlePress}
        onLongPress={handleLongPress}>
        <Animated.View
          style={{
            ...styles.card,
            backgroundColor: !usingDarkMode
              ? Light.colors.card
              : Dark.colors.card,
            height: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [96, 200],
            }),
          }}>
          <>
            <Text
              numberOfLines={1}
              style={{
                ...styles.courseName,
                color: !usingDarkMode ? Light.colors.text : Dark.colors.text,
              }}>
              {courseName}
            </Text>

            <View style={styles.bottomContainer}>
              <Grade average={average} />
              <PinButton pinned={pinned} />
            </View>

            <GradeSheet index={index} />
          </>
        </Animated.View>
      </TouchableHighlight>
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
