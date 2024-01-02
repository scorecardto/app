import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appearance, StyleSheet, Text, useColorScheme } from "react-native";
import ScorecardScreen from "./components/screens/ScorecardScreen";
import AccountScreen from "./components/screens/AccountScreen";
import {
  MobileDataContext,
  MobileDataProvider,
} from "./components/core/context/MobileDataContext";
import { useEffect, useMemo, useState } from "react";
import {
  CourseSettings,
  DataContext,
  DataProvider,
  GradebookRecord,
} from "scorecard-types";
import Color from "./lib/Color";
import * as Font from "expo-font";
import AnekKannada, {
  AnekKannada_400Regular,
} from "@expo-google-fonts/anek-kannada";
import CourseScreen from "./components/screens/CourseScreen";
import { BottomSheetContext } from "@gorhom/bottom-sheet/lib/typescript/contexts";
import BottomSheetProvider from "./components/util/BottomSheet/BottomSheetProvider";
import * as SplashScreen from "expo-splash-screen";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import initialize from "./lib/init";
import AnimatedAppLoader from "./components/screens/loader/AnimatedAppLoader";

import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  const [data, setData] = useState<GradebookRecord | null>(null);
  const [gradeCategory, setGradeCategory] = useState<number>(0);
  const [courseSettings, setCourseSettings] = useState<{
    [key: string]: CourseSettings;
  }>({});

  const appearance = useColorScheme();

  const dataContext = useMemo(
    () => ({
      data,
      setData,
      gradeCategory,
      setGradeCategory,
      courseSettings,
      setCourseSettings,
      courseOrder: undefined,
      setCourseOrder: () => {},
    }),
    [data, gradeCategory, setGradeCategory, courseSettings, setCourseSettings]
  );
  const [district, setDistrict] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referer, setReferer] = useState("");
  const [sessionId, setSessionId] = useState("");

  const mobileData = useMemo<MobileDataProvider>(
    () => ({
      district,
      setDistrict,
      username,
      setUsername,
      password,
      setPassword,
      referer,
      setReferer,
      sessionId,
      setSessionId,
    }),
    [
      district,
      setDistrict,
      username,
      setUsername,
      password,
      setPassword,
      referer,
      setReferer,
      sessionId,
      setSessionId,
    ]
  );

  const [nextScreen, setNextScreen] = useState("");

  useEffect(() => {
    async function prepare() {
      const fontsAsync = Font.loadAsync({
        AnekKannada_400Regular: AnekKannada_400Regular,
        DMSans_400Regular: DMSans_400Regular,
        DMSans_500Medium: DMSans_500Medium,
        DMSans_700Bold: DMSans_700Bold,
      });

      const nextScreenAsync = initialize(dataContext, mobileData);

      const [_, nextScreen] = await Promise.all([fontsAsync, nextScreenAsync]);

      setNextScreen(nextScreen);

      await initialize(dataContext, mobileData);
    }

    prepare().then(() => {
      console.log("ready");

      setAppReady(true);
    });
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <DataContext.Provider value={dataContext}>
      <MobileDataContext.Provider value={mobileData}>
        {appReady && (
          <AnimatedAppLoader image={require("./assets/splash.png")}>
            <BottomSheetProvider>
              <NavigationContainer
                theme={{
                  ...(appearance === "dark"
                    ? Color.DarkTheme
                    : Color.LightTheme),
                  dark: appearance === "dark",
                  // @ts-ignore
                  accents:
                    Color.defaultAccents[
                      appearance === "dark" ? "dark" : "default"
                    ],
                  accentLabel: "red",
                }}
              >
                <Stack.Navigator initialRouteName={nextScreen}>
                  <Stack.Screen
                    name="account"
                    component={AccountScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="scorecard"
                    component={ScorecardScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="course"
                    component={CourseScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </BottomSheetProvider>
          </AnimatedAppLoader>
        )}
      </MobileDataContext.Provider>
    </DataContext.Provider>
  );
}
