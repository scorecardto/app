// import 'react-native-gesture-handler';

// import React, {useCallback, useMemo, useRef} from 'react';
// import {View, Text, StyleSheet, Button} from 'react-native';
// import GradeSheet from './components/summary/GradeSheet';
// const App = () => {
//   // renders
//   return (
//     <View style={styles.container}>
//       <GradeSheet />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: 'grey',
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
// });

// export default App;

import 'react-native-gesture-handler';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import React, {useState, useEffect, useCallback, createContext} from 'react';
import {Appearance, ColorSchemeName, useColorScheme} from 'react-native';
import {AppScreen} from '../types/AppScreen';
import Navigation from './components/structure/Navigation';
import CoursesScreen from './components/structure/screens/CoursesScreen';

import {
  AppearanceColors,
  ColorThemeWithAppearance,
  DAY_COLORS,
  NIGHT_COLORS,
  THEME_JADE,
  THEME_PACIFIC,
  THEME_ROSE,
  THEME_WARM,
} from './lib/types/ColorTheme';
import GradeSheet from './components/summary/GradeSheet/GradeSheet';

export const AppearanceContext = createContext(DAY_COLORS);
export const ThemeContext = createContext(THEME_PACIFIC);

export const Light: Theme = {
  ...DefaultTheme,
};

export const Dark: Theme = {
  ...DarkTheme,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(14, 14, 15)',
    card: 'rgb(37, 42, 46)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

export default function App() {
  // holds light dark mode state
  const [appearance, setAppearance] = useState<AppearanceColors>(
    useColorScheme() === 'light' ? DAY_COLORS : NIGHT_COLORS,
  );

  const [theme, setTheme] = useState<ColorThemeWithAppearance>(THEME_PACIFIC);

  // update state when theme changes
  const appearanceChangeListener = useCallback(() => {
    setAppearance(
      Appearance.getColorScheme() === 'light' ? DAY_COLORS : NIGHT_COLORS,
    );
  }, []);

  // call themeChangeListener when theme changes
  useEffect(() => {
    Appearance.addChangeListener(appearanceChangeListener);
    return () => Appearance.removeChangeListener(appearanceChangeListener);
  }, [appearanceChangeListener]);

  const screens: AppScreen[] = [
    {
      title: 'Courses',
      component: CoursesScreen,
    },
  ];

  return (
    <AppearanceContext.Provider value={appearance}>
      <ThemeContext.Provider value={theme}>
        <NavigationContainer
          theme={appearance.appearance === 'light' ? Light : Dark}>
          <Navigation screens={screens} />
        </NavigationContainer>
      </ThemeContext.Provider>
    </AppearanceContext.Provider>
  );
}
