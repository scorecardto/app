import React, {useContext} from 'react';

import {View, StyleSheet, Platform} from 'react-native';
import {AppearanceContext} from '../../App';
import {SFSymbol} from '../util/SFSymbol';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CloseButton() {
  const appearance = useContext(AppearanceContext);

  return (
    <View
      style={{
        ...styles.background,
        backgroundColor: appearance[600],
      }}>
      {Platform.OS === 'ios' ? (
        <SFSymbol
          name={'xmark'}
          weight="semibold"
          scale="large"
          color={appearance[500]}
          size={12}
          resizeMode="center"
          multicolor={false}
          style={{width: 32, height: 32}}
        />
      ) : (
        <Icon name="close" size={22} color={appearance[500]} />
      )}
    </View>
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
