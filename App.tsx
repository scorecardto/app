import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ScorecardScreen from "./components/screens/ScorecardScreen";
import StartScreen from "./components/screens/AccountScreen";
import {
  MobileDataContext,
  MobileDataProvider,
} from "./components/core/context/MobileDataContext";
import { useMemo, useState } from "react";
import { DataContext, GradebookRecord } from "scorecard-types";
import StartingScreen from "./components/screens/StartingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [data, setData] = useState<GradebookRecord | null>(null);
  const [gradeCategory, setGradeCategory] = useState<number>(0);
  const [courseDisplayNames, setCourseDisplayNames] = useState<{
    [key: string]: string;
  }>({});

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

  return (
    <DataContext.Provider value={dataContext}>
      <MobileDataContext.Provider value={mobileData}>
        <NavigationContainer>
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
                headerBackVisible: false,
                title: "Account",
              }}
            />
            <Stack.Screen
              name="scorecard"
              component={ScorecardScreen}
              options={{
                headerBackVisible: false,
                title: "Scorecard",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
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
