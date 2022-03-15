import React, {useContext, useEffect, useRef} from 'react';

import {View, StyleSheet, Platform, Animated} from 'react-native';
import {AppearanceContext} from '../../App';
import {SFSymbol} from '../util/SFSymbol';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

type IExpandButtonProps = {
  opened: boolean;
};

export default function ExpandButton({opened}: IExpandButtonProps) {
  const appearance = useContext(AppearanceContext);

  const openAnim = useRef(new Animated.Value(opened ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(openAnim, {
      toValue: opened ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [opened]);

  return (
    <Animated.View
      style={{
        ...styles.background,
        backgroundColor: appearance[600],
        transform: [
          {
            rotate: openAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '90deg'],
            }),
          },
        ],
      }}>
      {Platform.OS === 'ios' ? (
        <SFSymbol
          name={'chevron.right'}
          weight="semibold"
          scale="large"
          color={appearance[500]}
          size={12}
          resizeMode="center"
          multicolor={false}
          style={{width: 32, height: 32}}
        />
      ) : (
        <Icon name="chevron-right" size={22} color={appearance[500]} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 36,
    width: 36,
    alignSelf: 'flex-end',
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
});
