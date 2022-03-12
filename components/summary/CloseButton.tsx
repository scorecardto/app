import React, {useContext} from 'react';

import {View, StyleSheet} from 'react-native';
import {AppearanceContext, ThemeContext} from '../../App';
import {ColorThemeWithAppearance} from '../../lib/types/ColorTheme';
import {ColorSchemeName} from 'react-native';
import {SFSymbol} from '../util/SFSymbol';

export default function PinButton() {
  const appearance: ColorSchemeName = useContext(AppearanceContext);

  return (
    <View
      style={{
        ...styles.background,
        backgroundColor: pinned
          ? theme.dark[700]
          : theme.light[appearance === 'light' ? 100 : 300],
      }}>
      <SFSymbol
        name={'pin.fill'}
        weight="semibold"
        scale="large"
        color={
          pinned ? '#FFFFFF' : theme.light[appearance === 'light' ? 300 : 100]
        }
        size={12}
        resizeMode="center"
        multicolor={false}
        style={{width: 32, height: 32}}
      />
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
