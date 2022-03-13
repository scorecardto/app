import React, {useContext} from 'react';

import {View, StyleSheet} from 'react-native';
import {AppearanceContext, ThemeContext} from '../../App';

type ICheckboxProps = {};

export default function Checkbox({}: ICheckboxProps) {
  const appearance = useContext(AppearanceContext);
  const theme = useContext(ThemeContext);
  const enabled = true;

  return (
    <View
      style={{
        ...(enabled ? styles.enabled : styles.disabled),
        ...(enabled
          ? {backgroundColor: theme.light[200]}
          : {borderColor: appearance[400]}),
      }}>
      {/* <Icon name="checkmark-sharp" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
  },
  enabled: {
    width: 20,
    height: 20,
  },
});
