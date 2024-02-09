import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { MobileDataContext } from "./components/core/context/MobileDataContext";
import MobileDataProvider from "./components/core/context/MobileDataProvider";
import React, { useEffect, useMemo, useState } from "react";
import {
  CourseSettings,
  DataContext,
  GradebookNotification,
  GradebookRecord,
} from "scorecard-types";
import Color from "./lib/Color";
import * as Font from "expo-font";
import { AnekKannada_400Regular } from "@expo-google-fonts/anek-kannada";
import * as SplashScreen from "expo-splash-screen";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import ConnectAccountScreen from "./components/screens/welcome/ConnectAccountScreen";
import ScorecardScreen from "./components/screens/ScorecardScreen";
import CourseScreen from "./components/screens/CourseScreen";
import AnimatedAppLoader from "./components/screens/loader/AnimatedAppLoader";
import initialize from "./lib/init";
import BottomSheetProvider from "./components/util/BottomSheet/BottomSheetProvider";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectDistrictScreen from "./components/screens/welcome/SelectDistrictScreen";
import AddPhoneNumberScreen from "./components/screens/welcome/AddPhoneNumberScreen";
import VerifyPhoneNumberScreen from "./components/screens/welcome/VerifyPhoneNumberScreen";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import ReAddPhoneNumberScreen from "./components/screens/welcome/ReAddPhoneNumberScreen";
import AddNameScreen from "./components/screens/welcome/AddNameScreen";
import GeneralSettingsScreen from "./components/screens/account/GeneralSettingsScreen";
import GradebookSettingsScreen from "./components/screens/account/GradebookSettingsScreen";
import EditDistrictScreen from "./components/screens/account/EditDistrictScreen";
import EditConnectAccountScreen from "./components/screens/account/EditConnectAccountScreen";
import UserRank from "./lib/types/UserRank";
import InviteOthersScreen from "./components/screens/InviteOthersScreen";
import BottomSheetDisplay from "./components/util/BottomSheet/BottomSheetDisplay";
import Toast from "react-native-toast-message";
import ToastConfig from "./components/util/ToastConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HelpScreen from "./components/screens/HelpScreen";
import RefreshStatus from "./lib/types/RefreshStatus";
import RefreshIndicator from "./components/app/dashboard/RefreshIndicator";
import AppInitializer from "./components/core/AppInitializer";
import { Provider } from "react-redux";
import { store } from "./components/core/state/store";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  const [data, setData] = useState<GradebookRecord | null>(null);
  const [gradeCategory, setGradeCategory] = useState<number>(0);
  const [courseSettings, setCourseSettings] = useState<{
    [key: string]: CourseSettings;
  }>({});

  const dataContext = useMemo(
    () => ({
      data,
      setData,
      gradeCategory,
      setGradeCategory,
      courseSettings,
      setCourseSettings,
      courseOrder: [],
      setCourseOrder: () => {},
    }),
    [data, gradeCategory, setGradeCategory, courseSettings, setCourseSettings]
  );

  const [nextScreen, setNextScreen] = useState("");

  const appearance = useColorScheme();

  const headerOptions = {
    headerStyle: {
      backgroundColor:
        appearance === "dark"
          ? Color.DarkTheme.colors.secondary
          : Color.LightTheme.colors.secondary,
    },
    headerShadowVisible: false,
    headerTitle: "",
  };

  return (
    <Provider store={store}>
      <DataContext.Provider value={dataContext}>
        <MobileDataProvider>
          <AppInitializer
            setAppReady={setAppReady}
            setNextScreen={setNextScreen}
          />
          {!appReady ? (
            <></>
          ) : (
            <AnimatedAppLoader image={require("./assets/splash.png")}>
              <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetProvider>
                    <NavigationContainer
                      theme={{
                        ...(appearance === "dark"
                          ? Color.DarkTheme
                          : Color.LightTheme),
                        dark: appearance === "dark",
                        // @ts-ignore
                        accents:
                          Color.AccentsMatrix[Color.defaultAccentLabel][
                            appearance === "dark" ? "dark" : "default"
                          ],
                        accentLabel: "red",
                      }}
                    >
                      <RefreshIndicator />
                      <BottomSheetDisplay />
                      <Stack.Navigator initialRouteName={nextScreen}>
                        <Stack.Screen
                          name="selectDistrict"
                          component={SelectDistrictScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="connectAccount"
                          component={ConnectAccountScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="addPhoneNumber"
                          component={AddPhoneNumberScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="reAddPhoneNumber"
                          component={ReAddPhoneNumberScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="addName"
                          component={AddNameScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="verifyPhoneNumber"
                          component={VerifyPhoneNumberScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="generalSettings"
                          component={GeneralSettingsScreen}
                          options={{
                            ...headerOptions,
                            headerBackTitle: "All Settings",
                          }}
                        />
                        <Stack.Screen
                          name="gradebookSettings"
                          component={GradebookSettingsScreen}
                          options={{
                            ...headerOptions,
                            headerBackTitle: "All Settings",
                          }}
                        />
                        <Stack.Screen
                          name="editDistrict"
                          component={EditDistrictScreen}
                          options={{
                            ...headerOptions,
                            headerBackTitle: "Back",
                          }}
                        />
                        <Stack.Screen
                          name="editConnectAccount"
                          component={EditConnectAccountScreen}
                          options={{
                            ...headerOptions,
                            headerBackTitle: "Back",
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
                        <Stack.Screen
                          name="inviteOthers"
                          component={InviteOthersScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="help"
                          component={HelpScreen}
                          options={{
                            ...headerOptions,
                            headerBackTitle: "Back",
                          }}
                        />
                      </Stack.Navigator>
                      <ToastConfig />
                    </NavigationContainer>
                  </BottomSheetProvider>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </AnimatedAppLoader>
          )}
        </MobileDataProvider>
      </DataContext.Provider>
    </Provider>
  );
}
