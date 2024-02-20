import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, useColorScheme } from "react-native";
import MobileDataProvider from "./components/core/context/MobileDataProvider";
import { useEffect, useRef, useState } from "react";
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
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./components/core/state/store";
import FinalWelcomeScreen from "./components/screens/welcome/FinalWelcomeScreen";
import { getFeatureFlag } from "./lib/featureFlag";
import HelpOnboardingScreen from "./components/screens/HelpOnboardingScreen";
import {setupForegroundNotifications, setupBackgroundNotifications, registerToken} from "./lib/backgroundNotifications";

SplashScreen.preventAutoHideAsync();
registerToken();
setupBackgroundNotifications();
setupForegroundNotifications();

const Stack = createNativeStackNavigator();

export default function App(props: { resetKey: string }) {
  const [appReady, setAppReady] = useState(false);

  const [nextScreen, setNextScreen] = useState("");

  const appearance = useColorScheme();

  const allowDarkMode = useSelector((r: RootState) =>
    getFeatureFlag("ALLOW_DARK_MODE", r.userRank.type)
  );
  const headerOptions = {
    headerStyle: {
      backgroundColor:
        appearance === "dark" && allowDarkMode
          ? Color.DarkTheme.colors.secondary
          : Color.LightTheme.colors.secondary,
    },
    headerShadowVisible: false,
    headerTitle: "",
  };

  const routeNameRef = useRef<string | null>(null);
  const navigationRef =
    useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  return (
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
                  ref={navigationRef}
                  onStateChange={async () => {
                    const previousRouteName = routeNameRef.current;
                    const currentRouteName =
                      navigationRef.current?.getCurrentRoute()?.name;

                    if (currentRouteName == null) return;

                    if (previousRouteName !== currentRouteName) {
                      // analytics().setd
                      await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                      });
                      console.log("Screen view logged: " + currentRouteName);
                    }

                    routeNameRef.current = currentRouteName;
                  }}
                  theme={{
                    ...(appearance === "dark" && allowDarkMode
                      ? Color.DarkTheme
                      : Color.LightTheme),
                    dark: appearance === "dark" && allowDarkMode,
                    // @ts-ignore
                    accents:
                      Color.AccentsMatrix[Color.defaultAccentLabel][
                        appearance === "dark" && allowDarkMode
                          ? "dark"
                          : "default"
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
                    <Stack.Screen
                      name="helpOnboarding"
                      component={HelpOnboardingScreen}
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
  );
}
