import React, {useContext, useEffect, useRef} from 'react';

import {View, StyleSheet, Animated} from 'react-native';
import {AppearanceContext, ThemeContext} from '../../App';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ICheckboxProps = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Checkbox({checked}: ICheckboxProps) {
  const appearance = useContext(AppearanceContext);
  const theme = useContext(ThemeContext);

  const checkedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('setting to ' + (checked ? 1 : 0));

    Animated.timing(checkedAnim, {
      toValue: checked ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  return (
    <Animated.View
      style={{
        ...styles.checkbox,
        ...(checked ? styles.enabled : styles.disabled),
        ...(checked ? {} : {borderColor: appearance[400]}),
        backgroundColor: checkedAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [appearance[100], theme.light[200]],
        }),
      }}>
      {checked && <Icon name="check" color="#FFFFFF" size={16} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    borderWidth: 2,
  },
  enabled: {},
});
