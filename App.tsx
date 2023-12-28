import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appearance, StyleSheet, useColorScheme } from "react-native";
import ScorecardScreen from "./components/screens/ScorecardScreen";
import StartScreen from "./components/screens/AccountScreen";
import {
  MobileDataContext,
  MobileDataProvider,
} from "./components/core/context/MobileDataContext";
import { useEffect, useMemo, useState } from "react";
import { DataContext, GradebookRecord } from "scorecard-types";
import StartingScreen from "./components/screens/StartingScreen";
import Color from "./lib/Color";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { AnekKannada_400Regular } from "@expo-google-fonts/anek-kannada";
import CourseScreen from "./components/screens/CourseScreen";
import { BottomSheetContext } from "@gorhom/bottom-sheet/lib/typescript/contexts";
import { BottomSheetProvider } from "./components/core/context/BottomSheetContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    AnekKannada_400Regular,
  });

  const [data, setData] = useState<GradebookRecord | null>(null);
  const [gradeCategory, setGradeCategory] = useState<number>(0);
  const [courseDisplayNames, setCourseDisplayNames] = useState<{
    [key: string]: string;
  }>({});

  const appearance = useColorScheme();

  const dataContext = useMemo(
    () => ({
      data,
      setData,
      gradeCategory,
      setGradeCategory,
      courseDisplayNames,
      setCourseDisplayNames,
    }),
    [
      data,
      gradeCategory,
      setGradeCategory,
      courseDisplayNames,
      setCourseDisplayNames,
    ]
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <DataContext.Provider value={dataContext}>
      <MobileDataContext.Provider value={mobileData}>
        <BottomSheetProvider>
          <NavigationContainer
            theme={appearance === "dark" ? Color.DarkTheme : Color.LightTheme}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="starting"
                component={StartingScreen}
                options={{
                  title: "Initializing App",
                  headerBackVisible: false,
                }}
              />

              <Stack.Screen
                name="account"
                component={StartScreen}
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
      </MobileDataContext.Provider>
    </DataContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
