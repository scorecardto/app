import {AppState, Linking, View} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CurrentGradesScreen from "./CurrentGradesScreen";
import ArchiveScreen from "./ArchiveScreen";
import AccountScreen from "./account/AccountScreen";
import { NavigationProp } from "@react-navigation/native";
import TabBar from "../navigation/TabBar";
import ClubsScreen from "./clubs/ClubsScreen";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { updateStatus } from "../../lib/updateStatus";
import { setSocialConnected } from "../core/state/social/socialSlice";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
import {refreshImageCache} from "../../lib/refreshImageCache";
import {getCurrentToken, requestPermissions} from "../../lib/backgroundNotifications";
import axios from "redaxios";
import {unpinUnknownCourses} from "../core/state/widget/widgetSlice";

const Tab = createMaterialTopTabNavigator();

export default function ScorecardScreen(props: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (user) {
      requestPermissions().then(async () =>
          getCurrentToken() && axios.post("https://api.scorecardgrades.com/v1/register_token", {
            pushToken: getCurrentToken()
          }, {
            headers: { Authorization: await user.getIdToken() }
          })
      );
    }
  }

  useEffect(() => {
    const checkURL = (url: string | null) => {
      const joinPrefix = "https://scorecardgrades.com/joinclub/";

      if (url?.startsWith(joinPrefix)) {
        props.navigation.navigate("joinClub", { clubCode: url.slice(joinPrefix.length) });
      }
    };
    Linking.getInitialURL().then(checkURL);

    const urlListener = Linking.addEventListener('url',({url})=>{
      checkURL(url);
    });

    const authListener = auth().onAuthStateChanged(onAuthStateChanged);

    refreshImageCache();
    dispatch(unpinUnknownCourses(courses.map((c) => c.key)));

    return () => {
      authListener();
      urlListener.remove();
    } // unsubscribe on unmount
  }, []);

  const dispatch = useDispatch();

  const courses = useSelector(
    (s: RootState) => s.gradeData.record?.courses || [],
    () => true
  );

  useEffect(() => {
    if (courses && user) {
      user?.getIdToken().then((token) => {
        updateStatus(courses, token).then((s) => {
          dispatch(setSocialConnected(s));
        });
      });
    }
  }, [user]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Tab.Navigator tabBar={TabBar} initialRouteName="Grades">
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
          name="Clubs"
          component={ClubsScreen}
          initialParams={{
            color: "#265AE0",
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
    </View>
  );
}
