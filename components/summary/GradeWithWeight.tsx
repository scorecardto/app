import React, {useContext} from 'react';
import {Text, View, StyleSheet, ColorSchemeName, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppearanceContext, ThemeContext} from '../../App';
import {ColorTheme, ColorThemeWithAppearance} from '../../lib/types/ColorTheme';
import {SFSymbol} from '../util/SFSymbol';
import GradeSheet from './GradeSheet/GradeSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IGradeProps = {
  average: string;
};

export default function GradeWithWeight({average}: IGradeProps) {
  const theme: ColorThemeWithAppearance = useContext(ThemeContext);
  const gradeDisplay = isGradeHigh(average, 85);

  return (
    <View style={styles.background}>
      <View
        style={{
          ...styles.gradientWrapper,
          opacity: gradeDisplay === 'high' ? 1 : 0.5,
        }}>
        <LinearGradient
          colors={[theme.light[600], theme.light[700]]}
          angle={45}
          useAngle={true}>
          <Text style={styles.text}>{average}</Text>
        </LinearGradient>
      </View>

      <View
        style={{
          ...styles.weightWrapper,
          opacity: gradeDisplay === 'high' ? 1 : 0.5,
          backgroundColor: theme.light[400],
        }}>
        <View style={styles.weightIcon}>
          <Icon name="chart-bubble" size={22} color={'#FFFFFF'} />
        </View>
        <Text style={[styles.text, styles.weightText]}>{average}</Text>
      </View>

      {gradeDisplay === 'unsure' ? (
        <View style={{...styles.error, backgroundColor: theme.light[800]}}>
          {Platform.OS === 'ios' ? (
            <SFSymbol
              name={'questionmark'}
              weight="semibold"
              scale="large"
              color={'#FFFFFF'}
              size={10}
              resizeMode="center"
              multicolor={false}
              style={{width: 24, height: 24}}
            />
          ) : (
            <Icon name="help" size={14} color={'#FFFFFF'} />
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

const isGradeHigh = (
  grade: string,
  tolerance: number,
): 'high' | 'low' | 'unsure' => {
  const parsed = Number.parseInt(grade);
  if (!Number.isNaN(parsed)) {
    return Number.parseInt(grade) >= tolerance ? 'high' : 'low';
  }
  return 'unsure';
};

const styles = StyleSheet.create({
  background: {
    marginRight: 12,
    flexDirection: 'row',
  },
  gradientWrapper: {
    alignSelf: 'flex-start',
    justifySelf: 'flex-end',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  text: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    position: 'absolute',
    right: -7,
    bottom: -7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightWrapper: {
    alignSelf: 'flex-start',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  weightIcon: {
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  weightText: {
    paddingLeft: 0,
  },
});
