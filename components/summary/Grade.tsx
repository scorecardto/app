import React, {useContext} from 'react';
import {Text, View, StyleSheet, ColorSchemeName} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppearanceContext, ThemeContext} from '../../App';
import {ColorTheme, ColorThemeWithAppearance} from '../../lib/types/ColorTheme';
import {SFSymbol} from '../util/SFSymbol';
import GradeSheet from './GradeSheet';

type IGradeProps = {
  average: string;
};
export default function Grade({average}: IGradeProps) {
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

      {gradeDisplay === 'unsure' ? (
        <View style={{...styles.error, backgroundColor: theme.light[800]}}>
          {
            <SFSymbol
              name={'questionmark'}
              weight="semibold"
              scale="large"
              color={'#FFFFFF'}
              size={8}
              resizeMode="center"
              multicolor={false}
              style={{width: 20, height: 20}}
            />
          }
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
    marginRight: 10,
  },
  gradientWrapper: {
    alignSelf: 'flex-start',
    justifySelf: 'flex-end',
    borderRadius: 13,
    overflow: 'hidden',
  },
  text: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
});
