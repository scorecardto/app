import React, {useContext} from 'react';

import {View, StyleSheet} from 'react-native';
import {AppearanceContext} from '../../App';
import {SFSymbol} from '../util/SFSymbol';

export default function CloseButton() {
  const appearance = useContext(AppearanceContext);

  return (
    <View
      style={{
        ...styles.background,
        backgroundColor: appearance[600],
      }}>
      {/* <SFSymbol
        name={'xmark'}
        weight="semibold"
        scale="large"
        size={12}
        resizeMode="center"
        multicolor={false}
        style={{width: 32, height: 32}}
        color={appearance[500]}
      /> */}
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
