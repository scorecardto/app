import React, {useContext} from 'react';

import {View, StyleSheet, Platform} from 'react-native';
import {AppearanceContext, ThemeContext} from '../../App';
import {ColorThemeWithAppearance} from '../../lib/types/ColorTheme';
import {ColorSchemeName} from 'react-native';
import {SFSymbol} from '../util/SFSymbol';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IPinButtonProps = {
  pinned: boolean;
};

export default function PinButton({pinned}: IPinButtonProps) {
  const theme: ColorThemeWithAppearance = useContext(ThemeContext);
  const appearance: ColorSchemeName = useContext(AppearanceContext).appearance;

  const color = pinned
    ? '#FFFFFF'
    : theme.light[appearance === 'light' ? 300 : 100];

  return (
    <View
      style={{
        ...styles.background,
        backgroundColor: pinned
          ? theme.dark[700]
          : theme.light[appearance === 'light' ? 100 : 300],
      }}>
      {Platform.OS === 'ios' ? (
        <SFSymbol
          name={'pin.fill'}
          weight="semibold"
          scale="large"
          color={color}
          size={12}
          resizeMode="center"
          multicolor={false}
          style={{width: 32, height: 32}}
        />
      ) : (
        <Icon name="pin" size={18} color={color} />
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
