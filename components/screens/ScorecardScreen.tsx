import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CurrentGradesScreen from "./CurrentGradesScreen";
import ArchiveScreen from "./ArchiveScreen";
import AccountScreen from "./account/AccountScreen";
import { NavigationProp } from "@react-navigation/native";
import TabBar from "../navigation/TabBar";
import ClubsScreen from "./ClubsScreen";

const Tab = createMaterialTopTabNavigator();

export default function ScorecardScreen(props: {
  navigation: NavigationProp<any>;
  route: any;
}) {
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
            color: "#113157",
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
