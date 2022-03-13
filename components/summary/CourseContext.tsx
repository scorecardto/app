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
import CloseButton from '../button/CloseButton';
import Grade from './Grade';
import PinButton from '../button/PinButton';
import Checkbox from '../interactive/Checkbox';
import LabeledCheckbox from '../interactive/LabeledCheckbox';

type ICourseContextProps = {};

export default function CourseContext({}: ICourseContextProps) {
  const usingDarkMode = useContext(AppearanceContext).appearance !== 'light';

  return (
    <Animated.View style={styles.cardWrapper}>
      <TouchableHighlight underlayColor="none">
        <Animated.View
          style={{
            ...styles.card,
            backgroundColor: !usingDarkMode
              ? Light.colors.card
              : Dark.colors.card,
          }}>
          <>
            <Text
              numberOfLines={1}
              style={{
                ...styles.courseName,
                color: !usingDarkMode ? Light.colors.text : Dark.colors.text,
              }}>
              {'Geography'}
            </Text>

            <LabeledCheckbox label="Weighted" />

            <View style={styles.bottomContainer}>
              <View style={styles.bottomContainerLeft}>
                <Grade average={'100'} />
                <PinButton pinned={true} />
              </View>
              <CloseButton />
            </View>
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
    flexBasis: '100%',
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
});
