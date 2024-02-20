import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, useColorScheme } from "react-native";
import MobileDataProvider from "./components/core/context/MobileDataProvider";
import {useEffect, useState} from "react";
import Color from "./lib/Color";
import * as SplashScreen from "expo-splash-screen";
import ConnectAccountScreen from "./components/screens/welcome/ConnectAccountScreen";
import ScorecardScreen from "./components/screens/ScorecardScreen";
import CourseScreen from "./components/screens/CourseScreen";
import AnimatedAppLoader from "./components/screens/loader/AnimatedAppLoader";
import BottomSheetProvider from "./components/util/BottomSheet/BottomSheetProvider";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectDistrictScreen from "./components/screens/welcome/SelectDistrictScreen";
import AddPhoneNumberScreen from "./components/screens/welcome/AddPhoneNumberScreen";
import VerifyPhoneNumberScreen from "./components/screens/welcome/VerifyPhoneNumberScreen";
import ReAddPhoneNumberScreen from "./components/screens/welcome/ReAddPhoneNumberScreen";
import AddNameScreen from "./components/screens/welcome/AddNameScreen";
import GeneralSettingsScreen from "./components/screens/account/GeneralSettingsScreen";
import GradebookSettingsScreen from "./components/screens/account/GradebookSettingsScreen";
import EditDistrictScreen from "./components/screens/account/EditDistrictScreen";
import EditConnectAccountScreen from "./components/screens/account/EditConnectAccountScreen";
import InviteOthersScreen from "./components/screens/InviteOthersScreen";
import BottomSheetDisplay from "./components/util/BottomSheet/BottomSheetDisplay";
import ToastConfig from "./components/util/ToastConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HelpScreen from "./components/screens/HelpScreen";
import RefreshIndicator from "./components/app/dashboard/RefreshIndicator";
import AppInitializer from "./components/core/AppInitializer";
import { Provider } from "react-redux";
import { store } from "./components/core/state/store";
import FinalWelcomeScreen from "./components/screens/welcome/FinalWelcomeScreen";
import {setupForegroundNotifications, setupBackgroundNotifications, registerToken} from "./lib/backgroundNotifications";

SplashScreen.preventAutoHideAsync();
setupBackgroundNotifications();
setupForegroundNotifications();

const Stack = createNativeStackNavigator();

export default function App(props: { resetKey: string }) {
  useEffect(registerToken, []);

  const [appReady, setAppReady] = useState(false);

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
    <Provider store={store} key={props.resetKey}>
      <MobileDataProvider>
        <AppInitializer
          resetKey={props.resetKey}
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
    </Provider>
  );
}
