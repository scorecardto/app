import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CurrentGradesScreen from "./CurrentGradesScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import ArchiveScreen from "./ArchiveScreen";
import AccountScreen from "./account/AccountScreen";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useFooterHeight from "../util/hooks/useFooterHeight";
import { NavigationProp, useTheme } from "@react-navigation/native";
import BottomSheetDisplay from "../util/BottomSheet/BottomSheetDisplay";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FinalWelcomeScreen from "./welcome/FinalWelcomeScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { enableAllNotifications } from "../core/state/user/notificationSettingsSlice";
import * as Notifications from "expo-notifications";
import Storage from "expo-storage";
import { registerNotifs } from "../../lib/backgroundNotifications";
const Tab = createBottomTabNavigator();

export default function ScorecardScreen(props: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const insets = React.useContext(SafeAreaInsetsContext);
  const height = useFooterHeight();
  const { colors } = useTheme();

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(
    props.route.params?.firstTime === true ? true : false
  );

  const doneFetchingGrades = useSelector(
    (state: RootState) => state.gradeData.record !== null
  );

  const courses = useSelector(
    (state: RootState) => state.gradeData.record?.courses || [],
    (prevState, newState) => {
      return prevState.length === newState.length;
    }
  );
  const courseKeys = useSelector(
    (state: RootState) =>
      state.gradeData.record?.courses.map((c) => c.key) || []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.route.params?.firstTime === true && doneFetchingGrades) {
      Notifications.getPermissionsAsync().then((permissions) => {
        if (permissions.status === "granted") {
          dispatch(
            enableAllNotifications({
              keys: courseKeys,
            })
          );

          courseKeys.forEach((courseKey, idx) => {
            const displayName = courses.find((c) => c.key === courseKey)?.name;
            registerNotifs(courseKey, displayName, false);
          });
        }
      });
    }
  }, [doneFetchingGrades]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          lazy: true,
        }}
        tabBar={(props) => (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.card,
              height: height,
              borderTopWidth: 0,
              elevation: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              paddingBottom: (insets?.bottom ?? 0) / 2,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.1,
            }}
          >
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = props.state.index === index;

              const onPress = () => {
                const event = props.navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                props.navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <TouchableWithoutFeedback
                  key={index}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                >
                  <View
                    style={{
                      paddingHorizontal: 40,
                      paddingVertical: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {options?.tabBarIcon?.({
                      focused: isFocused,
                      size: 28,
                      color: isFocused ? colors.primary : colors.text,
                    })}
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        )}
        // tabBarPosition="bottom"
        initialRouteName="current"
      >
        <Tab.Screen
          name="account"
          component={AccountScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="person-circle"
                size={size}
                color={focused ? colors.primary : colors.text}
              />
            ),
          }}
        />
        <Tab.Screen
          name="current"
          component={CurrentGradesScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <Foundation
                name="home"
                size={size}
                color={focused ? colors.primary : colors.text}
              />
            ),
          }}
        />
        <Tab.Screen
          name="archive"
          component={ArchiveScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="time"
                size={size}
                color={focused ? colors.primary : colors.text}
              />
            ),
          }}
        />
      </Tab.Navigator>
      {showWelcomeScreen && (
        <FinalWelcomeScreen
          close={() => {
            setShowWelcomeScreen(false);
          }}
        />
      )}
    </View>
  );
}
