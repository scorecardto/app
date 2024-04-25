import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as Contacts from "expo-contacts";
import React, { useEffect, useState } from "react";
import axios from "redaxios";
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
import TabBar from "../navigation/TabBar";

const Tab = createMaterialTopTabNavigator();

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
      state.gradeData.record?.courses.map((c) => c.key) || [],
    (prevState, newState) => {
      return prevState.length === newState.length;
    }
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
      <Tab.Navigator initialRouteName={"Grades"} tabBar={TabBar}>
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          initialParams={{
            color: "#3A7885",
          }}
        />
        <Tab.Screen
          name="Grades"
          component={CurrentGradesScreen}
          initialParams={{
            color: "#4798E5",
          }}
        />
        <Tab.Screen
          name="Archive"
          component={ArchiveScreen}
          initialParams={{
            color: "#853A5A",
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
