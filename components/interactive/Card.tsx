import React, {useContext} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppearanceContext, ThemeContext} from '../../App';
import {SFSymbol} from '../util/SFSymbol';
type ICardProps = {
  label: string;
  icon?: string;
  sfIcon?: string;
  colored: boolean;
};

export default function Card({label, icon, sfIcon, colored}: ICardProps) {
  const theme = useContext(ThemeContext);
  const appearance = useContext(AppearanceContext);

  return (
    <View
      style={{
        ...styles.background,
        backgroundColor: colored
          ? theme[appearance.appearance][100]
          : appearance[600],
      }}>
      {icon && (
        <View style={styles.iconWrapper}>
          {Platform.OS !== 'ios' || !sfIcon ? (
            <Icon
              name={icon}
              size={20}
              color={
                colored ? theme[appearance.appearance][200] : appearance[500]
              }
            />
          ) : (
            <SFSymbol
              name={sfIcon}
              weight="semibold"
              scale="large"
              color={
                colored ? theme[appearance.appearance][200] : appearance[500]
              }
              size={12}
              resizeMode="center"
              multicolor={false}
              style={{width: 20, height: 20}}
            />
          )}
        </View>
      )}
      <View style={styles.labelWrapper}>
        <Text
          style={{
            ...styles.label,
            color: colored
              ? theme[appearance.appearance][200]
              : appearance[500],
          }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  labelWrapper: {
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
